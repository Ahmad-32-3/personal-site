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

export function startParticleHero(
  canvas: HTMLCanvasElement,
  hero: HTMLElement
): () => void {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches
  const DPR = Math.min(devicePixelRatio || 1, RM ? 1 : 2)
  const context = canvas.getContext("2d")
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
  let stars: { x: number; y: number; r: number; tw: number }[] = []
  let orbit: { a: number; r: number; ry: number; sp: number; sz: number }[] = []
  let bok: {
    x: number
    y: number
    r: number
    ph: number
    sp: number
    ox: number
    oy: number
  }[] = []
  let running = true
  let raf = 0
  let cancelled = false

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
    lines.forEach((ln, i) => g.fillText(ln, X, Y + (i - (n - 1) / 2) * fs * 0.9))
    const d = g.getImageData(0, 0, innerWidth, innerHeight).data
    const st = innerWidth < 720 ? 6 : 4
    const pts: number[][] = []
    for (let yy = 0; yy < innerHeight; yy += st) {
      for (let xx = 0; xx < innerWidth; xx += st) {
        if (d[(yy * innerWidth + xx) * 4 + 3] > 128)
          pts.push([xx * DPR, yy * DPR])
      }
    }
    const MAX = innerWidth < 720 ? 2600 : 5000
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
    stars = Array.from({ length: RM ? 60 : 150 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: (Math.random() * 1.1 + 0.3) * DPR,
      tw: Math.random() * 6,
    }))
    const RO = Math.min(W, H) * 0.36
    orbit = Array.from({ length: RM ? 26 : 70 }, () => ({
      a: Math.random() * 6.28,
      r: RO * (0.78 + Math.random() * 0.55),
      ry: 0.34,
      sp: 0.0015 + Math.random() * 0.0011,
      sz: (Math.random() * 1.6 + 0.6) * DPR,
    }))
    bok = Array.from({ length: RM ? 6 : 15 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: (40 + Math.random() * 90) * DPR,
      ph: Math.random() * 6,
      sp: 0.15 + Math.random() * 0.25,
      ox: 0,
      oy: 0,
    }))
    bok.forEach((b) => {
      b.ox = b.x
      b.oy = b.y
    })
  }

  function dot(px: number, py: number, r: number, col: string) {
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.arc(px, py, r, 0, 7)
    ctx.fill()
  }

  function frame(now: number) {
    const t = now / 1000
    p.x += (p.tx - p.x) * 0.05
    p.y += (p.ty - p.y) * 0.05
    if (!RM && now - timer > 3400) {
      idx = (idx + 1) % sets.length
      assign()
      timer = now
    }
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
    const back: number[][] = []
    const front: number[][] = []
    for (const o of orbit) {
      o.a += RM ? 0 : o.sp
      const z = Math.sin(o.a)
      const px = cx + Math.cos(o.a) * o.r + ox
      const py = cy + Math.sin(o.a) * o.r * o.ry + oy
      const sc = 0.6 + 0.4 * (z * 0.5 + 0.5)
      ;(z < 0 ? back : front).push([px, py, o.sz * sc])
    }
    for (const [px, py, r] of back) dot(px, py, r, "rgba(120,160,220,0.5)")
    const nx = p.x * 30 * DPR
    const ny = p.y * 24 * DPR
    const R = 120 * DPR
    const R2 = R * R
    const amp = RM ? 0 : 1.6 * DPR
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
          const f = ((R - d) / R) * 6
          ax += (dx / d) * f
          ay += (dy / d) * f
        }
      }
      q.vx = (q.vx + ax) * 0.85
      q.vy = (q.vy + ay) * 0.85
      q.x += q.vx
      q.y += q.vy
      const r = (175 + q.c * 60) | 0
      ctx.fillStyle = `rgba(${r},205,255,0.9)`
      ctx.fillRect(q.x, q.y, 1.7 * DPR, 1.7 * DPR)
    }
    for (const [px, py, r] of front) dot(px, py, r, "rgba(180,210,255,0.75)")
    const fx = -p.x * 90 * DPR
    const fy = -p.y * 70 * DPR
    for (const b of bok) {
      const px = b.ox + Math.sin(t * b.sp + b.ph) * 40 * DPR + fx
      const py = b.oy + Math.cos(t * b.sp * 0.8 + b.ph) * 30 * DPR + fy
      const g = ctx.createRadialGradient(px, py, 0, px, py, b.r)
      g.addColorStop(0, "rgba(140,175,255,0.10)")
      g.addColorStop(1, "transparent")
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(px, py, b.r, 0, 7)
      ctx.fill()
    }
    ctx.globalCompositeOperation = "source-over"
    if (!RM && running) raf = requestAnimationFrame(frame)
  }

  const onMove = (e: PointerEvent) => {
    p.tx = e.clientX / innerWidth - 0.5
    p.ty = e.clientY / innerHeight - 0.5
    p.mx = e.clientX * DPR
    p.my = e.clientY * DPR
    p.on = 1
  }
  const onLeave = () => {
    p.on = 0
  }
  const onResize = () => build()

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
      raf = requestAnimationFrame(frame)
    }
  }

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
        running = e.isIntersecting
        if (running && !RM) {
          timer = performance.now()
          raf = requestAnimationFrame(frame)
        }
      })
    },
    { threshold: 0 }
  )
  io.observe(hero)

  return () => {
    cancelled = true
    running = false
    cancelAnimationFrame(raf)
    io.disconnect()
    removeEventListener("pointermove", onMove)
    removeEventListener("pointerleave", onLeave)
    removeEventListener("resize", onResize)
  }
}
