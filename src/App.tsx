import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"

import { ContactSection } from "@/components/ContactSection"
import { ProjectCard } from "@/components/ProjectCard"
import { SiteNav } from "@/components/SiteNav"
import {
  PROJECT_TIERS,
  projectByWalkSlug,
  walkSlug,
  type Project,
} from "@/data/projects"
import { TONES } from "@/data/tones"
import { startAmbientStars } from "@/lib/ambient-stars"
import { setWalkOverlayOpen } from "@/lib/canvas-pause"
import { startParticleHero } from "@/lib/particle-hero"
import { polishWalk } from "@/lib/walk-polish"
import "@/site.css"

const JOBS = [
  {
    title: "Data Science Engineering Intern",
    company: "BMC Helix",
    dates: "May 2026 to Aug 2026",
    line: "I built an end-to-end data processing pipeline that analyzed over 100,000 service tickets, clustering similar incidents and using AI to uncover root causes and potential resolution strategies. The goal was to help teams identify recurring issues and reduce weekly ticket volume, with the pipeline contributing to a 15% reduction in recurring tickets.",
    delay: "0.05s",
  },
  {
    title: "Machine Learning Engineering Intern",
    company: "BMC Software",
    dates: "Sep 2025 to Dec 2025",
    line: "I helped build a chatbot that allows enterprises to connect their Google Workspace and search directly through the contents of their files in real time, rather than relying only on metadata. I worked on the retrieval system and reduced the average search time from 4 seconds to 2.3 seconds, while supporting documents across multiple Google Workspace file types.",
    delay: "0.13s",
  },
  {
    title: "Web Application Developer",
    company: "Ontario One Call",
    dates: "Jan 2025 to May 2025",
    line: "I built geospatial APIs that helped connect excavation sites with the underground infrastructure owners responsible for the area. Given a proposed dig site, the system could process complex geographic polygons and identify the relevant utility owners across Ontario, helping support the infrastructure locate request process.",
    delay: "0.21s",
  },
  {
    title: "Software Engineering Intern",
    company: "MAP360Global",
    dates: "Jun 2024 to Aug 2024",
    line: "I worked on improving both the performance and functionality of MAP360Global's web presence, building interactive features with JavaScript and optimizing the WordPress site to improve its Lighthouse score from 76 to 91. I also contributed to the company's SAP migration work, helping move existing BW 7.5 processes onto BW/4HANA.",
    delay: "0.29s",
  },
] as const

function observeOnce(
  el: HTMLElement | null,
  threshold: number,
  cls = "show"
) {
  if (!el) return () => {}
  const io = new IntersectionObserver(
    (es, ob) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add(cls)
          ob.unobserve(e.target)
        }
      })
    },
    { threshold }
  )
  io.observe(el)
  return () => io.disconnect()
}

function projectFromWalkQuery(): Project | null {
  const slug = new URLSearchParams(window.location.search).get("walk")
  return slug ? projectByWalkSlug(slug) ?? null : null
}

function hrefWithWalk(slug: string | null): string {
  const url = new URL(window.location.href)
  if (slug) url.searchParams.set("walk", slug)
  else url.searchParams.delete("walk")
  return `${url.pathname}${url.search}${url.hash}`
}

