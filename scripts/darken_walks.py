"""Force dark themes on light walkthroughs, then rebuild into public/work."""

from __future__ import annotations

import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from embed_walks import PUBLIC, build_one, embed_echoask

SITE = Path(r"C:\dev\personal-site")

INK_WARM = {
    "fg-hi": "#e8ebe3",
    "fg": "#b4b8ac",
    "fg-low": "#7a7e74",
    "good": "#74b982",
    "good-soft": "#12291f",
    "amber": "#d9a94a",
    "amber-soft": "#332a18",
    "bad": "#e0805c",
    "bad-soft": "#331714",
}

INK_COOL = {
    "fg-hi": "#e7eaf2",
    "fg": "#aeb5c7",
    "fg-low": "#767e92",
    "good": "#3fbe8c",
    "good-soft": "#12291f",
    "amber": "#d9a94a",
    "amber-soft": "#332a18",
    "bad": "#ec7568",
    "bad-soft": "#331714",
}


def palette(ink: dict, **extra: str) -> dict[str, str]:
    out = dict(ink)
    out.update(extra)
    return out


# Full token surfaces for each light field-kit walk.
THEMES: dict[str, dict[str, str]] = {
    "airtrue": palette(
        INK_WARM,
        **{
            "bg-page": "#0e1412",
            "bg-sunk": "#0a100e",
            "bg-surface": "#161c18",
            "bg-raised": "#161c18",
            "bg-accent-wash": "#1a2820",
            "line-hairline": "#243028",
            "line-rule": "#2e3c34",
            "line-strong": "#3d4e44",
            "accent": "#6ec4a8",
            "accent-bright": "#8fdcc4",
            "accent-deep": "#3d9a80",
            "good": "#6ec4a8",
            "steel": "#7a9bb0",
        },
    ),
    "dighere": palette(
        INK_COOL,
        **{
            "bg-page": "#0c1416",
            "bg-sunk": "#080f12",
            "bg-surface": "#141c1e",
            "bg-raised": "#141c1e",
            "bg-accent-wash": "#143028",
            "line-hairline": "#1e3034",
            "line-rule": "#2a3c40",
            "line-strong": "#3a5054",
            "accent": "#4ec8c4",
            "accent-bright": "#7ad8d4",
            "accent-deep": "#2a8a88",
            "good": "#4ec8c4",
            "steel": "#8aa0b0",
        },
    ),
    "spanwatch": palette(
        INK_COOL,
        **{
            "bg-page": "#101214",
            "bg-sunk": "#0c0e10",
            "bg-surface": "#181a1e",
            "bg-raised": "#181a1e",
            "bg-accent-wash": "#1c2428",
            "line-hairline": "#2a3038",
            "line-rule": "#3a4048",
            "line-strong": "#505860",
            "accent": "#8aa8c4",
            "accent-bright": "#b0c4d8",
            "accent-deep": "#5a7a96",
            "steel": "#8aa8c4",
        },
    ),
    "glitchname": palette(
        INK_COOL,
        **{
            "bg-page": "#0c0a12",
            "bg-sunk": "#08080e",
            "bg-surface": "#16141c",
            "bg-raised": "#16141c",
            "bg-accent-wash": "#241830",
            "line-hairline": "#2a2438",
            "line-rule": "#3a3048",
            "line-strong": "#504060",
            "accent": "#c4a0ff",
            "accent-bright": "#ddc4ff",
            "accent-deep": "#8b6ad4",
            "steel": "#9080b0",
        },
    ),
    "driftalign": palette(
        INK_WARM,
        **{
            "bg-page": "#10140e",
            "bg-sunk": "#0c100a",
            "bg-surface": "#181c14",
            "bg-raised": "#181c14",
            "bg-accent-wash": "#1c2818",
            "line-hairline": "#2a3428",
            "line-rule": "#3a4434",
            "line-strong": "#4a5844",
            "accent": "#8fbc6a",
            "accent-bright": "#b5d49a",
            "accent-deep": "#5a8a48",
            "good": "#8fbc6a",
            "steel": "#7a9a88",
        },
    ),
    "copypath": palette(
        INK_WARM,
        **{
            "bg-page": "#0c1210",
            "bg-sunk": "#080c0a",
            "bg-surface": "#141a16",
            "bg-raised": "#141a16",
            "bg-accent-wash": "#102818",
            "line-hairline": "#1e2e24",
            "line-rule": "#2a3c30",
            "line-strong": "#3a5040",
            "accent": "#4ade80",
            "accent-bright": "#86efac",
            "accent-deep": "#22a05a",
            "good": "#4ade80",
            "steel": "#6a9080",
        },
    ),
    "recallfix": palette(
        INK_WARM,
        **{
            "bg-page": "#10140e",
            "bg-sunk": "#0c100a",
            "bg-surface": "#181c16",
            "bg-raised": "#181c16",
            "bg-accent-wash": "#1a2818",
            "line-hairline": "#2a3428",
            "line-rule": "#3a4434",
            "line-strong": "#4a5844",
            "accent": "#7dbe7a",
            "accent-bright": "#a8d8a4",
            "accent-deep": "#4a8a58",
            "good": "#7dbe7a",
            "steel": "#7a9a88",
        },
    ),
    "splitcheck": palette(
        INK_COOL,
        **{
            "bg-page": "#0e1216",
            "bg-sunk": "#0a0e12",
            "bg-surface": "#16181e",
            "bg-raised": "#16181e",
            "bg-accent-wash": "#182830",
            "line-hairline": "#243038",
            "line-rule": "#344048",
            "line-strong": "#4a5864",
            "accent": "#5aa8d4",
            "accent-bright": "#88c8e8",
            "accent-deep": "#3a7898",
            "steel": "#6a90a8",
        },
    ),
    "flowmatch": palette(
        INK_WARM,
        **{
            "bg-page": "#0e1412",
            "bg-sunk": "#0a100e",
            "bg-surface": "#161c18",
            "bg-raised": "#161c18",
            "bg-accent-wash": "#143028",
            "line-hairline": "#243028",
            "line-rule": "#2e3c34",
            "line-strong": "#3d4e44",
            "accent": "#62d4b8",
            "accent-bright": "#8fe8d0",
            "accent-deep": "#3a9a88",
            "good": "#62d4b8",
            "steel": "#6a9088",
        },
    ),
    "bursttape": palette(
        INK_WARM,
        **{
            "bg-page": "#12100e",
            "bg-sunk": "#0e0c0a",
            "bg-surface": "#1a1614",
            "bg-raised": "#1a1614",
            "bg-accent-wash": "#2a2018",
            "line-hairline": "#302820",
            "line-rule": "#403830",
            "line-strong": "#544840",
            "accent": "#e08a5c",
            "accent-bright": "#f0b090",
            "accent-deep": "#b85a38",
            "good": "#4ec4c8",
            "good-soft": "#102428",
            "amber": "#e08a5c",
            "amber-soft": "#331c14",
            "steel": "#6a8088",
        },
    ),
    "cache-regret": palette(
        INK_WARM,
        **{
            "bg-page": "#12140e",
            "bg-sunk": "#0e100a",
            "bg-surface": "#1a1c14",
            "bg-raised": "#1a1c14",
            "bg-accent-wash": "#282418",
            "line-hairline": "#2e2e20",
            "line-rule": "#3a3828",
            "line-strong": "#4a4834",
            "accent": "#d4b06a",
            "accent-bright": "#ebc878",
            "accent-deep": "#a88840",
            "steel": "#7a9080",
        },
    ),
    "riverkafka": palette(
        INK_COOL,
        **{
            "bg-page": "#0c1418",
            "bg-sunk": "#080e14",
            "bg-surface": "#141c22",
            "bg-raised": "#141c22",
            "bg-accent-wash": "#143028",
            "line-hairline": "#1e3038",
            "line-rule": "#2a4048",
            "line-strong": "#3a5460",
            "accent": "#3db8a8",
            "accent-bright": "#6ed4c8",
            "accent-deep": "#2a8a80",
            "good": "#3db8a8",
            "steel": "#5a90a8",
        },
    ),
}

