#!/usr/bin/env python3
"""Make a text-free poster from a published video (needs ffmpeg + Pillow).
  python make_poster.py VIDEO.mp4 SECONDS Y0 Y1 poster_name.jpg [WIDTH]
Grabs one frame, keeps rows Y0..Y1 (of 1920) so captions/numbers/watermarks are cropped out,
and saves a jpg under assets/img (<= ~120 KB). LOOK at the result: no text, no recognisable face."""
import subprocess, sys, tempfile, pathlib
from PIL import Image
v, t, y0, y1, name = sys.argv[1:6]
w = int(sys.argv[6]) if len(sys.argv) > 6 else 720
tmp = pathlib.Path(tempfile.mkdtemp()) / "f.png"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", v, "-frames:v", "1", str(tmp)], check=True)
im = Image.open(tmp).convert("RGB").crop((0, int(y0), 1080, int(y1)))
im = im.resize((w, round(im.height * w / 1080)), Image.LANCZOS)
out = pathlib.Path(__file__).resolve().parent / "assets" / "img" / name
for q in (80, 70, 60, 50):
    im.save(out, quality=q, optimize=True, progressive=True)
    if out.stat().st_size <= 120_000:
        break
print(out, out.stat().st_size // 1024, "KB", im.size)
