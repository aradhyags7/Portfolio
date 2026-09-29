import { useRef, useState } from 'react'
import { person } from '../content/resume'
import Magnetic from '../components/Magnetic'
import RiseText from '../components/RiseText'
import { sfx } from '../audio/synth'
import './Contact.css'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const revertTimer = useRef(0)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      sfx.success()
      setCopied(true)
      window.clearTimeout(revertTimer.current)
      revertTimer.current = window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // clipboard blocked → fall back to the mail app
      window.location.href = `mailto:${person.email}`
    }
  }

  return (
    <section id="contact" data-section="contact" className="section contact">
      <div className="container contact-inner">
        <p className="mono-label">Next — 006</p>
        <RiseText as="h2" className="display-lg contact-heading" text="Let's build something." />
        <p className="body-lg contact-sub">
          Open to internships, freelance work, and ambitious ideas that need shipping.
        </p>

        <div className="contact-actions">
          <Magnetic strength={0.25}>
            <button
              className={`btn btn-solid contact-copy ${copied ? 'is-copied' : ''}`}
              onClick={copyEmail}
              data-sfx="none"
              data-cursor="copy"
            >
              {copied ? 'copied to clipboard ✓' : person.email}
            </button>
          </Magnetic>
          {person.resumePdf && (
            <Magnetic strength={0.25}>
              <a className="btn" href={person.resumePdf} download="Aradhya-Shinde-Resume.pdf">
                Résumé ↓
              </a>
            </Magnetic>
          )}
          <a className="contact-mailto mono-label" href={`mailto:${person.email}`}>
            or open mail app ↗
          </a>
        </div>

        <footer className="contact-footer">
          <div className="contact-footer-left mono-label">
            © 2026 {person.name} — {person.location}
          </div>
          <div className="contact-footer-links">
            <a href={person.github.url} target="_blank" rel="noreferrer" className="mono-label" data-sfx="click">
              GitHub
            </a>
            <a href={person.linkedin.url} target="_blank" rel="noreferrer" className="mono-label" data-sfx="click">
              LinkedIn
            </a>
          </div>
          <div className="contact-footer-right mono-label">
            built with React · Three.js · too much chai — press <kbd>Ctrl K</kbd>
          </div>
        </footer>
      </div>
    </section>
  )
}
