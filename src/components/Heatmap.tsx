import { useEffect, useMemo, useRef, useState } from 'react'
import { person } from '../content/resume'
import { fetchContributions, type Contribution } from '../lib/github'
import CountUp from './CountUp'
import './Heatmap.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface Tooltip {
  x: number
  y: number
  text: string
}

export default function Heatmap() {
  const [days, setDays] = useState<Contribution[] | null>(null)
  const [live, setLive] = useState(false)
  const [tip, setTip] = useState<Tooltip | null>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let on = true
    fetchContributions(person.github.handle).then(({ data, live }) => {
      if (!on) return
      setDays(data.contributions)
      setLive(live)
    })
    return () => {
      on = false
    }
  }, [])

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const { weeks, total, monthMarks } = useMemo(() => {
    if (!days) return { weeks: [] as Contribution[][], total: 0, monthMarks: [] as Array<{ week: number; label: string }> }
    const total = days.reduce((sum, d) => sum + d.count, 0)

    // pad the first week so columns align to weekdays
    const firstDow = new Date(days[0].date + 'T00:00:00').getDay()
    const padded: (Contribution | null)[] = [...Array<null>(firstDow).fill(null), ...days]
    const weeks: Contribution[][] = []
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7).filter((d): d is Contribution => !!d))
    }

    const monthMarks: Array<{ week: number; label: string }> = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const first = week[0]
      if (!first) return
      const m = new Date(first.date + 'T00:00:00').getMonth()
      if (m !== lastMonth) {
        monthMarks.push({ week: wi, label: MONTHS[m] })
        lastMonth = m
      }
    })
    return { weeks, total, monthMarks: monthMarks.slice(1) } // drop partial first label
  }, [days])

  const onOver = (e: React.PointerEvent) => {
    const t = e.target
    if (!(t instanceof HTMLElement) || !t.dataset.date) {
      setTip(null)
      return
    }
    const host = hostRef.current!.getBoundingClientRect()
    const r = t.getBoundingClientRect()
    setTip({
      x: r.left - host.left + r.width / 2,
      y: r.top - host.top - 10,
      text: `${t.dataset.count} contribution${t.dataset.count === '1' ? '' : 's'} — ${t.dataset.date}`,
    })
  }

  return (
    <div className="heatmap" ref={hostRef} onPointerMove={onOver} onPointerLeave={() => setTip(null)}>
      <div className="heatmap-meta">
        <p className="heatmap-total">
          {days ? (
            <>
              <CountUp value={total} className="heatmap-total-num" /> contributions in the last year
            </>
          ) : (
            'contacting github…'
          )}
        </p>
        <span className={`heatmap-badge mono-label ${live ? 'is-live' : ''}`}>
          {days ? (live ? '● LIVE' : '● SNAPSHOT') : '● …'}
        </span>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-months mono-label" aria-hidden="true">
          {monthMarks.map((m) => (
            <span key={`${m.label}-${m.week}`} style={{ gridColumnStart: m.week + 1 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className={`heatmap-grid ${visible ? 'is-in' : ''}`} role="img" aria-label="GitHub contribution heatmap, last 12 months">
          {weeks.map((week, wi) => (
            <div className="heatmap-col" key={wi}>
              {week.map((d, di) => (
                <span
                  key={d.date}
                  className="heatmap-cell"
                  data-level={d.level}
                  data-date={d.date}
                  data-count={d.count}
                  style={{ ['--d' as string]: `${wi * 14 + di * 8}ms` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <a className="heatmap-link mono-label" href={person.github.url} target="_blank" rel="noreferrer">
        @{person.github.handle} ↗
      </a>

      {tip && (
        <div className="heatmap-tip mono-label" style={{ left: tip.x, top: tip.y }}>
          {tip.text}
        </div>
      )}
    </div>
  )
}
