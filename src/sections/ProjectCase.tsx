import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../content/resume'
import { lockScroll, unlockScroll } from '../lib/smoothScroll'
import { sfx } from '../audio/synth'
import { useApp } from '../store'
import './ProjectCase.css'

/** Full-screen case study overlay. */
export default function ProjectCase() {
  const caseOpenId = useApp((s) => s.caseOpenId)
  const setCaseOpenId = useApp((s) => s.setCaseOpenId)
  const project = projects.find((p) => p.id === caseOpenId) ?? null

  useEffect(() => {
    if (!project) return
    lockScroll()
    sfx.whoosh()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCaseOpenId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [project, setCaseOpenId])

  const links = project ? [
    { label: 'Repository ↗', href: project.links.repo },
    { label: 'Live ↗', href: project.links.live },
  ].filter((l) => l.href) : []

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="case-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setCaseOpenId(null)}
        >
          <motion.article
            className="case-panel"
            style={{ ['--project-accent' as string]: project.accent }}
            initial={{ y: 70, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} case study`}
          >
            <header className="case-head">
              <div>
                <span className="case-index mono-label">
                  {project.index} / {project.year}
                </span>
                <h3 className="display-md case-name">{project.name}</h3>
                <p className="mono-label case-kind">{project.kind}</p>
              </div>
              <button className="case-close" onClick={() => setCaseOpenId(null)} aria-label="Close case study">
                ✕
              </button>
            </header>

            <p className="case-kicker body-lg">{project.kicker}</p>

            <div className="case-grid">
              <div>
                <p className="mono-label case-sub">What I built</p>
                <ul className="case-bullets">
                  {project.bullets.map((b) => (
                    <li key={b.slice(0, 24)}>{b}</li>
                  ))}
                </ul>
              </div>
              <aside className="case-aside">
                <div className="case-impact">
                  <p className="mono-label case-sub">Impact</p>
                  <p>{project.impact}</p>
                </div>
                <div>
                  <p className="mono-label case-sub">Stack</p>
                  <div className="chip-row">
                    {project.tech.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {links.length > 0 && (
                  <div className="case-links">
                    {links.map((l) => (
                      <a key={l.label} className="btn" href={l.href} target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
