"""Claude menulis skrip video TikTok terstruktur."""
import os

import anthropic

TOOL = {
    "name": "buat_skrip",
    "description": "Skrip video TikTok edukasi vertikal 9:16.",
    "input_schema": {
        "type": "object",
        "properties": {
            "hook": {"type": "string", "description": "Kalimat pembuka <3 detik"},
            "scenes": {
                "type": "array",
                "minItems": 3,
                "maxItems": 6,
                "items": {
                    "type": "object",
                    "properties": {
                        "narasi": {"type": "string", "description": "Teks yang diucapkan, Bahasa Indonesia"},
                        "visual_prompt": {"type": "string", "description": "Prompt video AI dalam Bahasa Inggris, tanpa teks/orang nyata"},
                    },
                    "required": ["narasi", "visual_prompt"],
                },
            },
            "caption": {"type": "string", "description": "Maks 150 karakter"},
            "hashtags": {"type": "array", "items": {"type": "string"}, "maxItems": 5},
        },
        "required": ["hook", "scenes", "caption", "hashtags"],
    },
}


def write_script(judul: str, konteks: str, durasi_detik: int = 45) -> dict:
    client = anthropic.Anthropic()
    prompt = (
        f"Buat skrip video TikTok edukasi (~{durasi_detik} detik) untuk siswa SMP tentang: {judul}.\n"
        "Gaya santai, akurat secara ilmiah, mulai dengan hook yang bikin penasaran, akhiri ajakan singkat.\n"
        + (f"Gunakan materi ini sebagai sumber fakta:\n{konteks}" if konteks else "")
    )
    resp = client.messages.create(
        model=os.getenv("CLAUDE_MODEL", "claude-sonnet-5-5"),
        max_tokens=2000,
        tools=[TOOL],
        tool_choice={"type": "tool", "name": "buat_skrip"},
        messages=[{"role": "user", "content": prompt}],
    )
    return next(b.input for b in resp.content if b.type == "tool_use")
