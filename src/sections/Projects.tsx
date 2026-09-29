import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { projects, type Project } from '../content/resume'
import RiseText from '../components/RiseText'
import ScrambleText from '../components/ScrambleText'
import Radar from '../components/motifs/Radar'
import Arcade from '../components/motifs/Arcade'
import Orbit from '../components/motifs/Orbit'
import SwipeDeck from '../components/motifs/SwipeDeck'
import Vault from '../components/motifs/Vault'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/hooks'
import { useApp } from '../store'
import './Projects.css'

function Motif({ project }: { project: Project }): ReactNode {
  switch (project.motif) {
    case 'radar':
      return <Radar accent={project.accent} />
    case 'arcade':
      return <Arcade accent={project.accent} />
    case 'orbit':
      return <Orbit accent={project.accent} />
    case 'deck':
      return <SwipeDeck />
    case 'vault':
      return <Vault accent={project.accent} />
  }
}

export default function Projects() {
  const listRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const setCaseOpenId = useApp((s) => s.setCaseOpenId)

  // card-stack: as the next panel slides over, the previous one recedes
  useLayoutEffect(() => {
    if (reduced) return
    const list = listRef.current
    if (!list) return
    const panels = Array.from(list.querySelectorAll<HTMLElement>('.project-panel'))

    const ctx = gsap.context(() => {
      panels.forEach((panel, i) => {
        const card = panel.querySelector<HTMLElement>('.project-card')
        if (!card) return

        // content reveal
        gsap.fromTo(
          panel.querySelectorAll('.project-index, .project-kind, .project-kicker, .project-bullets li, .project-impact, .project-actions'),
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.06,
            scrollTrigger: { trigger: panel, start: 'top 62%', once: true },
          },
        )

        // recede under the next card
        const next = panels[i + 1]
        if (next) {
          gsap.to(card, {
            scale: 0.94,
            yPercent: -3,
            autoAlpha: 0.55,
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.4,
            },
          })
        }
      })
    }, list)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="work" data-section="work" className="section projects">
      <div className="container">
        <div className="section-head">
          <ScrambleText as="p" className="mono-label" text="Selected work — 002" />
          <RiseText as="h2" className="display-lg" text="Things I've shipped." />
          <div className="rule" />
        </div>
      </div>

      <div className="projects-list" ref={listRef}>
        {projects.map((p) => (
          <article
            key={p.id}
            className="project-panel"
            data-project={p.id}
            style={{ ['--project-accent' as string]: p.accent }}
          >
            <div className="project-card">
              <div className="container project-grid">
                <div className="project-meta">
                  <span className="project-index" aria-hidden="true">
                    {p.index}
                  </span>
                  <h3 className="display-md project-name">{p.name}</h3>
                  <p className="mono-label project-kind">
                    {p.kind} — {p.year}
                  </p>
                  <p className="body-lg project-kicker">{p.kicker}</p>
                  <ul className="project-bullets">
                    {p.bullets.map((b) => (
                      <li key={b.slice(0, 24)}>{b}</li>
                    ))}
                  </ul>
                  <p className="project-impact mono-label">{p.impact}</p>
                  <div className="project-actions">
                    <button className="btn project-open" onClick={() => setCaseOpenId(p.id)} data-cursor="open">
                      Case study ↗
                    </button>
                    <div className="chip-row project-chips">
                      {p.tech.slice(0, 4).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                      {p.tech.length > 4 && <span className="chip">+{p.tech.length - 4}</span>}
                    </div>
                  </div>
                </div>
                <div className="project-visual" data-motif={p.motif}>
                  <Motif project={p} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
