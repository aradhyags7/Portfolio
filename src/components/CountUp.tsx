import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePrefersReducedMotion } from '../lib/hooks'

interface CountUpProps {
  value: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
}

/** Counts from 0 to value the first time it scrolls into view. */
export default function CountUp({ value, prefix = '', suffix = '', className, duration = 1.7 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.textContent = `${prefix}${value}${suffix}`
      return
    }
    const state = { v: 0 }
    const tween = gsap.to(state, {
      v: value,
      duration,
      ease: 'power3.out',
      paused: true,
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(state.v)}${suffix}`
      },
    })
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => tween.play(),
    })
    return () => {
      st.kill()
      tween.kill()
    }
  }, [value, prefix, suffix, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