WALKS: list[dict[str, str]] = [
    {"web": r"C:\dev\sensors\web", "slug": "airtrue"},
    {"web": r"C:\dev\leaks\web", "slug": "dighere"},
    {"web": r"C:\dev\bridges\web", "slug": "spanwatch"},
    {"web": r"C:\dev\glitches\web", "slug": "glitchname"},
    {"web": r"C:\dev\hives\web", "slug": "hivehum"},
    {"web": r"C:\dev\data-science-projects\transport\web", "slug": "driftalign"},
    {"web": r"C:\dev\data-science-projects\circuits\web", "slug": "copypath"},
    {"web": r"C:\dev\ML-projects\hnsw-recall\web", "slug": "recallfix"},
    {"web": r"C:\dev\ML-projects\skew\web", "slug": "splitcheck"},
    {"web": r"C:\dev\data-science-projects\flows\web", "slug": "flowmatch"},
    {"web": r"C:\dev\quant-projects\hawkes-bursts\web", "slug": "bursttape"},
    {"web": r"C:\dev\ML-projects\regret\web", "slug": "cache-regret"},
    {"web": r"C:\dev\ML-projects\river-kafka\web", "slug": "riverkafka"},
    {"web": r"C:\dev\AQ-Tracker", "slug": "aq-tracker"},
]