export function App() {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const aboutInnerRef = useRef<HTMLDivElement>(null)
  const aboutStarsRef = useRef<HTMLCanvasElement>(null)
  const expRef = useRef<HTMLElement>(null)
  const expStarsRef = useRef<HTMLCanvasElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const projRef = useRef<HTMLElement>(null)
  const projStarsRef = useRef<HTMLCanvasElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState<Project | null>(projectFromWalkQuery)

  const openWalk = useCallback((project: Project) => {
    const active = document.activeElement
    if (active instanceof HTMLElement) lastTriggerRef.current = active
    setOpen(project)
    const slug = walkSlug(project)
    if (!slug) return
    const current = new URLSearchParams(window.location.search).get("walk")
    if (current === slug) return
    history.pushState({ walk: slug }, "", hrefWithWalk(slug))
  }, [])

  const closeWalk = useCallback(() => {
    setOpen(null)
    if (!new URLSearchParams(window.location.search).has("walk")) return
    history.replaceState({ walk: null }, "", hrefWithWalk(null))
  }, [])

  useEffect(() => {
    if (open) {
      backRef.current?.focus()
      return
    }
    lastTriggerRef.current?.focus()
    lastTriggerRef.current = null
  }, [open])

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("walk")
    if (slug && !projectByWalkSlug(slug)) {
      history.replaceState({ walk: null }, "", hrefWithWalk(null))
    }
    const onPop = () => setOpen(projectFromWalkQuery())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  useEffect(() => {
    setWalkOverlayOpen(!!open)
    return () => setWalkOverlayOpen(false)
  }, [open])

  useEffect(() => {
    if (!canvasRef.current || !heroRef.current) return
    return startParticleHero(canvasRef.current, heroRef.current)
  }, [])

  useEffect(() => observeOnce(aboutInnerRef.current, 0.2), [])
  useEffect(() => observeOnce(timelineRef.current, 0.25), [])

  useEffect(() => {
    if (!aboutRef.current || !aboutStarsRef.current) return
    return startAmbientStars(aboutRef.current, aboutStarsRef.current)
  }, [])

  useEffect(() => {
    if (!expRef.current || !expStarsRef.current) return
    return startAmbientStars(expRef.current, expStarsRef.current)
  }, [])

  useEffect(() => {
    if (!projRef.current || !projStarsRef.current) return
    return startAmbientStars(projRef.current, projStarsRef.current)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWalk()
    }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, closeWalk])

  return (
    <div className="site" id="top">
      <SiteNav heroRef={heroRef} />

      <header className="hero" ref={heroRef}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="vig" />
        <div className="lower">
          <p className="eyebrow">Engineer · Builder</p>
          <p className="tagline">
            System Design Engineering @ University of Waterloo
          </p>
        </div>
        <p className="hint">Try hovering over the words :)</p>
      </header>

      <section className="about" id="about" ref={aboutRef}>
        <canvas className="about-stars" ref={aboutStarsRef} aria-hidden="true" />
        <div className="about-inner" ref={aboutInnerRef}>
          <div className="portrait">
            <div className="disc">
              <img
                src="/portrait.png"
                alt="Muhammad Ahmad"
                width={280}
                height={280}
              />
            </div>
            <div className="ring">
              <span className="d" />
            </div>
          </div>
          <div className="about-text">
            <p className="k">About</p>
            <h2>Systems Design Engineering at Waterloo.</h2>
            <p>
              I&apos;m Muhammad. Over my past few co-ops, I&apos;ve learned a
              lot about Data Science and Machine Learning, which have inspired
              many of the projects showcased here.
            </p>
            <p>
              Through these internships, I&apos;ve learned how to take an idea
              from a design document to a proof of concept and eventually into
              production, where real users can implement it into their systems.
              I&apos;ve built APIs from scratch in .NET for specific use cases,
              such as identifying underground infrastructure owners based on a
              complex polygon representing a proposed dig site.
            </p>
            <p>
              Outside of work, I help organize community get-togethers where
              people can play cricket, soccer, basketball, and more. I also go
              bouldering from time to time and love reading different novels.
            </p>
            <div className="tags">
              <span>Python</span>
              <span>PyTorch</span>
              <span>React</span>
              <span>SQL</span>
              <span>Azure</span>
            </div>
          </div>
        </div>
      </section>

      <section className="exp" id="experience" ref={expRef}>
        <canvas className="exp-stars" ref={expStarsRef} aria-hidden="true" />
        <div className="exp-inner">
          <p className="k">Experience</p>
          <div className="timeline" ref={timelineRef}>
            <div className="line" />
            {JOBS.map((job) => (
              <div
                key={job.title}
                className="job"
                style={{ transitionDelay: job.delay }}
              >
                <span className="node" />
                <h3 className="title">{job.title}</h3>
                <p className="meta">
                  <span className="co">{job.company}</span> · {job.dates}
                </p>
                <p className="blurb">{job.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="proj" id="projects" ref={projRef}>
        <canvas className="proj-stars" ref={projStarsRef} aria-hidden="true" />
        <div className="proj-inner">
          <p className="k">Selected Work</p>
          <h2>Projects</h2>
          <p className="intro">Click a card to view the walkthrough</p>
          {PROJECT_TIERS.map((tier) => (
            <div key={tier.id}>
              <div className="tier">
                <h3>{tier.label}</h3>
                <span className="c">{tier.items.length}</span>
              </div>
              <div className={tier.id === "featured" ? "grid feat" : "grid"}>
                {tier.items.map((p) => (
                  <ProjectCard
                    key={p.t}
                    project={p}
                    mini={tier.id === "more"}
                    onOpen={openWalk}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactSection />

      <div
        className={open ? "ov on" : "ov"}
        style={
          open?.tone && TONES[open.tone]
            ? ({
                "--ov-bg": TONES[open.tone].bg,
                "--ov-back": TONES[open.tone].back,
                "--ov-line": TONES[open.tone].line,
                "--ov-fg": TONES[open.tone].fg,
              } as CSSProperties)
            : undefined
        }
        role="dialog"
        aria-label={open ? open.t : undefined}
        aria-modal={open ? true : undefined}
        aria-hidden={!open}
      >
        <button
          ref={backRef}
          type="button"
          className="back"
          onClick={closeWalk}
        >
          Back to projects
        </button>
        {open?.walk ? (
          <iframe
            className="ov-frame"
            src={open.walk}
            title={open.t}
            allow="popups; popup-to-escape-sandbox; identity-credentials-get"
            onLoad={(e) => polishWalk(e.currentTarget)}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App
