import { useLayoutEffect, useRef } from 'react'
import { timeline } from '../content/resume'
import RiseText from '../components/RiseText'
import ScrambleText from '../components/ScrambleText'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/hooks'
import { sfx } from '../audio/synth'
import './Journey.css'

export default function Journey() {
  const flowRef = useRef<HTMLOListElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const flow = flowRef.current
    const svg = svgRef.current
    const path = pathRef.current
    if (!flow || !svg || !path) return

    const build = () => {
      const frame = flow.getBoundingClientRect()
      const dots = Array.from(flow.querySelectorAll<HTMLElement>('.journey-dot'))
      const pts = dots.map((d) => {
        const r = d.getBoundingClientRect()
        return { x: r.left - frame.left + r.width / 2, y: r.top - frame.top + r.height / 2 }
      })
      if (pts.length < 2) return 0
      svg.setAttribute('viewBox', `0 0 ${Math.max(1, frame.width)} ${Math.max(1, frame.height)}`)
      let d = `M ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]
        const b = pts[i]
        const my = (a.y + b.y) / 2
        d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`
      }
      path.setAttribute('d', d)
      const len = path.getTotalLength()
      path.style.strokeDasharray = String(len)
      return len
    }

    let len = build()

    if (reduced) {
      path.style.strokeDashoffset = '0'
      return
    }

    path.style.strokeDashoffset = String(len)
    const drawSt = ScrollTrigger.create({
      trigger: flow,
      start: 'top 72%',
      end: 'bottom 42%',
      scrub: 0.5,
      onUpdate: (self) => {
        path.style.strokeDashoffset = String(len * (1 - self.progress))
      },
    })

    const ro = new ResizeObserver(() => {
      len = build()
      ScrollTrigger.refresh()
    })
    ro.observe(flow)

    const itemSts: ScrollTrigger[] = []
    flow.querySelectorAll<HTMLElement>('.journey-item').forEach((item) => {
      const dot = item.querySelector('.journey-dot')
      const bits = item.querySelectorAll('.journey-year, .journey-title, .journey-detail')
      gsap.set(dot, { scale: 0 })
      gsap.set(bits, { y: 24, opacity: 0 })
      itemSts.push(
        ScrollTrigger.create({
          trigger: item,
          start: 'top 74%',
          once: true,
          onEnter: () => {
            gsap.to(dot, { scale: 1, duration: 0.55, ease: 'back.out(2.6)' })
            gsap.to(bits, { y: 0, opacity: 1, stagger: 0.08, duration: 0.65, ease: 'power3.out' })
            sfx.pop()
          },
        }),
      )
    })

    return () => {
      drawSt.kill()
      itemSts.forEach((s) => s.kill())
      ro.disconnect()
    }
  }, [reduced])

  return (
    <section id="journey" data-section="journey" className="section journey">
      <div className="container">
        <div className="section-head">
          <ScrambleText as="p" className="mono-label" text="Trophy Cabinet — 005" />
          <RiseText as="h2" className="display-lg" text="Achievements." />
          <div className="rule" />
        </div>

        <div className="journey-flow-wrap">
          <svg ref={svgRef} className="journey-svg" aria-hidden="true">
            <defs>
              <linearGradient id="journey-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#00e5ff" />
                <stop offset="1" stopColor="#ffb114" />
              </linearGradient>
            </defs>
            <path ref={pathRef} stroke="url(#journey-grad)" />
          </svg>

          <ol className="journey-flow" ref={flowRef}>
            {timeline.map((m, i) => (
              <li
                key={`${m.year}-${m.title}`}
                className={`journey-item ${i % 2 ? 'is-right' : 'is-left'} ${m.highlight ? 'is-highlight' : ''}`}
              >
                <span className="journey-dot" aria-hidden="true" />
                <span className="journey-year mono-label">{m.year}</span>
                <h3 className="journey-title">{m.title}</h3>
                <p className="journey-detail">{m.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
