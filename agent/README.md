# Agent TikTok

Alur: topik/materi → skrip (Claude) → klip video AI per scene + narasi suara → rakit 9:16 (ffmpeg) → upload (TikTok Content Posting API).

## Pakai
```bash
cd agent
pip install -r requirements.txt     # butuh ffmpeg & node terpasang
cp .env.example .env                # isi API key
python main.py --dry-run            # cek skrip dulu (gratis)
python main.py                      # buat video, lalu tanya sebelum upload
```
Tambah `--auto-upload` untuk upload otomatis tanpa konfirmasi; jalankan terjadwal dengan cron.

## Setup TikTok
1. Daftar di developers.tiktok.com, buat app, aktifkan **Content Posting API** (scope `video.publish`).
2. Lakukan OAuth untuk akun TikTok-mu → isi `TIKTOK_ACCESS_TOKEN` (token kedaluwarsa; perlu refresh token untuk otomatis jangka panjang).
3. App yang belum lolos **audit** TikTok hanya bisa posting privat (`SELF_ONLY`). Ajukan audit agar bisa publik.

## Catatan
- Biaya: setiap klip video AI berbayar; `--dry-run` untuk uji skrip.
- Beri label konten AI sesuai kebijakan TikTok dan periksa akurasi materi sebelum publik.
