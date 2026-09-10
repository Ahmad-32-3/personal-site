"""Patch walkthrough names/themes, build with /work/<slug>/, copy into public."""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

SITE = Path(r"C:\dev\personal-site")
PUBLIC = SITE / "public" / "work"

# theme: (bg, accent, bright, deep, wash) — only applied to generic navy clones
DARK = {
    "sentionet": ("#0e1118", "#8b9bff", "#c4cbff", "#6a78e0", "#1c2240"),
    "turnwise": ("#15110e", "#d4894a", "#e8b07a", "#b36b32", "#3a2818"),
    "formulafind": ("#10141a", "#5ec2a4", "#8fdcc4", "#3d9a80", "#16332c"),
    "marketdigest": ("#0f1410", "#3fbe8c", "#74d4ad", "#2d8f68", "#12291f"),
    "marketmood": ("#15100e", "#d9a94a", "#edc878", "#b8882e", "#332a18"),
    "livehedge": ("#0e1412", "#5aa88a", "#8bc4ae", "#3d7d66", "#143028"),
    "quotebook": ("#0e1410", "#4caf7a", "#7dcca0", "#35855a", "#163024"),
    "asofjoin": ("#10141c", "#6b8cae", "#9bb3c9", "#4a6a86", "#1a2430"),
    "cost-autopilot": ("#12140e", "#d7a24a", "#ebc278", "#b07e2e", "#332a18"),
    "pathtape": ("#12110e", "#c4a35a", "#ddc284", "#9a7c3a", "#2e2818"),
    "wordfirst": ("#101218", "#9aa7e8", "#c5cdf5", "#6d7bc4", "#1c2240"),
}

WALKS = [
    {"web": r"C:\dev\chb-mit-eeg\web", "slug": "sentionet", "old": "ictal-risk forecast", "new": "SentioNet", "h1": False},
    {"web": r"C:\dev\buildings\web", "slug": "wattahead", "old": "buildings", "new": "WattAhead", "h1": True},
    {"web": r"C:\dev\sensors\web", "slug": "airtrue", "old": "sensors", "new": "AirTrue", "h1": True},
    {"web": r"C:\dev\leaks\web", "slug": "dighere", "old": "leaks", "new": "DigHere", "h1": True},
    {"web": r"C:\dev\bridges\web", "slug": "spanwatch", "old": "bridges", "new": "SpanWatch", "h1": True},
    {"web": r"C:\dev\glitches\web", "slug": "glitchname", "old": "glitches", "new": "GlitchName", "h1": True},
    {"web": r"C:\dev\data-science-projects\equivariant\web", "slug": "turnwise", "old": "equivariant", "new": "TurnWise", "h1": True},
    {"web": r"C:\dev\data-science-projects\kan-laws\web", "slug": "formulafind", "old": "kan-laws", "new": "FormulaFind", "h1": True},
    {"web": r"C:\dev\data-science-projects\transport\web", "slug": "driftalign", "old": "transport", "new": "DriftAlign", "h1": True},
    {"web": r"C:\dev\quant-projects\vol-cluster\web", "slug": "marketdigest", "old": "vol-cluster", "new": "MarketDigest", "h1": True},
    {"web": r"C:\dev\quant-projects\regimes\web", "slug": "marketmood", "old": "regimes", "new": "MarketMood", "h1": True},
    {"web": r"C:\dev\quant-projects\kalman-spread\web", "slug": "livehedge", "old": "kalman-spread", "new": "LiveHedge", "h1": True},
    {"web": r"C:\dev\data-science-projects\circuits\web", "slug": "copypath", "old": "circuits", "new": "CopyPath", "h1": True},
    {"web": r"C:\dev\data-science-projects\pretext\web", "slug": "trapcam", "old": "pretext", "new": "TrapCam", "h1": True},
    {"web": r"C:\dev\positions\web", "slug": "wordfirst", "old": "positions", "new": "WordFirst", "h1": True},
    {"web": r"C:\dev\ML-projects\hnsw-recall\web", "slug": "recallfix", "old": "hnsw-recall", "new": "RecallFix", "h1": True},
    {"web": r"C:\dev\ML-projects\skew\web", "slug": "splitcheck", "old": "skew", "new": "SplitCheck", "h1": True},
    {"web": r"C:\dev\porter\web", "slug": "porter", "old": "Porter", "new": "Porter", "h1": False},
    {"web": r"C:\dev\grep-vs-embeddings", "slug": "greporembed", "old": None, "new": "GrepOrEmbed", "h1": False},
    {"web": r"C:\dev\cost-autopilot\web", "slug": "cost-autopilot", "old": "cost-autopilot", "new": "Cost Autopilot", "h1": False},
    {"web": r"C:\dev\AQ-Tracker", "slug": "aq-tracker", "old": None, "new": "AQ-Tracker", "h1": False},
    {"web": r"C:\dev\machineDebugger\web", "slug": "machine-debugger", "old": "machineDebugger", "new": "Machine Debugger", "h1": True},
    {"web": r"C:\dev\data-science-projects\flows\web", "slug": "flowmatch", "old": "flows", "new": "FlowMatch", "h1": True},
    {"web": r"C:\dev\quant-projects\exec-path\web", "slug": "pathtape", "old": "exec-path", "new": "PathTape", "h1": True},
    {"web": r"C:\dev\quant-projects\hawkes-bursts\web", "slug": "bursttape", "old": "hawkes-bursts", "new": "BurstTape", "h1": True},
    {"web": r"C:\dev\quant-projects\inventory-quotes\web", "slug": "quotebook", "old": "inventory-quotes", "new": "QuoteBook", "h1": True},
    {"web": r"C:\dev\ML-projects\pitjoin\web", "slug": "asofjoin", "old": "pitjoin", "new": "AsOfJoin", "h1": True},
    {"web": r"C:\dev\ML-projects\regret\web", "slug": "cache-regret", "old": "regret", "new": "Cache Regret", "h1": True},
    {"web": r"C:\dev\ML-projects\river-kafka\web", "slug": "riverkafka", "old": "river-kafka", "new": "RiverKafka", "h1": True},
]