def set_vars(text: str, mapping: dict[str, str]) -> str:
    text = re.sub(r"color-scheme:\s*light;", "color-scheme: dark;", text, count=1)
    for key, val in mapping.items():
        pat = rf"(--{re.escape(key)}:\s*)[^;]+;"
        text, n = re.subn(pat, rf"\g<1>{val};", text, count=1)
        if n != 1:
            raise SystemExit(f"failed to set --{key} (matches={n})")
    text = text.replace("Light only.", "Dark field kit.")
    text = text.replace("Light only. No purple.", "Dark gravity. Purple is the glitch.")
    text = text.replace(
        "No purple (the sensors are named PurpleAir; the page is not).",
        "Night kit. Accents carry the project, not a light page.",
    )
    return text


def patch_tokens(web: Path, slug: str) -> None:
    theme = THEMES.get(slug)
    if not theme:
        return
    tok = web / "src" / "styles" / "tokens.css"
    if not tok.exists():
        raise SystemExit(f"missing tokens for {slug}: {tok}")
    text = set_vars(tok.read_text(encoding="utf-8"), theme)
    if slug == "glitchname":
        text = text.replace(
            "Field-kit theme: ink on paper, ochre and pine as the two working colors.",
            "Night gravity: LIGO black with a violet glitch.",
            1,
        )
    tok.write_text(text, encoding="utf-8")


def patch_hivehum() -> None:
    css = Path(r"C:\dev\hives\web\src\App.css")
    t = css.read_text(encoding="utf-8")
    t = t.replace(
        """:root {
  --paper: #faf6ef;
  --panel: #fffdf8;
  --ink: #241f1a;
  --ink-soft: #5c5347;
  --line: #e7ddcc;
  --honey: #c8891f;
  --honey-deep: #9c6712;
  --good: #4e8d5b;
  --bad: #bd5a37;
  --mute: #b3a691;
  --mono: 'IBM Plex Mono', ui-monospace, monospace;
  --sans: 'Archivo', system-ui, sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --paper: #17130e;
    --panel: #201a13;
    --ink: #f3ecdf;
    --ink-soft: #b7ab97;
    --line: #362c1f;
    --honey: #e0a53a;
    --honey-deep: #f0bd5a;
    --good: #74b982;
    --bad: #e0805c;
    --mute: #6a5f4d;
  }
}""",
        """:root {
  color-scheme: dark;
  --paper: #17130e;
  --panel: #201a13;
  --ink: #f3ecdf;
  --ink-soft: #b7ab97;
  --line: #362c1f;
  --honey: #e0a53a;
  --honey-deep: #f0bd5a;
  --good: #74b982;
  --bad: #e0805c;
  --mute: #6a5f4d;
  --mono: 'IBM Plex Mono', ui-monospace, monospace;
  --sans: 'Archivo', system-ui, sans-serif;
}""",
        1,
    )
    if "--paper: #faf6ef" in t:
        raise SystemExit("hivehum still has light tokens")
    css.write_text(t, encoding="utf-8")


