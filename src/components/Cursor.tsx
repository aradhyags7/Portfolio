import { useEffect, useRef, useState } from 'react'
import { useIsTouch, usePrefersReducedMotion } from '../lib/hooks'
import './Cursor.css'

const HOVER_TARGETS = 'a, button, [role="button"], [data-cursor]'

/** Custom cursor: instant dot + trailing ring. Fine pointers only. */
export default function Cursor() {
  const touch = useIsTouch()
  const reduced = usePrefersReducedMotion()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (touch) return
    document.body.classList.add('has-custom-cursor')
    return () => document.body.classList.remove('has-custom-cursor')
  }, [touch])

  useEffect(() => {
    if (touch) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pos = { ...target }
    let visible = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      if (!visible) {
        visible = true
        dot.classList.add('is-visible')
        ring.classList.add('is-visible')
        pos.x = target.x
        pos.y = target.y
      }
    }

    const onLeave = () => {
      visible = false
      dot.classList.remove('is-visible')
      ring.classList.remove('is-visible')
    }

    const onOver = (e: PointerEvent) => {
      const el = e.target
      if (!(el instanceof Element)) return
      const t = el.closest(HOVER_TARGETS)
      if (t) {
        ring.classList.add('is-hover')
        setLabel(t.getAttribute('data-cursor') ?? '')
      } else {
        ring.classList.remove('is-hover')
        setLabel('')
      }
    }

    const onDown = () => ring.classList.add('is-down')
    const onUp = () => ring.classList.remove('is-down')

    const ease = reduced ? 1 : 0.16
    const loop = () => {
      pos.x += (target.x - pos.x) * ease
      pos.y += (target.y - pos.y) * ease
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerover', onOver, true)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerover', onOver, true)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [touch, reduced])

  if (touch) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span className="cursor-label">{label}</span>
      </div>
    </>
  )
}