def sub_first(text: str, pattern: str, repl: str, flags=0) -> str:
    return re.sub(pattern, repl, text, count=1, flags=flags)


def patch_names(web: Path, old: str | None, new: str, rename_h1: bool, slug: str) -> None:
    app = web / "src" / "App.tsx"
    if not app.exists():
        app = web / "src" / "App.jsx"
    if app.exists() and old:
        t = app.read_text(encoding="utf-8")
        t = t.replace(f"<b>{old}</b>", f"<b>{new}</b>", 1)
        if rename_h1:
            t = t.replace(f"<h1>{old}</h1>", f"<h1>{new}</h1>", 1)
        app.write_text(t, encoding="utf-8")

    html = web / "index.html"
    if html.exists():
        t = html.read_text(encoding="utf-8")
        t = sub_first(t, r"<title>[^<]*</title>", f"<title>{new}</title>")
        html.write_text(t, encoding="utf-8")

    if slug == "greporembed":
        nav = web / "src" / "App.tsx"
        css = web / "src" / "app.css"
        t = nav.read_text(encoding="utf-8")
        if "GrepOrEmbed" not in t:
            t = t.replace(
                '<nav className="page-nav mono" aria-label="Primary">',
                '<nav className="page-nav mono" aria-label="Primary">\n        <span className="page-nav-mark"><b>GrepOrEmbed</b></span>',
                1,
            )
            nav.write_text(t, encoding="utf-8")
        c = css.read_text(encoding="utf-8")
        if ".page-nav-mark" not in c:
            c = c.replace(
                ".page-nav {",
                ".page-nav-mark { color: var(--fg); margin-right: auto; }\n.page-nav-mark b { font-weight: 600; }\n.page-nav {",
                1,
            )
            css.write_text(c, encoding="utf-8")


def patch_theme(web: Path, slug: str) -> None:
    theme = DARK.get(slug)
    if not theme:
        return
    tok = web / "src" / "styles" / "tokens.css"
    if not tok.exists():
        return
    t = tok.read_text(encoding="utf-8")
    bg, acc, bright, deep, wash = theme
    t = sub_first(t, r"--bg-page:\s*[^;]+;", f"--bg-page: {bg};")
    t = sub_first(t, r"--accent:\s*[^;]+;", f"--accent: {acc};")
    t = sub_first(t, r"--accent-bright:\s*[^;]+;", f"--accent-bright: {bright};")
    t = sub_first(t, r"--accent-deep:\s*[^;]+;", f"--accent-deep: {deep};")
    t = sub_first(t, r"--bg-accent-wash:\s*[^;]+;", f"--bg-accent-wash: {wash};")
    tok.write_text(t, encoding="utf-8")


def build_one(web: Path, slug: str) -> str:
    dest = PUBLIC / slug
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    base = f"/work/{slug}/"
    cmd = f"npm run build -- --base {base}"
    r = subprocess.run(cmd, cwd=web, capture_output=True, text=True, shell=True)
    if r.returncode != 0:
        r2 = subprocess.run(
            f"npx vite build --base {base}",
            cwd=web,
            capture_output=True,
            text=True,
            shell=True,
        )
        if r2.returncode != 0:
            err = (r.stderr or r.stdout or "")[-1500:] + "\n" + (r2.stderr or r2.stdout or "")[-1500:]
            return f"FAIL {slug}\n{err}"
    dist = web / "dist"
    if not dist.exists():
        return f"FAIL {slug} no dist"
    shutil.copytree(dist, dest, dirs_exist_ok=True)
    return f"OK {slug}"


def embed_echoask() -> str:
    src = Path(r"C:\dev\semantic-cache\case-study.html")
    raw = src.read_text(encoding="utf-8")
    raw = raw.replace("<b>semantic-cache</b>", "<b>EchoAsk</b>", 1)
    raw = sub_first(raw, r"<title>[^<]*</title>", "<title>EchoAsk</title>")
    wrapped = (
        "<!doctype html>\n<html lang='en'>\n<head>\n"
        "<meta charset='utf-8'/>\n"
        "<meta name='viewport' content='width=device-width, initial-scale=1'/>\n"
        f"{raw}\n</html>\n"
    )
    dest = PUBLIC / "echoask"
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    (dest / "index.html").write_text(wrapped, encoding="utf-8")
    return "OK echoask"


def main() -> int:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    print(embed_echoask())
    for w in WALKS:
        web = Path(w["web"])
        if not web.exists():
            print("MISSING", w["slug"], web)
            continue
        patch_names(web, w["old"], w["new"], w["h1"], w["slug"])
        patch_theme(web, w["slug"])
        print("patched", w["slug"])

    results = []
    with ThreadPoolExecutor(max_workers=3) as ex:
        futs = {
            ex.submit(build_one, Path(w["web"]), w["slug"]): w["slug"]
            for w in WALKS
            if Path(w["web"]).exists()
        }
        for fut in as_completed(futs):
            msg = fut.result()
            print(msg.split("\n", 1)[0])
            results.append(msg)
            if msg.startswith("FAIL"):
                print(msg[-800:])
    fails = [m for m in results if m.startswith("FAIL")]
    print(f"done {len(results) - len(fails)}/{len(results)}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
