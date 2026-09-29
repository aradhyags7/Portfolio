import { interests, person } from '../content/resume'
import Magnetic from '../components/Magnetic'
import Marquee from '../components/Marquee'
import RiseText from '../components/RiseText'
import ScrambleText from '../components/ScrambleText'
import './About.css'

export default function About() {
  return (
    <section id="about" data-section="about" className="section about">
      <div className="container">
        <div className="section-head">
          <ScrambleText as="p" className="mono-label" text="About — 001" />
          <RiseText as="h2" className="display-lg" text="Systems & ML from first principles." />
          <div className="rule" />
        </div>

        <div className="about-grid">
          <div className="about-copy">
            {person.about.map((p) => (
              <p key={p.slice(0, 24)} className="body-lg">
                {p}
              </p>
            ))}
          </div>

          <div className="about-side">
            <p className="mono-label">Find me</p>
            <div className="about-links">
              <Magnetic>
                <a className="btn" href={person.github.url} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn" href={person.linkedin.url} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn" href={`mailto:${person.email}`}>
                  Email ↗
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="about-interests" aria-label="Interests">
          <Marquee speed={30}>
            {interests.map((it) => (
              <span key={it} className="chip">
                {it}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
