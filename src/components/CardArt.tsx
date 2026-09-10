import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

import { motionTokens } from "@/lib/motion-tokens"

type CardArtProps = {
  kind: string
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      className="card-art-svg"
      viewBox="0 0 320 80"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function Stroke({
  d,
  className = "line",
  delay = 0,
}: {
  d: string
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.path
      d={d}
      className={className}
      fill="none"
      initial={{ pathLength: reduce ? 1 : 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: motionTokens.duration.slow,
        ease: motionTokens.easing.smooth,
        delay: reduce ? 0 : delay,
      }}
    />
  )
}

function Fade({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.g
      initial={{ opacity: reduce ? 1 : 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: motionTokens.duration.normal,
        ease: motionTokens.easing.smooth,
        delay: reduce ? 0 : delay,
      }}
    >
      {children}
    </motion.g>
  )
}

const ARTS: Record<string, () => React.ReactNode> = {
  eeg: () => (
    <>
      <Fade>
        <ellipse cx="48" cy="50" rx="20" ry="24" className="sil" />
        <circle cx="40" cy="42" r="2" className="lit" />
        <circle cx="56" cy="40" r="2" className="lit" />
        <circle cx="48" cy="56" r="2" className="hot" />
      </Fade>
      <Stroke d="M78 48 h16 l8 -20 12 40 10 -24 10 16 14 -28 12 22 18 -8 20 18 24 -12 30 8" />
    </>
  ),
  cache: () => (
    <>
      <Fade>
        <rect x="28" y="30" width="72" height="42" rx="4" className="sil" />
        <rect x="116" y="18" width="80" height="54" rx="4" className="sil" />
        <rect x="212" y="34" width="80" height="38" rx="4" className="sil" />
        <rect x="128" y="28" width="56" height="8" className="lit" />
        <rect x="128" y="42" width="40" height="6" className="sil" />
      </Fade>
      <Stroke d="M100 50 H116" delay={0.08} />
      <Stroke d="M196 50 H212" delay={0.16} />
    </>
  ),
  mail: () => (
    <>
      <Fade>
        <rect x="28" y="34" width="82" height="36" rx="3" className="sil" />
        <rect x="122" y="26" width="90" height="44" rx="3" className="sil" />
        <rect x="224" y="38" width="68" height="32" rx="3" className="sil" />
      </Fade>
      <Stroke d="M28 34 l41 22 41 -22" />
      <Stroke d="M122 26 l45 22 45 -22" delay={0.1} />
    </>
  ),
  rotate: () => (
    <>
      <Fade>
        <rect x="128" y="22" width="32" height="32" rx="4" className="sil" />
        <rect
          x="176"
          y="28"
          width="32"
          height="32"
          rx="4"
          className="lit"
          transform="rotate(32 192 44)"
        />
        <rect
          x="70"
          y="34"
          width="28"
          height="28"
          rx="4"
          className="sil"
          transform="rotate(-18 84 48)"
        />
      </Fade>
      <Stroke d="M160 16 a36 36 0 1 1 -0.1 0" delay={0.08} />
      <Stroke d="M188 12 l8 10 -12 2" delay={0.16} />
    </>
  ),
  formula: () => (
    <>
      <Stroke d="M24 70 H300" className="sil-stroke" />
      <Stroke d="M36 12 V70" className="sil-stroke" />
      <Stroke d="M40 62 C90 62 100 14 168 30 C228 44 248 68 304 16" />
      <Fade delay={0.12}>
        {[70, 110, 150, 190, 230, 270].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={48 + ((i % 3) - 1) * 10}
            r="2.4"
            className="lit"
          />
        ))}
      </Fade>
    </>
  ),
  drift: () => (
    <>
      <Fade>
        {[
          [48, 34],
          [70, 52],
          [38, 58],
          [62, 28],
          [84, 44],
        ].map(([x, y]) => (
          <circle key={`${x}-a`} cx={x} cy={y} r="4" className="sil" />
        ))}
        {[
          [220, 26],
          [246, 44],
          [210, 54],
          [258, 32],
          [234, 58],
        ].map(([x, y]) => (
          <circle key={`${x}-b`} cx={x} cy={y} r="4" className="lit" />
        ))}
      </Fade>
      <Stroke d="M96 44 H196" />
      <Stroke d="M184 38 l14 6 -14 6" delay={0.1} />
    </>
  ),
  candles: () => (
    <>
      {[36, 68, 100, 132, 164, 196, 228, 260].map((x, i) => (
        <g key={x}>
          <Stroke
            d={`M${x + 6} ${16 + (i % 3) * 6} V70`}
            delay={i * 0.03}
          />
          <Fade delay={i * 0.03}>
            <rect
              x={x}
              y={26 + (i % 4) * 6}
              width="12"
              height={30 - (i % 3) * 4}
              className={i % 2 ? "lit" : "sil"}
            />
          </Fade>
        </g>
      ))}
    </>
  ),
  moods: () => (
    <>
      <Fade>
        {Array.from({ length: 18 }, (_, i) => (
          <rect
            key={`c${i}`}
            x={36 + i * 14}
            y={14}
            width="12"
            height="14"
            className="lit"
          />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <rect
            key={`h${i}`}
            x={36 + i * 14}
            y={34}
            width="12"
            height="14"
            className={i % 5 === 2 ? "hot" : "sil"}
          />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <rect
            key={`r${i}`}
            x={36 + i * 14}
            y={54}
            width="12"
            height="14"
            className={i > 11 ? "hot" : "sil"}
          />
        ))}
      </Fade>
      <text x="4" y="25" className="glyph">
        C
      </text>
      <text x="4" y="45" className="glyph">
        H
      </text>
      <text x="4" y="65" className="glyph">
        R
      </text>
    </>
  ),
  hedge: () => (
    <>
      <Stroke d="M16 58 C70 18 130 72 200 36 S280 20 310 28" />
      <Stroke
        d="M16 64 C76 28 136 78 206 44 S286 30 310 38"
        className="sil-stroke"
        delay={0.1}
      />
      <Fade delay={0.16}>
        <circle cx="200" cy="36" r="3" className="lit" />
        <circle cx="206" cy="44" r="3" className="hot" />
      </Fade>
    </>
  ),
  city: () => (
    <>
      <Fade>
        <rect x="20" y="30" width="34" height="50" className="sil" />
        <rect x="58" y="12" width="26" height="68" className="sil" />
        <rect x="88" y="36" width="42" height="44" className="sil" />
        <rect x="134" y="8" width="30" height="72" className="sil" />
        <rect x="168" y="24" width="48" height="56" className="sil" />
        <rect x="220" y="40" width="38" height="40" className="sil" />
        <rect x="262" y="18" width="24" height="62" className="sil" />
        {[28, 36, 66, 74, 142, 150, 176, 184, 228, 270].map((x, i) => (
          <rect
            key={x}
            x={x}
            y={18 + (i % 5) * 10}
            width="4"
            height="5"
            className="lit"
          />
        ))}
      </Fade>
      <Stroke d="M292 50 C300 38 308 38 318 24" delay={0.12} />
    </>
  ),
  sensor: () => (
    <>
      <Fade>
        <rect x="148" y="42" width="24" height="30" className="sil" />
        <circle cx="160" cy="28" r="4" className="lit" />
      </Fade>
      <Stroke d="M160 28 m-18 0 a18 18 0 1 1 36 0 a18 18 0 1 1 -36 0" />
      <Stroke d="M28 70 c40 -28 80 -28 132 0" delay={0.08} />
      <Stroke d="M184 70 c40 -22 80 -22 108 0" delay={0.16} />
    </>
  ),
  pipes: () => (
    <>
      <Stroke d="M12 56 h88 v-16 h72 v16 h136" className="pipe" />
      <Fade>
        <circle cx="172" cy="56" r="6" className="hot" />
        <rect x="0" y="62" width="320" height="18" className="dirt" />
      </Fade>
      <Stroke d="M166 42 l12 -16" delay={0.12} />
    </>
  ),
  bridge: () => (
    <>
      <Stroke d="M16 60 Q160 8 304 60" />
      <Stroke d="M16 60 H304" delay={0.06} />
      <Stroke d="M80 60 V36" delay={0.1} />
      <Stroke d="M160 60 V14" delay={0.14} />
      <Stroke d="M240 60 V36" delay={0.18} />
    </>
  ),
  glitch: () => (
    <Stroke d="M16 48 l36 6 22 -24 26 42 34 -50 38 22 46 -10 48 20 40 -8" />
  ),
  hive: () => (
    <>
      <Fade>
        <ellipse cx="160" cy="54" rx="74" ry="20" className="sil" />
        <ellipse cx="160" cy="40" rx="58" ry="16" className="sil" />
        <ellipse cx="160" cy="26" rx="42" ry="12" className="lit" />
      </Fade>
      <Stroke d="M88 40 c20 -18 40 -18 72 0" delay={0.1} />
    </>
  ),
  circuit: () => (
    <>
      <Stroke d="M24 42 h70 v22 h58 V22 h90 v20 h50" />
      <Fade delay={0.12}>
        <circle cx="94" cy="42" r="5" className="lit" />
        <circle cx="152" cy="64" r="5" className="lit" />
        <circle cx="242" cy="22" r="5" className="hot" />
        <circle cx="292" cy="42" r="5" className="lit" />
      </Fade>
    </>
  ),
  cam: () => (
    <>
      <Fade>
        <rect x="18" y="48" width="86" height="28" className="sil" />
        <rect x="122" y="26" width="56" height="38" rx="4" className="sil" />
        <circle cx="150" cy="45" r="4" className="lit" />
        <rect x="196" y="40" width="50" height="36" className="sil" />
        <rect x="254" y="32" width="44" height="44" className="sil" />
      </Fade>
      <Stroke d="M150 45 m-12 0 a12 12 0 1 1 24 0 a12 12 0 1 1 -24 0" />
    </>
  ),
  tokens: () => (
    <>
      {["A", "the", "cat", "sat"].map((w, i) => (
        <Fade key={w} delay={i * 0.06}>
          <g transform={`translate(${18 + i * 76} 26)`}>
            <rect width="68" height="28" rx="6" className="sil" />
            <text x="10" y="19" className="glyph">
              {w}
            </text>
          </g>
        </Fade>
      ))}
      <Stroke d="M86 54 H318" delay={0.2} />
    </>
  ),
  search: () => (
    <>
      <Stroke d="M138 34 m-16 0 a16 16 0 1 1 32 0 a16 16 0 1 1 -32 0" />
      <Stroke d="M150 48 L176 70" delay={0.08} />
      <Fade delay={0.12}>
        {[
          [36, 22, 54, 12],
          [36, 40, 70, 10],
          [36, 56, 46, 10],
          [220, 22, 64, 12],
          [220, 40, 78, 10],
          [220, 56, 50, 10],
        ].map(([x, y, w, h], i) => (
          <rect
            key={x + y}
            x={x}
            y={y}
            width={w}
            height={h}
            rx="2"
            className={i === 4 ? "lit" : "sil"}
          />
        ))}
      </Fade>
    </>
  ),
  split: () => (
    <>
      <Fade>
        <rect x="22" y="18" width="118" height="50" rx="4" className="sil" />
        <rect x="180" y="18" width="118" height="50" rx="4" className="sil" />
        <rect x="36" y="30" width="70" height="8" className="lit" />
        <rect x="194" y="30" width="50" height="8" className="hot" />
      </Fade>
      <Stroke d="M140 42 H180" />
      <Stroke d="M168 36 l12 6 -12 6" delay={0.1} />
    </>
  ),
  flow: () => (
    <>
      <Stroke d="M12 52 c36 -28 58 18 96 0 s58 -26 96 6 48 12 92 -10" />
      <Fade delay={0.12}>
        <circle cx="64" cy="34" r="4" className="lit" />
        <circle cx="160" cy="50" r="4" className="lit" />
        <circle cx="250" cy="42" r="4" className="hot" />
      </Fade>
    </>
  ),
  crowd: () => (
    <>
      {[46, 88, 130, 172, 214, 256].map((x, i) => (
        <Fade key={x} delay={i * 0.04}>
          <circle cx={x} cy={34 - (i % 2) * 4} r="8" className="sil" />
          <rect
            x={x - 10}
            y={44 - (i % 2) * 4}
            width="20"
            height="28"
            rx="8"
            className="sil"
          />
        </Fade>
      ))}
      <Stroke d="M20 72 H300" delay={0.2} />
    </>
  ),
  grep: () => (
    <>
      <Fade>
        <rect x="16" y="16" width="132" height="52" rx="4" className="sil" />
        <text x="28" y="48" className="glyph">
          grep
        </text>
        {[
          [176, 22],
          [208, 40],
          [240, 26],
          [272, 48],
          [198, 58],
          [256, 16],
        ].map(([x, y], i) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r={i === 2 ? 5 : 3.5}
            className={i === 2 ? "hot" : "lit"}
          />
        ))}
      </Fade>
      <Stroke d="M148 42 H168" />
    </>
  ),
  route: () => (
    <>
      <Fade>
        <circle cx="52" cy="42" r="10" className="sil" />
        <circle cx="160" cy="42" r="10" className="lit" />
        <circle cx="268" cy="42" r="10" className="hot" />
      </Fade>
      <Stroke d="M62 42 H150" />
      <Stroke d="M170 42 H258" delay={0.1} />
      <Stroke d="M160 20 V32" delay={0.16} />
    </>
  ),
  smog: () => (
    <>
      <Fade>
        <rect x="28" y="36" width="40" height="44" className="sil" />
        <rect x="78" y="18" width="30" height="62" className="sil" />
        <rect x="118" y="32" width="50" height="48" className="sil" />
        <ellipse cx="210" cy="26" rx="52" ry="14" className="fog" />
        <ellipse cx="248" cy="40" rx="42" ry="11" className="fog" />
      </Fade>
    </>
  ),
  gears: () => (
    <>
      <Stroke d="M118 42 m-22 0 a22 22 0 1 1 44 0 a22 22 0 1 1 -44 0" />
      <Stroke
        d="M176 52 m-15 0 a15 15 0 1 1 30 0 a15 15 0 1 1 -30 0"
        delay={0.1}
      />
      <Fade delay={0.12}>
        <circle cx="118" cy="42" r="4" className="lit" />
        <circle cx="176" cy="52" r="3" className="lit" />
      </Fade>
      <Stroke d="M118 20 V28 M118 56 V64 M96 42 H104 M132 42 H140" delay={0.16} />
    </>
  ),
  path: () => (
    <>
      <Stroke d="M12 62 H308" className="sil-stroke" />
      <Stroke d="M12 62 C76 62 90 18 160 18 S248 62 308 62" />
      <Fade delay={0.14}>
        <circle cx="160" cy="18" r="3" className="lit" />
      </Fade>
    </>
  ),
  burst: () => (
    <Stroke d="M12 52 h36 l8 -30 14 52 12 -38 16 42 24 -60 18 38 28 -12 42 8 36 -6 40 10" />
  ),
  book: () => (
    <>
      {[32, 62, 92, 122, 152, 182, 212, 242].map((x, i) => (
        <Fade key={x} delay={i * 0.03}>
          <rect
            x={x}
            y={20 + (i % 3) * 8}
            width="20"
            height={46 - (i % 3) * 8}
            className={i % 2 ? "lit" : "sil"}
          />
        </Fade>
      ))}
      <Stroke d="M20 70 H280" delay={0.2} />
    </>
  ),
  join: () => (
    <>
      <Stroke d="M28 28 H292" />
      <Stroke d="M28 56 H292" delay={0.08} />
      <Stroke d="M150 28 L196 56" className="lit-stroke" delay={0.14} />
      <Fade delay={0.16}>
        <circle cx="150" cy="28" r="3" className="lit" />
        <circle cx="196" cy="56" r="3" className="hot" />
      </Fade>
    </>
  ),
  regret: () => (
    <>
      <Fade>
        <rect x="36" y="20" width="70" height="48" rx="4" className="sil" />
        <rect x="124" y="20" width="70" height="48" rx="4" className="hot" />
        <rect x="212" y="20" width="70" height="48" rx="4" className="sil" />
      </Fade>
      <Stroke d="M70 76 V70" delay={0.1} />
      <Stroke d="M159 76 V70" delay={0.16} />
    </>
  ),
  river: () => (
    <>
      <Stroke d="M0 44 c40 -16 60 16 100 0 s60 -16 100 0 60 16 120 0" />
      <Stroke
        d="M0 58 c40 -12 60 12 100 0 s60 -12 100 0 60 12 120 0"
        className="sil-stroke"
        delay={0.1}
      />
    </>
  ),
}

export function CardArt({ kind }: CardArtProps) {
  const draw = ARTS[kind] ?? ARTS.city
  return <Frame>{draw()}</Frame>
}
