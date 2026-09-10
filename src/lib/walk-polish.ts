function dataUri(inner: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 150" fill="none">${inner}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const C = "#9bb6ff"
const M = "rgba(155,182,255,0.28)"

function p(d: string, extra = "") {
  return `<path d="${d}" stroke="${C}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none" ${extra}/>`
}

function t(x: number, y: number, label: string) {
  return `<text x="${x}" y="${y}" fill="${C}" font-size="11" font-family="ui-monospace, Menlo, monospace">${label}</text>`
}

const DIAG = {
  problem: dataUri(
    `${p("M28 118 H332")}
     ${p("M40 102 L70 70 L100 88 L130 42 L160 76 L190 30 L220 62 L250 48 L280 22 L310 40")}
     <circle cx="250" cy="48" r="10" fill="${M}" />
     ${t(40, 18, "alarm")}
     ${t(248, 18, "no spot")}`
  ),
  answer: dataUri(
    `<rect x="28" y="58" width="92" height="34" rx="4" fill="${M}" />
     <rect x="138" y="28" width="24" height="94" rx="3" fill="${M}" />
     ${p("M120 75 H138")}
     ${p("M162 75 H250")}
     ${p("M280 55 l30 20 -30 20")}
     <circle cx="310" cy="75" r="14" fill="${M}" />
     ${t(40, 80, "in")}
     ${t(258, 24, "rank")}`
  ),
  decisions: dataUri(
    `${p("M40 75 H150")}
     ${p("M150 75 L250 36")}
     ${p("M150 75 L250 114")}
     <circle cx="40" cy="75" r="8" fill="${M}" />
     <circle cx="250" cy="36" r="8" fill="${M}" />
     <circle cx="250" cy="114" r="8" fill="${M}" />
     ${t(262, 40, "skip")}
     ${t(262, 118, "build")}`
  ),
  next: dataUri(
    `${p("M30 110 C90 110 90 40 160 40 S230 110 330 70")}
     <circle cx="30" cy="110" r="6" fill="${M}" />
     <circle cx="160" cy="40" r="6" fill="${M}" />
     <circle cx="330" cy="70" r="6" fill="${M}" />
     ${t(22, 132, "now")}
     ${t(300, 58, "next")}`
  ),
  stack: dataUri(
    `<rect x="24" y="40" width="90" height="70" rx="6" fill="${M}" />
     <rect x="134" y="40" width="90" height="70" rx="6" fill="${M}" />
     <rect x="244" y="40" width="90" height="70" rx="6" fill="${M}" />
     ${p("M40 62 H98")}
     ${p("M150 62 H212")}
     ${p("M260 62 H322")}
     ${t(48, 92, "run")}
     ${t(158, 92, "draw")}
     ${t(268, 92, "score")}`
  ),
  dighereProblem: dataUri(
    `${p("M20 88 H90 V70 H160 V88 H250 V62 H340")}
     <circle cx="160" cy="88" r="8" fill="#e08a5c" />
     ${p("M154 70 l12 -22")}
     ${t(24, 28, "district alarm")}
     ${t(148, 122, "which pipe?")}`
  ),
  dighereAnswer: dataUri(
    `${p("M24 40 H120")}
     ${p("M140 28 V122")}
     ${p("M168 40 H250")}
     ${p("M270 50 l40 25 -40 25")}
     ${t(28, 30, "residual")}
     ${t(176, 30, "every pipe")}
     ${t(278, 40, "top rank")}`
  ),
  copypathProblem: dataUri(
    `${p("M40 40 H140 V110 H40 Z")}
     ${p("M180 40 H280 V110 H180 Z")}
     ${p("M140 75 H180")}
     ${t(62, 80, "copy")}
     ${t(202, 80, "hidden")}`
  ),
}

const empty = ".story-window:not(:has(.story-viz))"

const CSS = `
.story-kicker {
  margin-bottom: 1.5rem !important;
}
.story-beat__copy > h2,
.story-beat__copy h2 {
  margin-top: 0.2rem;
}
.kicker {
  margin-bottom: 1.35rem !important;
  align-items: center;
}
.kicker h2 {
  margin-top: 0.35rem;
}
:root {
  --chart-method: var(--good, #4ec8c4);
  --chart-random: var(--bad, #ec7568);
  --chart-radius: var(--amber, #d9a94a);
  --chart-baseline: var(--fg-low, #767e92);
}
.draw-line,
.path-rail {
  animation: none !important;
  stroke-dasharray: none !important;
  stroke-dashoffset: 0 !important;
}
.mix-cell,
.mood-cell,
.ring-enter {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}
.bar-grow,
.market-bar {
  animation: none !important;
  transform: none !important;
}
${empty}::before {
  content: "";
  display: block;
  aspect-ratio: 360 / 140;
  margin: 0 0 0.75rem;
  background: ${DIAG.problem} center / contain no-repeat;
}
#answer ${empty}::before { background-image: ${DIAG.answer}; }
#decisions ${empty}::before { background-image: ${DIAG.decisions}; }
#next ${empty}::before { background-image: ${DIAG.next}; }
#stack ${empty}::before { background-image: ${DIAG.stack}; }
html[data-slug="dighere"] #problem ${empty}::before { background-image: ${DIAG.dighereProblem}; }
html[data-slug="dighere"] #answer ${empty}::before { background-image: ${DIAG.dighereAnswer}; }
html[data-slug="copypath"] #problem ${empty}::before { background-image: ${DIAG.copypathProblem}; }
html[data-slug="wattahead"] #stack ${empty}::before { background-image: ${DIAG.stack}; }
html[data-slug="bursttape"] #decisions ${empty}::before { background-image: ${DIAG.next}; }
html[data-slug="livehedge"] #decisions ${empty}::before { background-image: ${DIAG.decisions}; }
html[data-slug="greporembed"] .hero-pause { display: none !important; }
`

function slugFromSrc(src: string) {
  const parts = src.split("/").filter(Boolean)
  const work = parts.indexOf("work")
  return work >= 0 ? parts[work + 1] : parts.at(-1) || ""
}

export function polishWalk(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument
  if (!doc) return

  const apply = () => {
    doc.documentElement.dataset.slug = slugFromSrc(frame.src)
    if (!doc.head) return
    let style = doc.getElementById("site-walk-polish")
    if (!style) {
      style = doc.createElement("style")
      style.id = "site-walk-polish"
      doc.head.appendChild(style)
    }
    style.textContent = CSS
  }

  apply()
  let n = 0
  const tick = () => {
    apply()
    n += 1
    if (n < 16) window.setTimeout(tick, 200)
  }
  tick()
}
