import { createElement, useLayoutEffect, useRef, type ElementType } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/hooks'

interface RiseTextProps {
  text: string
  as?: ElementType
  className?: string
}

/** Words rise out of an overflow mask the first time the element scrolls in. */
export default function RiseText({ text, as: Tag = 'h2', className }: RiseTextProps) {
  const firstWord = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const el = firstWord.current?.parentElement
    if (!el || reduced) return
    const inners = el.querySelectorAll<HTMLElement>('.rise-i')
    gsap.set(inners, { yPercent: 112 })
    const tween = gsap.to(inners, {
      yPercent: 0,
      duration: 0.95,
      ease: 'power4.out',
      stagger: 0.05,
      paused: true,
    })
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () => tween.play(),
    })
    return () => {
      st.kill()
      tween.kill()
    }
  }, [text, reduced])

  return createElement(
    Tag,
    { className, 'aria-label': text },
    ...text.split(' ').map((w, i) => (
      <span className="rise-w" key={`${w}-${i}`} aria-hidden="true" ref={i === 0 ? firstWord : undefined}>
        <span className="rise-i">{w}&nbsp;</span>
      </span>
    )),
  )
}
