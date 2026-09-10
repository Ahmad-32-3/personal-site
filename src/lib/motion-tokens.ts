import { motionBoost } from "@/lib/motion-boost"

export const motionTokens = {
  duration: {
    instant: 0.08,
    fast: 0.18,
    normal: 0.35,
    slow: 0.6,
    crawl: 1.0,
  },
  easing: {
    smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
    sharp: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  distance: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  scale: {
    press: 0.97,
    pop: 1.04,
  },
}

export const springs = {
  snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
  instant: { type: "spring" as const, stiffness: 600, damping: 35 },
}

export function scaledDuration(seconds: number) {
  return seconds / (typeof document !== "undefined" ? motionBoost() : 1)
}

export function scaledSpring(spring: (typeof springs)[keyof typeof springs]) {
  const rate = typeof document !== "undefined" ? motionBoost() : 1
  if (rate === 1) return spring
  return {
    ...spring,
    stiffness: spring.stiffness * rate,
    damping: spring.damping * Math.sqrt(rate),
  }
}
