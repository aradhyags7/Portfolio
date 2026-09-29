import { useEffect, useRef, useState } from 'react'
import { sfx } from '../../audio/synth'
import { usePrefersReducedMotion } from '../../lib/hooks'
import './Vault.css'

const PLAIN = [
  'patient : "Ananya S."',
  'dob     : 2001-04-12',
  'bp      : 118/76 mmHg',
  'rx      : metformin 500mg',
  'allergy : penicillin',
  'notes   : follow-up in 2w',
]

const CIPHER_CHARS = 'ABCDEF0123456789abcdef$#@%&!?'

function randomCipher(len: number) {
  let out = ''
  for (let i = 0; i < len; i++) {
    out += Math.random() < 0.12 ? ' ' : CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]
  }
  return out
}

/** HealthVault — flip a record between plaintext and AES-gibberish. */
export default function Vault({ accent = '#00e5ff' }: { accent?: string }) {
  const [locked, setLocked] = useState(false)
  const [lines, setLines] = useState(PLAIN)
  const [autoDone, setAutoDone] = useState(false)
  const animRef = useRef(0)
  const hostRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const scrambleTo = (targetLocked: boolean) => {
    cancelAnimationFrame(animRef.current)
    const targets = targetLocked ? PLAIN.map((l) => randomCipher(l.length + 4)) : PLAIN
    if (reduced) {
      setLines(targets)
      return
    }
    let frame = 0
    const total = 26
    const step = () => {
      frame++
      setLines(
        targets.map((target, li) => {
          const settle = (frame / total) * (target.length + 6) - li * 1.5
          let out = ''
          for (let i = 0; i < target.length; i++) {
            out += i < settle ? target[i] : CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]
          }
          return out
        }),
      )
      if (frame < total) animRef.current = requestAnimationFrame(step)
      else setLines(targets)
    }
    animRef.current = requestAnimationFrame(step)
  }

  const toggle = () => {
    const next = !locked
    setLocked(next)
    setAutoDone(true)
    scrambleTo(next)
    if (next) sfx.whoosh()
    else sfx.success()
  }

  // auto-demo the first time it scrolls into view
  useEffect(() => {
    const el = hostRef.current
    if (!el || autoDone) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          window.setTimeout(() => {
            setLocked((cur) => {
              if (!cur) {
                scrambleTo(true)
                return true
              }
              return cur
            })
          }, 1100)
        }
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDone])

  useEffect(() => () => cancelAnimationFrame(animRef.current), [])

  return (
    <div ref={hostRef} className={`vault ${locked ? 'is-locked' : ''}`} style={{ ['--vault-accent' as string]: accent }}>
      <div className="vault-titlebar">
        <span className="mono-label">record_0042.hv</span>
        <span className={`vault-state mono-label ${locked ? 'is-on' : ''}`}>
          {locked ? 'AES-256-GCM · SEALED' : 'PLAINTEXT · EXPOSED'}
        </span>
      </div>
      <pre className="vault-body" aria-label={locked ? 'Encrypted record' : 'Sample health record'}>
        {lines.join('\n')}
      </pre>
      <button className="vault-btn" onClick={toggle} data-sfx="none" data-cursor={locked ? 'unlock' : 'lock'}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          {locked ? (
            <path
              fill="currentColor"
              d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z"
            />
          ) : (
            <path
              fill="currentColor"
              d="M12 2a5 5 0 0 0-5 5h2a3 3 0 1 1 6 0v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Z"
            />
          )}
        </svg>
        {locked ? 'Decrypt with my key' : 'Encrypt record'}
      </button>
    </div>
  )
}
