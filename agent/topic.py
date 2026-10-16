"""Ambil materi dari data.js repo ini (via node) atau dari teks bebas."""
import json
import subprocess
from pathlib import Path

DATA_JS = Path(__file__).resolve().parent.parent / "data.js"


def load_from_data_js() -> dict:
    js = f"{DATA_JS.read_text(encoding='utf-8')}\nconsole.log(JSON.stringify(DATA))"
    out = subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def context_for(topic: str | None) -> tuple[str, str]:
    """Return (judul, konteks materi)."""
    if topic:
        return topic, ""
    d = load_from_data_js()
    teks = "\n".join(f"- {m['judul']}: {m['isi']}" for m in d["materi"])
    return d["judul"], teks
