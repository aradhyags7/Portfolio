import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../lib/hooks'

export interface MotifCtx {
  c: CanvasRenderingContext2D
  w: number
  h: number
  t: number
  dt: number
  pointer: { x: number; y: number; down: boolean }
}

/**
 * Shared plumbing for the 2D-canvas project motifs: DPR-aware sizing,
 * pause-when-offscreen, pointer state, reduced-motion single frame.
 */
export function useMotifCanvas(draw: (m: MotifCtx) => void, onTap?: (x: number, y: number) => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const c = canvas.getContext('2d')
    if (!c) return

    let w = 0
    let h = 0
    let raf = 0
    let running = false
    let last = performance.now()
    let t = 0
    const pointer = { x: -1e3, y: -1e3, down: false }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = Math.max(1, Math.round(r.width))
      h = Math.max(1, Math.round(r.height))
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduced) frame(true)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const frame = (single = false) => {
      const now = performance.now()
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      c.clearRect(0, 0, w, h)
      draw({ c, w, h, t, dt, pointer })
      if (!single && running) raf = requestAnimationFrame(() => frame())
    }

    const start = () => {
      if (running || reduced) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(() => frame())
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start()
        else stop()
      },
      { threshold: 0.05 },
    )
    io.observe(canvas)

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e)
      pointer.x = p.x
      pointer.y = p.y
    }
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e)
      pointer.down = true
      onTap?.(p.x, p.y)
    }
    const onUp = () => (pointer.down = false)
    const onLeave = () => {
      pointer.x = -1e3
      pointer.y = -1e3
    }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [draw, onTap, reduced])

  return canvasRef
}
