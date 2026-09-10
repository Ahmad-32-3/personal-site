import { canvasesMayRun, watchCanvasPause } from "@/lib/canvas-pause"
import { motionBoost } from "@/lib/motion-boost"

export function startAmbientStars(
  section: HTMLElement,
  canvas: HTMLCanvasElement
): () => void {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches
  const context = canvas.getContext("2d")
  if (!context) return () => {}
  const g: CanvasRenderingContext2D = context
  const D = Math.min(devicePixelRatio || 1, RM ? 1 : 1.5)
  let W = 0
  let H = 0
  let st: {
    x: number
    y: number
    r: number
    tw: number
    vy: number
    vx: number
  }[] = []
  let onScreen = false
  let raf = 0
  let lastNow = 0

  function size() {
    W = canvas.width = Math.max(2, section.offsetWidth * D)
    H = canvas.height = Math.max(2, section.offsetHeight * D)
    const n = Math.min(
      RM ? 40 : Math.round((section.offsetWidth * section.offsetHeight) / 24000),
      160
    )
    st = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: (Math.random() * 1 + 0.3) * D,
      tw: Math.random() * 6,
      vy: (-0.02 - Math.random() * 0.05) * D,
      vx: (Math.random() - 0.5) * 0.02 * D,
    }))
  }

  function draw(t: number, steps = 1) {
    g.clearRect(0, 0, W, H)
    g.globalCompositeOperation = "lighter"
    for (const s of st) {
      s.x += s.vx * steps
      s.y += s.vy * steps
      if (s.y < 0) s.y = H
      if (s.x < 0) s.x = W
      if (s.x > W) s.x = 0
      const a = 0.16 + 0.34 * Math.abs(Math.sin(t * 0.0006 + s.tw))
      g.fillStyle = `rgba(150,175,220,${a})`
      g.beginPath()
      g.arc(s.x, s.y, s.r, 0, 7)
      g.fill()
    }
    g.globalCompositeOperation = "source-over"
  }

  function mayAnimate() {
    return !RM && onScreen && canvasesMayRun()
  }

  function kick() {
    cancelAnimationFrame(raf)
    raf = 0
    lastNow = 0
    if (mayAnimate()) raf = requestAnimationFrame(loop)
  }

  function loop(now: number) {
    const dt = lastNow ? Math.min(0.05, (now - lastNow) / 1000) : 1 / 60
    lastNow = now
    const steps = Math.max(1, Math.min(6, Math.round(dt * 60 * motionBoost())))
    draw(now, steps)
    if (mayAnimate()) raf = requestAnimationFrame(loop)
  }

  size()
  draw(0)
  const onResize = () => {
    size()
    if (!mayAnimate() || RM) draw(0)
  }
  addEventListener("resize", onResize)

  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        onScreen = e.isIntersecting
        kick()
      })
    },
    { threshold: 0 }
  )
  io.observe(section)
  const unwatchPause = watchCanvasPause(kick)

  return () => {
    onScreen = false
    cancelAnimationFrame(raf)
    unwatchPause()
    io.disconnect()
    removeEventListener("resize", onResize)
  }
}
