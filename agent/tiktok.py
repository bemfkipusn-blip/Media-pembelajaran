"""Upload via TikTok Content Posting API (Direct Post, FILE_UPLOAD)."""
import os
import time
from pathlib import Path

import requests

BASE = "https://open.tiktokapis.com/v2"
CHUNK = 10 * 1024 * 1024


def upload(video: Path, caption: str) -> str:
    h = {"Authorization": f"Bearer {os.environ['TIKTOK_ACCESS_TOKEN']}",
         "Content-Type": "application/json; charset=UTF-8"}
    size = video.stat().st_size
    chunk = min(size, CHUNK)
    total = max(1, size // chunk)  # chunk terakhir menyerap sisa byte
    r = requests.post(f"{BASE}/post/publish/video/init/", headers=h, timeout=60, json={
        "post_info": {
            "title": caption[:2200],
            "privacy_level": os.getenv("TIKTOK_PRIVACY", "SELF_ONLY"),
            "disable_comment": False,
        },
        "source_info": {"source": "FILE_UPLOAD", "video_size": size,
                        "chunk_size": chunk, "total_chunk_count": total},
    })
    r.raise_for_status()
    data = r.json()
    if data["error"]["code"] != "ok":
        raise RuntimeError(data["error"])
    publish_id, url = data["data"]["publish_id"], data["data"]["upload_url"]

    with video.open("rb") as f:
        for i in range(total):
            start = i * chunk
            body = f.read(chunk if i < total - 1 else size - start)
            requests.put(url, data=body, timeout=300, headers={
                "Content-Type": "video/mp4",
                "Content-Length": str(len(body)),
                "Content-Range": f"bytes {start}-{start + len(body) - 1}/{size}",
            }).raise_for_status()

    for _ in range(30):
        s = requests.post(f"{BASE}/post/publish/status/fetch/", headers=h,
                          json={"publish_id": publish_id}, timeout=60).json()["data"]
        if s["status"] in ("PUBLISH_COMPLETE", "FAILED"):
            if s["status"] == "FAILED":
                raise RuntimeError(s.get("fail_reason"))
            break
        time.sleep(5)
    return publish_id
