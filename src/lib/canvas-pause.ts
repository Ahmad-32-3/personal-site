type Listener = () => void

const listeners = new Set<Listener>()
let overlayOpen = false
let scrolling = false
let scrollIdle = 0

function emit() {
  listeners.forEach((fn) => fn())
}

export function setWalkOverlayOpen(open: boolean) {
  if (overlayOpen === open) return
  overlayOpen = open
  emit()
}

function setScrolling(next: boolean) {
  if (scrolling === next) return
  scrolling = next
  document.documentElement.classList.toggle("is-scrolling", next)
  emit()
}

export function canvasesMayRun() {
  return !overlayOpen && !scrolling && document.visibilityState === "visible"
}

export function watchCanvasPause(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function beginScroll() {
  setScrolling(true)
  window.clearTimeout(scrollIdle)
  scrollIdle = window.setTimeout(() => setScrolling(false), 180)
}

function endScroll() {
  window.clearTimeout(scrollIdle)
  setScrolling(false)
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", emit)
  window.addEventListener("wheel", beginScroll, { passive: true })
  window.addEventListener("touchmove", beginScroll, { passive: true })
  window.addEventListener("scroll", beginScroll, { passive: true })
  window.addEventListener("scrollend", endScroll, { passive: true })
}
