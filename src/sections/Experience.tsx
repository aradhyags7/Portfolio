import { useLayoutEffect, useRef } from 'react'
import { experience } from '../content/resume'
import RiseText from '../components/RiseText'
import ScrambleText from '../components/ScrambleText'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/hooks'
import './Experience.css'

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list || reduced) return

    // fromTo inside a context, like Projects: the starts get remeasured on every
    // ScrollTrigger.refresh, which matters because the pinned Projects section
    // above us changes how far down these rows actually sit.
    const ctx = gsap.context(() => {
      list.querySelectorAll<HTMLElement>('.xp-row').forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll('.xp-meta > *, .xp-head > *, .xp-bullets li, .xp-tech li'),
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            stagger: 0.05,
            scrollTrigger: { trigger: row, start: 'top 78%', once: true },
          },
        )
      })
    }, list)

    // the preloader gate and the pinned Projects section both settle after this
    // effect runs, so remeasure whenever our own box changes — same trick Journey uses.
    const ro = new ResizeObserver(() => ScrollTrigger.refresh())
    ro.observe(list)

    return () => {
      ro.disconnect()
      ctx.revert()
    }
  }, [reduced])

  return (
    <section id="experience" data-section="experience" className="section experience">
      <div className="container">
        <div className="section-head">
          <ScrambleText as="p" className="mono-label" text="Where I've built — 003" />
          <RiseText as="h2" className="display-lg" text="Experience." />
          <div className="rule" />
        </div>

        <ol className="xp-list" ref={listRef}>
          {experience.map((role) => (
            <li key={role.id} className={`xp-row ${role.current ? 'is-current' : ''}`}>
              <div className="xp-meta">
                <span className="xp-period mono-label">{role.period}</span>
                <span className="xp-location mono-label">{role.location}</span>
                {role.current && <span className="xp-live mono-label">Currently here</span>}
              </div>

              <div className="xp-body">
                <div className="xp-head">
                  <h3 className="xp-company">
                    {role.company}
                    {role.site && <span className="xp-site">{role.site}</span>}
                  </h3>
                  <p className="xp-title">{role.title}</p>
                </div>

                <ul className="xp-bullets">
                  {role.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <ul className="xp-tech">
                  {role.tech.map((t) => (
                    <li key={t} className="mono-label">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
