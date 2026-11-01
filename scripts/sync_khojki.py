"""Copy Khojki walkthrough + demo static files into public/.

usage: python scripts/sync_khojki.py
"""

from __future__ import annotations

import shutil
from pathlib import Path

KHOJKI = Path(r"C:\dev\khojki")
SITE = Path(r"C:\dev\personal-site")
WALK = SITE / "public" / "ocr-walkthrough"
DEMO = SITE / "public" / "ocr-demo"

SKIP_SITE = {"VOICE.md"}


def sync_walkthrough() -> None:
    src = KHOJKI / "site"
    if not (src / "index.html").is_file():
        raise SystemExit(f"missing {src / 'index.html'}")
    if WALK.exists():
        shutil.rmtree(WALK)
    WALK.mkdir(parents=True)
    for path in src.rglob("*"):
        if not path.is_file():
            continue
        if path.name in SKIP_SITE:
            continue
        rel = path.relative_to(src)
        dest = WALK / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, dest)
    print(f"copied {src} -> {WALK}")


def sync_demo() -> None:
    src = KHOJKI / "demo"
    files = ("index.html", "NotoSansKhojki-Regular.ttf")
    for name in files:
        if not (src / name).is_file():
            raise SystemExit(f"missing {src / name}")
    if DEMO.exists():
        shutil.rmtree(DEMO)
    DEMO.mkdir(parents=True)
    for name in files:
        shutil.copy2(src / name, DEMO / name)
    previews = src / "previews"
    if previews.is_dir():
        dest = DEMO / "previews"
        shutil.copytree(previews, dest)
        print(f"copied {previews} -> {dest}")
    print(f"copied demo static files -> {DEMO}")


def main() -> None:
    sync_walkthrough()
    sync_demo()


if __name__ == "__main__":
    main()