def patch_echoask() -> None:
    html = Path(r"C:\dev\semantic-cache\case-study.html")
    t = html.read_text(encoding="utf-8")
    t = t.replace(
        """  :root{
    --paper:#F1F3F6; --paper-raised:#FFFFFF; --paper-sunk:#E6E9EF;
    --ink:#181B22; --ink-soft:#4B5163; --ink-faint:#7A8194;
    --line:#D7DCE5; --line-soft:#E4E8EF;
    --signal:#4C5FD9; --signal-ink:#3B49B0; --signal-soft:#E7E9FA;
    --amber:#B8791E; --amber-soft:#F7ECDA;
    --good:#1F8F63; --good-soft:#E4F5EE;
    --bad:#C43E2F; --bad-soft:#FBE7E4;
    --chart-precision:#4C5FD9; --chart-recall:#B8791E; --chart-f1:#9199AC;
    --font-display:"Newsreader",ui-serif,Georgia,serif;
    --font-body:"Archivo",ui-sans-serif,system-ui,sans-serif;
    --font-mono:"IBM Plex Mono",ui-monospace,"SF Mono",Consolas,monospace;
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]){
      --paper:#10141C; --paper-raised:#171C27; --paper-sunk:#0C0F16;
      --ink:#E7EAF2; --ink-soft:#AEB5C7; --ink-faint:#767E92;
      --line:#2A3142; --line-soft:#212736;
      --signal:#8A97F0; --signal-ink:#AEB8FF; --signal-soft:#232A44;
      --amber:#D9A94A; --amber-soft:#332A18;
      --good:#3FBE8C; --good-soft:#12291F;
      --bad:#EC7568; --bad-soft:#331714;
      --chart-precision:#8A97F0; --chart-recall:#D9A94A; --chart-f1:#6B7284;
    }
  }
  :root[data-theme="dark"]{
    --paper:#10141C; --paper-raised:#171C27; --paper-sunk:#0C0F16;
    --ink:#E7EAF2; --ink-soft:#AEB5C7; --ink-faint:#767E92;
    --line:#2A3142; --line-soft:#212736;
    --signal:#8A97F0; --signal-ink:#AEB8FF; --signal-soft:#232A44;
    --amber:#D9A94A; --amber-soft:#332A18;
    --good:#3FBE8C; --good-soft:#12291F;
    --bad:#EC7568; --bad-soft:#331714;
    --chart-precision:#8A97F0; --chart-recall:#D9A94A; --chart-f1:#6B7284;
  }""",
        """  :root{
    color-scheme:dark;
    --paper:#10141C; --paper-raised:#171C27; --paper-sunk:#0C0F16;
    --ink:#E7EAF2; --ink-soft:#AEB5C7; --ink-faint:#767E92;
    --line:#2A3142; --line-soft:#212736;
    --signal:#8A97F0; --signal-ink:#AEB8FF; --signal-soft:#232A44;
    --amber:#D9A94A; --amber-soft:#332A18;
    --good:#3FBE8C; --good-soft:#12291F;
    --bad:#EC7568; --bad-soft:#331714;
    --chart-precision:#8A97F0; --chart-recall:#D9A94A; --chart-f1:#6B7284;
    --font-display:"Newsreader",ui-serif,Georgia,serif;
    --font-body:"Archivo",ui-sans-serif,system-ui,sans-serif;
    --font-mono:"IBM Plex Mono",ui-monospace,"SF Mono",Consolas,monospace;
  }""",
        1,
    )
    if "--paper:#F1F3F6" in t:
        raise SystemExit("echoask still has light tokens")
    html.write_text(t, encoding="utf-8")


