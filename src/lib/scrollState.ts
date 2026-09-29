/**
 * Mutable shared state read by the 3D layer every frame — deliberately not
 * React state (no re-renders at 60fps).
 */
export const scrollState = {
  /** lenis velocity (px/frame-ish), signed */
  velocity: 0,
  /** 0 → 1 as the hero section scrolls away */
  heroProgress: 0,
  /** performance.now() of the last user input */
  lastActivity: typeof performance !== 'undefined' ? performance.now() : 0,
}

export function markActivity() {
  scrollState.lastActivity = performance.now()
}

let bound = false
export function bindActivityListeners() {
  if (bound || typeof window === 'undefined') return
  bound = true
  window.addEventListener('pointermove', markActivity, { passive: true })
  window.addEventListener('pointerdown', markActivity, { passive: true })
  window.addEventListener('wheel', markActivity, { passive: true })
  window.addEventListener('touchstart', markActivity, { passive: true })
  window.addEventListener('keydown', markActivity)
}
