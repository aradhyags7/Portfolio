import { useEffect, useRef, useState } from 'react'
import { useApp } from '../store'
import './Preloader.css'

/**
 * Boot screen. Counts to 100 (gated on real window load + a minimum beat),
 * then reveals ENTER — the click that unlocks the AudioContext.
 */
export default function Preloader() {
  const entered = useApp((s) => s.entered)
  const enter = useApp((s) => s.enter)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [gone, setGone] = useState(false)
  const loadedRef = useRef(false)

  useEffect(() => {
    const onLoad = () => (loadedRef.current = true)
    if (document.readyState === 'complete') loadedRef.current = true
    else window.addEventListener('load', onLoad)

    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const elapsed = now - start
      // ease toward 92% on a timer; only pass it once the page really loaded
      const cap = loadedRef.current ? 100 : 92
      const target = Math.min(cap, (elapsed / 1400) * 100)
      setProgress((p) => {
        const next = p + (target - p) * 0.12
        return next > 99.2 ? 100 : next
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    // rAF stalls in hidden tabs — make sure the site is ready when the user returns
    const iv = window.setInterval(() => {
      if (loadedRef.current && performance.now() - start > 1600) {
        setProgress(100)
        window.clearInterval(iv)
      }
    }, 400)
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(iv)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  useEffect(() => {
    if (progress >= 100 && !ready) setReady(true)
  }, [progress, ready])

  useEffect(() => {
    if (!entered) return
    const t = window.setTimeout(() => setGone(true), 900)
    return () => window.clearTimeout(t)
  }, [entered])

  if (gone) return null

  return (
    <div className={`preloader ${entered ? 'is-leaving' : ''}`} role="dialog" aria-label="Loading">
      <div className="preloader-inner">
        <div className="preloader-mark" aria-hidden="true">
          AS<span>/</span>
        </div>
        {!ready ? (
          <div className="preloader-progress mono-label">
            <span className="preloader-num">{Math.floor(progress).toString().padStart(3, '0')}</span>
            <span className="preloader-bar">
              <span className="preloader-bar-fill" style={{ transform: `scaleX(${progress / 100})` }} />
            </span>
            BOOTING
          </div>
        ) : (
          <button className="btn btn-solid preloader-enter" onClick={enter} data-sfx="none">
            Enter ↵
          </button>
        )}
        <p className="preloader-hint mono-label">sound on recommended</p>
      </div>
    </div>
  )
}
