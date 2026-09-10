import { useSyncExternalStore } from "react"

import { canvasesMayRun } from "@/lib/canvas-pause"

type Listener = () => void

const listeners = new Set<Listener>()

let boost = 1
let raf = 0
let started = false

export function motionBoost() {
  return boost
}

export function watchMotionBoost(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function setBoost(next: 1 | 2) {
  if (boost === next) return
  boost = next
  if (next === 2) document.documentElement.dataset.motionBoost = "2"
  else delete document.documentElement.dataset.motionBoost
  listeners.forEach((fn) => fn())
}

export function startMotionBoost() {
  if (started) return
  started = true
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return

  let last = 0
  let ema = 16.7
  let frames = 0
  let low = 0
  let high = 0

  const tick = (now: number) => {
    if (document.visibilityState !== "visible" || !canvasesMayRun()) {
      last = 0
      raf = requestAnimationFrame(tick)
      return
    }
    if (last) {
      const frame = Math.min(80, now - last)
      ema = ema * 0.92 + frame * 0.08
      frames++
      if (frames > 50) {
        if (ema > 22) {
          low++
          high = 0
          if (low > 40) setBoost(2)
        } else if (ema < 18) {
          high++
          low = 0
          if (high > 50) setBoost(1)
        } else {
          low = 0
          high = 0
        }
      }
    }
    last = now
    raf = requestAnimationFrame(tick)
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") last = 0
  })
  raf = requestAnimationFrame(tick)
}

export function useMotionBoost() {
  return useSyncExternalStore(watchMotionBoost, motionBoost, () => 1)
}
