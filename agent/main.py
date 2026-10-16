"""Agent TikTok: topik -> skrip (Claude) -> video AI + suara -> (persetujuan) -> upload.

  python main.py                       # pakai materi dari data.js
  python main.py --topic "Daur air"    # topik bebas
  python main.py --dry-run             # hanya skrip, tanpa biaya video/upload
  python main.py --auto-upload         # lewati konfirmasi sebelum upload
"""
import argparse
import json
import time
from pathlib import Path

from dotenv import load_dotenv

import scriptwriter
import tiktok
import topic
import video


def main() -> None:
    load_dotenv()
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic")
    ap.add_argument("--duration", type=int, default=45)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--auto-upload", action="store_true")
    a = ap.parse_args()

    judul, konteks = topic.context_for(a.topic)
    script = scriptwriter.write_script(judul, konteks, a.duration)
    out = Path("output") / time.strftime("%Y%m%d-%H%M%S")
    out.mkdir(parents=True, exist_ok=True)
    (out / "script.json").write_text(json.dumps(script, ensure_ascii=False, indent=2))
    caption = f"{script['caption']} " + " ".join(f"#{h.lstrip('#')}" for h in script["hashtags"])
    print(f"Skrip tersimpan: {out / 'script.json'}\nCaption: {caption}")
    if a.dry_run:
        return

    final = video.build_video(script, out)
    print(f"Video jadi: {final}")
    if not a.auto_upload and input("Upload ke TikTok? [y/N] ").lower() != "y":
        return
    print("publish_id:", tiktok.upload(final, caption))


if __name__ == "__main__":
    main()
