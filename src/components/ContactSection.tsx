"use client"

import { Check, Copy } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react"

import { startAmbientStars } from "@/lib/ambient-stars"
import { motionTokens, springs } from "@/lib/motion-tokens"

const EMAIL = "m48ahmad@uwaterloo.ca"
const GITHUB = "https://github.com/Ahmad-32-3"
const GITHUB_LABEL = "github.com/Ahmad-32-3"

function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, springs.snappy)
  const sy = useSpring(y, springs.snappy)

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.12)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.12)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={reduce ? undefined : { x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}

function DrawIcon({ kind }: { kind: "mail" | "git" }) {
  const reduce = useReducedMotion()
  const draw = {
    duration: motionTokens.duration.slow,
    ease: motionTokens.easing.smooth,
  }

  return (
    <svg
      className="contact-ico"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "mail" ? (
        <>
          <motion.path
            d="M3 7h18v10H3z"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={draw}
          />
          <motion.path
            d="M3 7l9 7 9-7"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...draw, delay: reduce ? 0 : 0.12 }}
          />
        </>
      ) : (
        <>
          <motion.circle
            cx="6"
            cy="6"
            r="2.2"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={draw}
          />
          <motion.circle
            cx="6"
            cy="18"
            r="2.2"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...draw, delay: reduce ? 0 : 0.08 }}
          />
          <motion.circle
            cx="18"
            cy="12"
            r="2.2"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...draw, delay: reduce ? 0 : 0.16 }}
          />
          <motion.path
            d="M8 7.2v8.6M8 16.4h7.2M16 13.8V9"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...draw, delay: reduce ? 0 : 0.2 }}
          />
        </>
      )}
    </svg>
  )
}

export function ContactSection() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const starsRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef(0)

  useEffect(() => {
    if (!sectionRef.current || !starsRef.current) return
    return startAmbientStars(sectionRef.current, starsRef.current)
  }, [])

  useEffect(() => () => window.clearTimeout(copiedTimer.current), [])

  async function copyEmail() {
    setCopied(true)
    window.clearTimeout(copiedTimer.current)
    copiedTimer.current = window.setTimeout(
      () => setCopied(false),
      motionTokens.duration.crawl * 2000
    )
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      const el = document.createElement("textarea")
      el.value = EMAIL
      el.setAttribute("readonly", "")
      el.style.position = "fixed"
      el.style.left = "-9999px"
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      el.remove()
    }
  }

  const reveal = reduce
    ? undefined
    : {
        initial: { opacity: 0, y: motionTokens.distance.md },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: springs.gentle,
      }

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <canvas className="contact-stars" ref={starsRef} aria-hidden="true" />
      <div className="contact-inner">
        <p className="k">Contact</p>
        <p className="contact-lead">Email or GitHub. Copy the address, or open mail.</p>
        <div className="contact-grid">
          <motion.div className="contact-cell" {...reveal}>
            <Magnetic>
              <button
                type="button"
                className="contact-tile"
                onClick={copyEmail}
                aria-label={`Copy email ${EMAIL}`}
              >
                <DrawIcon kind="mail" />
                <span className="contact-tile-k">Email</span>
                <span className="contact-tile-v">{EMAIL}</span>
                <span className="contact-tile-act" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "copied" : "copy"}
                      className="contact-act-swap"
                      initial={{
                        opacity: 0,
                        y: reduce ? 0 : motionTokens.distance.sm,
                      }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: reduce ? 0 : -motionTokens.distance.sm,
                      }}
                      transition={{ duration: motionTokens.duration.fast }}
                    >
                      {copied ? (
                        <Check size={14} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <Copy size={14} strokeWidth={2} aria-hidden="true" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
            </Magnetic>
            <a className="contact-sub" href={`mailto:${EMAIL}`}>
              Open in mail
            </a>
          </motion.div>

          <motion.div
            className="contact-cell"
            {...(reveal
              ? {
                  ...reveal,
                  transition: { ...springs.gentle, delay: 0.08 },
                }
              : undefined)}
          >
            <Magnetic>
              <a
                className="contact-tile"
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DrawIcon kind="git" />
                <span className="contact-tile-k">GitHub</span>
                <span className="contact-tile-v">{GITHUB_LABEL}</span>
                <span className="contact-tile-act">Open</span>
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
