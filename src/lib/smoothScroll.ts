import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { scrollState } from './scrollState'

let lenis: Lenis | null = null

function tick(time: number) {
  if (!lenis) return
  lenis.raf(time * 1000)
  scrollState.velocity = lenis.velocity
}

export function initSmoothScroll(reduced: boolean) {
  if (reduced || lenis) return lenis
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.5 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function destroySmoothScroll() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  lenis.destroy()
  lenis = null
}

export function getLenis() {
  return lenis
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/** freeze page scroll while an overlay is open */
export function lockScroll() {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll() {
  lenis?.start()
  document.documentElement.style.overflow = ''
}
