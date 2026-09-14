import { canvasesMayRun, watchCanvasPause } from "@/lib/canvas-pause"
import { motionBoost } from "@/lib/motion-boost"

type Core = {
  tx: number
  ty: number
  x: number
  y: number
  vx: number
  vy: number
  ph: number
  sp: number
  c: number
}

const SEQ = [
  ["MUHAMMAD", "AHMAD"],
  ["ENGINEER"],
  ["DESIGNER"],
  ["BUILDER"],
  ["DEVELOPER"],
  ["MUHAMMAD", "AHMAD"],
]

const PARTICLE_FILL = Array.from(
  { length: 61 },
  (_, i) => `rgba(${175 + i},205,255,0.9)`
)

export function startParticleHero(
  canvas: HTMLCanvasElement,
  hero: HTMLElement
): () => void {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches
  // Phones report a coarse pointer / narrow width. Cap DPR to 1 there so the
  // per-frame fill cost stays sane on mobile GPUs. Desktop is unchanged.
  const MOBILE = matchMedia("(max-width: 768px), (pointer: coarse)").matches
  const DPR = MOBILE ? 1 : Math.min(devicePixelRatio || 1, RM ? 1 : 1.5)
  const context = canvas.getContext("2d", {
    alpha: false,
    desynchronized: true,
  })
  if (!context) return () => {}
  const ctx: CanvasRenderingContext2D = context

  const p = { tx: 0, ty: 0, x: 0, y: 0, mx: -9999, my: -9999, on: 0 }
  let W = 0
  let H = 0
  let cx = 0
  let cy = 0
  let sets: number[][][] = []
  let core: Core[] = []
  let idx = 0
  let timer = 0
  let lastNow = 0
  let stars: { x: number; y: number; r: number; tw: number }[] = []
  let orbit: { a: number; r: number; ry: number; sp: number; sz: number }[] = []
  let onScreen = true
  let raf = 0
  let builtW = 0
  let resizeTimer = 0
  let cancelled = false
  const back: number[][] = []
  const front: number[][] = []

  function sample(lines: string[]) {
    const o = document.createElement("canvas")
    o.width = innerWidth
    o.height = innerHeight
    const g = o.getContext("2d")
    if (!g) return [] as number[][]
    g.fillStyle = "#fff"
    g.textAlign = "center"
    g.textBaseline = "middle"
    const two = lines.length > 1
    const fs = Math.min(
      innerWidth * (two ? 0.135 : 0.19),
      innerHeight * 0.24,
      two ? 180 : 240
    )
    g.font = `800 ${fs}px "Bricolage Grotesque",sans-serif`
    const X = innerWidth / 2
    const Y = innerHeight * 0.42
    const n = lines.length
    lines.forEach((ln, i) =>
      g.fillText(ln, X, Y + (i - (n - 1) / 2) * fs * 0.9)
    )
    const d = g.getImageData(0, 0, innerWidth, innerHeight).data
    const st = innerWidth < 720 ? 6 : 4
    const pts: number[][] = []
    for (let yy = 0; yy < innerHeight; yy += st) {
      for (let xx = 0; xx < innerWidth; xx += st) {
        if (d[(yy * innerWidth + xx) * 4 + 3] > 128)
          pts.push([xx * DPR, yy * DPR])
      }
    }
    const MAX = MOBILE ? 1200 : innerWidth < 720 ? 2600 : 5000
    const s = Math.max(1, Math.ceil(pts.length / MAX))
    const out: number[][] = []
    for (let i = 0; i < pts.length; i += s) out.push(pts[i])
    return out
  }

  function assign() {
    const s = sets[idx]
    core.forEach((q, i) => {
      const t = s[i % s.length]
      q.tx = t[0]
      q.ty = t[1]
      q.c = t[0] / W
    })
  }

  function build() {
    if (innerWidth < 2 || innerHeight < 2) return // hidden/zero-size; retry on next real resize
    builtW = innerWidth
    W = canvas.width = innerWidth * DPR
    H = canvas.height = innerHeight * DPR
    cx = W / 2
    cy = H * 0.42
    sets = SEQ.map(sample)
    const N = Math.max(...sets.map((s) => s.length))
    core = Array.from({ length: N }, (_, i) => {
      const q = sets[0][i % sets[0].length]
      return {
        tx: q[0],
        ty: q[1],
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0,
        vy: 0,
        ph: Math.random() * 6,
        sp: 0.4 + Math.random() * 0.7,
        c: q[0] / W,
      }
    })
    idx = 0
    timer = performance.now()
    stars = Array.from({ length: RM ? 60 : MOBILE ? 70 : 150 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: (Math.random() * 1.1 + 0.3) * DPR,
      tw: Math.random() * 6,
    }))
    const RO = Math.min(W, H) * 0.4
    orbit = Array.from({ length: RM ? 26 : MOBILE ? 30 : 70 }, () => ({
      a: Math.random() * 6.28,
      r: RO * (0.78 + Math.random() * 0.55),
      ry: 0.36,
      sp: 0.0015 + Math.random() * 0.0011,
      sz: (Math.random() * 1.6 + 0.6) * DPR,
    }))
  }

  function dot(px: number, py: number, r: number, col: string) {
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.arc(px, py, r, 0, 7)
    ctx.fill()
  }

  function stepPhysics(t: number) {
    p.x += (p.tx - p.x) * 0.05
    p.y += (p.ty - p.y) * 0.05
    const nx = p.x * 30 * DPR
    const ny = p.y * 24 * DPR
    const R = 72 * DPR
    const R2 = R * R
    const amp = RM ? 0 : 1.6 * DPR
    if (!RM) {
      for (const o of orbit) o.a += o.sp
    }
    for (const q of core) {
      const hx = q.tx + Math.sin(t * q.sp + q.ph) * amp + nx
      const hy = q.ty + Math.cos(t * q.sp * 0.9 + q.ph) * amp + ny
      let ax = (hx - q.x) * 0.035
      let ay = (hy - q.y) * 0.035
      if (p.on) {
        const dx = q.x - p.mx
        const dy = q.y - p.my
        const d2 = dx * dx + dy * dy
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1
          const f = ((R - d) / R) * 3.2
          ax += (dx / d) * f
          ay += (dy / d) * f
        }
      }
      q.vx = (q.vx + ax) * 0.85
      q.vy = (q.vy + ay) * 0.85
      q.x += q.vx
      q.y += q.vy
    }
  }

  function frame(now: number) {
    const dt = lastNow ? Math.min(0.05, (now - lastNow) / 1000) : 1 / 60
    lastNow = now
    const rate = motionBoost()
    const steps = Math.max(1, Math.min(6, Math.round(dt * 60 * rate)))
    const t = now / 1000
    if (!RM && now - timer > 3400 / rate) {
      idx = (idx + 1) % sets.length
      assign()
      timer = now
    }
    for (let i = 0; i < steps; i++) stepPhysics(t)

    ctx.fillStyle = "#06070a"
    ctx.fillRect(0, 0, W, H)
    ctx.globalCompositeOperation = "lighter"
    const bx = p.x * 20 * DPR
    const by = p.y * 16 * DPR
    for (const s of stars) {
      const a = 0.3 + 0.4 * Math.abs(Math.sin(t * 0.6 + s.tw))
      dot(s.x + bx, s.y + by, s.r, `rgba(150,175,220,${a})`)
    }
    const ox = p.x * 60 * DPR
    const oy = p.y * 46 * DPR
    back.length = 0
    front.length = 0
    for (const o of orbit) {
      const z = Math.sin(o.a)
      const px = cx + Math.cos(o.a) * o.r + ox
      const py = cy + Math.sin(o.a) * o.r * o.ry + oy
      const sc = 0.6 + 0.4 * (z * 0.5 + 0.5)
      ;(z < 0 ? back : front).push([px, py, o.sz * sc])
    }
    for (const [px, py, r] of back) dot(px, py, r, "rgba(120,160,220,0.5)")
    const sz = 1.7 * DPR
    for (const q of core) {
      ctx.fillStyle = PARTICLE_FILL[Math.max(0, Math.min(60, (q.c * 60) | 0))]
      ctx.fillRect(q.x, q.y, sz, sz)
    }
    for (const [px, py, r] of front) dot(px, py, r, "rgba(180,210,255,0.75)")
    ctx.globalCompositeOperation = "source-over"
    if (mayAnimate()) raf = requestAnimationFrame(frame)
  }

  function mayAnimate() {
    return !RM && onScreen && canvasesMayRun()
  }

  function kick() {
    cancelAnimationFrame(raf)
    raf = 0
    lastNow = 0
    if (mayAnimate()) raf = requestAnimationFrame(frame)
  }

  const onMove = (e: PointerEvent) => {
    // A touch has no "leave", so it would pin the cursor-repel on and freeze the
    // effect. Only a real mouse drives the interaction.
    if (e.pointerType === "touch") return
    p.tx = e.clientX / innerWidth - 0.5
    p.ty = e.clientY / innerHeight - 0.5
    p.mx = e.clientX * DPR
    p.my = e.clientY * DPR
    p.on = 1
  }
  const onLeave = () => {
    p.on = 0
  }
  // Only a real width change (rotation, desktop resize) rebuilds. Mobile fires
  // resize on every scroll as the address bar shows/hides, changing height only;
  // rebuilding there ran six full-screen getImageData passes mid-scroll and froze
  // the page. Ignore height-only resizes, and debounce the rest.
  const onResize = () => {
    if (innerWidth === builtW) return
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      if (!cancelled) build()
    }, 200)
  }

  addEventListener("pointermove", onMove)
  addEventListener("pointerleave", onLeave)
  addEventListener("resize", onResize)

  const start = () => {
    build()
    if (RM) {
      core.forEach((q) => {
        q.x = q.tx
        q.y = q.ty
      })
      frame(0)
    } else {
      kick()
    }
  }

  const unwatchPause = watchCanvasPause(kick)

  if (document.fonts?.ready) {
    void document.fonts.ready.then(() => {
      if (!cancelled) start()
    })
  } else {
    start()
  }

  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        onScreen = e.intersectionRatio >= 0.2
        if (onScreen) timer = performance.now()
        kick()
      })
    },
    {
      threshold: [0, 0.2],
    }
  )
  io.observe(hero)

  return () => {
    cancelled = true
    onScreen = false
    cancelAnimationFrame(raf)
    window.clearTimeout(resizeTimer)
    unwatchPause()
    io.disconnect()
    removeEventListener("pointermove", onMove)
    removeEventListener("pointerleave", onLeave)
    removeEventListener("resize", onResize)
  }
}
