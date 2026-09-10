import { useEffect, useState, type RefObject } from "react"

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const

export function SiteNav({
  heroRef,
}: {
  heroRef: RefObject<HTMLElement | null>
}) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setSolid(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: "-12% 0px 0px 0px" }
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [heroRef])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <nav className={solid ? "is-solid" : undefined} aria-label="Primary">
      <a className="brand" href="#top" onClick={() => setOpen(false)}>
        MUHAMMAD AHMAD
      </a>
      <button
        type="button"
        className="menu"
        aria-expanded={open}
        aria-controls="site-links"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <span id="site-links" className={open ? "links is-open" : "links"}>
        {LINKS.map((link) => (
          <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </span>
    </nav>
  )
}
