"""Generate klip per scene (video AI via Replicate), narasi (edge-tts), lalu rakit dengan ffmpeg."""
import asyncio
import os
import subprocess
import time
from pathlib import Path

import requests


def generate_clip(prompt: str, out: Path) -> Path:
    token = os.environ["REPLICATE_API_TOKEN"]
    model = os.getenv("REPLICATE_VIDEO_MODEL", "google/veo-3-fast")
    h = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    r = requests.post(
        f"https://api.replicate.com/v1/models/{model}/predictions",
        headers=h,
        json={"input": {"prompt": prompt, "aspect_ratio": "9:16"}},
        timeout=60,
    )
    r.raise_for_status()
    pred = r.json()
    while pred["status"] not in ("succeeded", "failed", "canceled"):
        time.sleep(5)
        pred = requests.get(pred["urls"]["get"], headers=h, timeout=60).json()
    if pred["status"] != "succeeded":
        raise RuntimeError(f"Generate video gagal: {pred.get('error')}")
    url = pred["output"] if isinstance(pred["output"], str) else pred["output"][0]
    out.write_bytes(requests.get(url, timeout=300).content)
    return out


def narrate(text: str, out: Path, voice: str = "id-ID-ArdiNeural") -> Path:
    import edge_tts

    asyncio.run(edge_tts.Communicate(text, voice).save(str(out)))
    return out


def _ff(*args: str) -> None:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def _duration(path: Path) -> float:
    o = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(o.stdout)


def build_video(script: dict, workdir: Path) -> Path:
    workdir.mkdir(parents=True, exist_ok=True)
    parts = []
    for i, sc in enumerate(script["scenes"]):
        clip = generate_clip(sc["visual_prompt"], workdir / f"clip{i}.mp4")
        voice = narrate(sc["narasi"] if i else f"{script['hook']} {sc['narasi']}", workdir / f"voice{i}.mp3")
        seg = workdir / f"seg{i}.mp4"
        # Loop klip agar selama narasi, skala/crop ke 1080x1920, ganti audio dengan narasi.
        _ff("-stream_loop", "-1", "-i", str(clip), "-i", str(voice), "-t", f"{_duration(voice) + 0.3:.2f}",
            "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30",
            "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", str(seg))
        parts.append(seg)
    lst = workdir / "list.txt"
    lst.write_text("".join(f"file '{p.name}'\n" for p in parts))
    final = workdir / "final.mp4"
    _ff("-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(final))
    return final
