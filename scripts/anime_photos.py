"""逐集心得的照片：photos-inbox/anime/<動畫 id>/ 裡的圖 → public/anime/<id>/<檔名>.webp

依手機拍照的方向轉正、長邊壓到 1600px、清掉圖片資訊（含 GPS）、轉成品質 82 的 WebP，
原圖移到同一資料夾的 done/。執行：npm run photos
"""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
INBOX = ROOT / 'photos-inbox' / 'anime'
OUT = ROOT / 'public' / 'anime'
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'}
LONG_EDGE = 1600

count = 0
for folder in sorted(INBOX.glob('*')) if INBOX.exists() else []:
    if not folder.is_dir() or not folder.name.isdigit():
        continue
    for src in sorted(folder.iterdir()):
        if src.suffix.lower() not in EXTS:
            continue
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im)
            has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
            im = im.convert('RGBA' if has_alpha else 'RGB')
            im.thumbnail((LONG_EDGE, LONG_EDGE))
            # 重新建一張圖，確保 EXIF、GPS 等資訊都不會帶過去
            clean = Image.new(im.mode, im.size)
            clean.putdata(list(im.getdata()))
        dest = OUT / folder.name / f'{src.stem}.webp'
        dest.parent.mkdir(parents=True, exist_ok=True)
        clean.save(dest, 'WEBP', quality=82)
        done = folder / 'done'
        done.mkdir(exist_ok=True)
        src.replace(done / src.name)
        count += 1
        print(f'{src.relative_to(ROOT)} -> {dest.relative_to(ROOT)} {clean.size[0]}x{clean.size[1]}')

print(f'{count} photo(s) converted')