def patch_aq_tracker() -> None:
    css = Path(r"C:\dev\AQ-Tracker\src\index.css")
    t = css.read_text(encoding="utf-8")
    t = t.replace(
        """:root {
  --ink: #1c2a2e;
  --ink-soft: #3d5258;
  --foam: #fff8ee;
  --coral: #d4553a;
  --gold: #e6b84d;
  --sand: #f3e2c7;
  --ocean-deep: #3a8fb5;
  --ocean-mid: #5eb0c9;
  --ocean-light: #8fd0de;
  --sky-top: #f7d9a8;
  --sky-bot: #b8dce8;
  --shadow: rgba(28, 42, 46, 0.2);""",
        """:root {
  color-scheme: dark;
  --ink: #e8f2f4;
  --ink-soft: #9bb8c0;
  --foam: #142838;
  --foam-crest: #d5ece8;
  --coral: #e07058;
  --gold: #e6b84d;
  --sand: #1e3340;
  --ocean-deep: #0a2233;
  --ocean-mid: #16485c;
  --ocean-light: #3a7a90;
  --sky-top: #0e1a2c;
  --sky-bot: #163048;
  --shadow: rgba(0, 8, 16, 0.5);""",
        1,
    )
    t = t.replace(
        "  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.35);",
        "  text-shadow: 0 2px 0 rgba(0, 8, 16, 0.45);",
        1,
    )
    t = t.replace(
        "  filter: drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 #fff8ee) drop-shadow(0 0 3px #fff8ee);",
        "  filter: drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 var(--gold)) drop-shadow(0 0 3px var(--gold));",
        1,
    )
    t = t.replace(
        "  background: rgba(255, 248, 238, 0.9);",
        "  background: color-mix(in srgb, var(--foam) 92%, transparent);",
        1,
    )
    t = t.replace(
        "  background: color-mix(in srgb, var(--foam) 94%, white);",
        "  background: var(--foam);",
        1,
    )
    t = t.replace(
        """.mood-pill.chill {
  background: #d4edd8;
  color: #1f5a2c;
}
.mood-pill.meh {
  background: #f5e6b8;
  color: #6a4e10;
}
.mood-pill.spicy {
  background: #f5c9a8;
  color: #8a3a12;
}
.mood-pill.yikes {
  background: #f2b4b0;
  color: #7a1818;
}""",
        """.mood-pill.chill {
  background: #163024;
  color: #74b982;
}
.mood-pill.meh {
  background: #332a18;
  color: #d9a94a;
}
.mood-pill.spicy {
  background: #331c14;
  color: #e0805c;
}
.mood-pill.yikes {
  background: #331414;
  color: #ec7568;
}""",
        1,
    )
    t = t.replace("  background: white;", "  background: var(--foam);", 1)
    t = t.replace("  background: #fff5f3;", "  background: #331714;", 1)
    if "--foam: #fff8ee" in t or "--ocean-deep: #3a8fb5" in t:
        raise SystemExit("aq-tracker still has light tokens")
    css.write_text(t, encoding="utf-8")

    svg = Path(r"C:\dev\AQ-Tracker\src\components\OceanBackdrop.tsx")
    svg.write_text(
        """/** Full-bleed cartoony ocean + sky — SVG so waves read as water, not a flat band. */
export function OceanBackdrop() {
  return (
    <div className="ocean-backdrop" aria-hidden>
      <svg className="ocean-backdrop-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--sky-top)" />
            <stop offset="45%" stopColor="#142438" />
            <stop offset="100%" stopColor="var(--sky-bot)" />
          </linearGradient>
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ocean-light)" />
            <stop offset="35%" stopColor="var(--ocean-mid)" />
            <stop offset="100%" stopColor="var(--ocean-deep)" />
          </linearGradient>
          <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe9a8" />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>

        <rect width="1200" height="800" fill="url(#skyGrad)" />

        {/* moon */}
        <circle cx="980" cy="120" r="54" fill="url(#sunGrad)" opacity="0.9" />
        <circle cx="980" cy="120" r="88" fill="var(--gold)" opacity="0.12" />

        {/* distant haze band */}
        <ellipse cx="600" cy="340" rx="700" ry="48" fill="var(--ocean-light)" opacity="0.18" />

        {/* ocean body */}
        <path
          d="M0 360
             C150 340 300 380 450 355
             C600 330 750 375 900 350
             C1050 325 1150 360 1200 345
             L1200 800 L0 800 Z"
          fill="url(#seaGrad)"
        />

        {/* layered cartoon wave ridges */}
        <path
          className="sea-ridge sea-ridge--1"
          d="M-40 410 C120 385 240 435 400 410 C560 385 700 440 860 415 C1000 395 1120 430 1240 410"
          fill="none"
          stroke="var(--ocean-light)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          className="sea-ridge sea-ridge--2"
          d="M-20 470 C140 445 280 500 440 470 C620 435 760 505 940 475 C1080 455 1180 490 1260 470"
          fill="none"
          stroke="var(--ocean-mid)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          className="sea-ridge sea-ridge--3"
          d="M-30 540 C160 515 300 570 470 545 C650 515 800 580 980 550 C1100 532 1200 560 1260 545"
          fill="none"
          stroke="var(--ocean-deep)"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* foam scallops near mid */}
        <path
          d="M80 390 Q110 375 140 390 Q170 405 200 390 Q230 375 260 390"
          fill="none"
          stroke="var(--foam-crest)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M720 400 Q750 385 780 400 Q810 415 840 400 Q870 385 900 400"
          fill="none"
          stroke="var(--foam-crest)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* deep water tint at bottom */}
        <rect x="0" y="640" width="1200" height="160" fill="#061820" opacity="0.45" />

        {/* tiny birds */}
        <path d="M220 150 Q230 142 240 150" fill="none" stroke="var(--ink-soft)" strokeWidth="3" strokeLinecap="round" />
        <path d="M250 165 Q262 155 274 165" fill="none" stroke="var(--ink-soft)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}
""",
        encoding="utf-8",
    )


def main() -> int:
    print("1 hivehum")
    patch_hivehum()
    print("2 echoask")
    patch_echoask()
    print("3 aq-tracker")
    patch_aq_tracker()

    for w in WALKS:
        slug = w["slug"]
        if slug in THEMES:
            print(f"tokens {slug}")
            patch_tokens(Path(w["web"]), slug)

    PUBLIC.mkdir(parents=True, exist_ok=True)
    print(embed_echoask())

    results: list[str] = []
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
