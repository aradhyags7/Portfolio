import { createElement, useEffect, useRef, type ElementType } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#______'

interface ScrambleTextProps {
  text: string
  as?: ElementType
  className?: string
  /** ms before starting once visible */
  delay?: number
}

/** Decodes its text with a scramble effect the first time it scrolls into view. */
export default function ScrambleText({ text, as = 'span', className, delay = 0 }: ScrambleTextProps) {
  const innerRef = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = innerRef.current
    if (!el || reduced) return
    let raf = 0
    let timeout = 0
    let done = false

    // per-char frame at which the real character locks in
    const locks = Array.from(text, (_, i) => 6 + i * 1.6 + Math.random() * 6)
    const total = Math.max(...locks) + 2

    const run = () => {
      let frame = 0
      const step = () => {
        frame++
        let out = ''
        for (let i = 0; i < text.length; i++) {
          const ch = text[i]
          if (ch === ' ' || frame >= locks[i]) out += ch
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        el.textContent = out
        if (frame < total) raf = requestAnimationFrame(step)
        else {
          el.textContent = text
          done = true
        }
      }
      raf = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !done) {
          io.disconnect()
          timeout = window.setTimeout(run, delay)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
      el.textContent = text
    }
  }, [text, delay, reduced])

  return createElement(
    as,
    { className, 'aria-label': text },
    <span aria-hidden="true" ref={innerRef}>
      {text}
    </span>,
  )
}
