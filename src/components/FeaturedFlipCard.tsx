import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { CardArt } from "@/components/CardArt"
import type { Project } from "@/data/projects"
import { motionTokens } from "@/lib/motion-tokens"

type FeaturedFlipCardProps = {
  project: Project
  index: number
  onOpen: (project: Project) => void
}

export function FeaturedFlipCard({
  project,
  index,
  onOpen,
}: FeaturedFlipCardProps) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLButtonElement>(null)
  const [ready, setReady] = useState(false)
  const readyTimer = useRef(0)
  const claim = project.claim ?? project.d ?? ""
  const method = project.method ?? project.d ?? ""

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const ms = (motionTokens.duration.normal + index * 0.08) * 1000
        window.clearTimeout(readyTimer.current)
        readyTimer.current = window.setTimeout(() => setReady(true), ms)
        io.disconnect()
      },
      { threshold: 0.45 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(readyTimer.current)
    }
  }, [index])

  const github = project.github ? (
    <a
      className="card-gh"
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
  ) : null

  if (reduce) {
    return (
      <div className="card keycard">
        <button
          type="button"
          className="card-hit"
          onClick={() => onOpen(project)}
        >
          <div className="card-art">
            <CardArt kind={project.art} />
          </div>
          <p className="t">{project.t}</p>
          <p className="tag">{project.tag || ""}</p>
          <p className="d">{claim}</p>
          {method && method !== claim ? (
            <p className="d method">{method}</p>
          ) : null}
        </button>
        {github}
      </div>
    )
  }

  return (
    <div className="feat-wrap">
      <button
        ref={wrapRef}
        type="button"
        className={ready ? "flip keycard is-ready" : "flip keycard"}
        onClick={() => onOpen(project)}
        aria-label={`${project.t}. Flips once from claim to how it was tested.`}
      >
        <motion.div
          className="flip-inner"
          initial={{ rotateY: 0 }}
          whileInView={{ rotateY: 180 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{
            duration: motionTokens.duration.normal,
            ease: motionTokens.easing.smooth,
            delay: index * 0.08,
          }}
        >
          <div className="flip-face">
            <div className="card-art">
              <CardArt kind={project.art} />
            </div>
            <p className="k">Claim</p>
            <p className="t">{project.t}</p>
            <p className="tag">{project.tag || ""}</p>
            <p className="d">{claim}</p>
          </div>
          <div className="flip-face flip-back">
            <div className="card-art">
              <CardArt kind={project.art} />
            </div>
            <p className="k">How I tested</p>
            <p className="t">{project.t}</p>
            <p className="tag">{project.tag || ""}</p>
            <p className="d">{method}</p>
          </div>
        </motion.div>
      </button>
      {github}
    </div>
  )
}
