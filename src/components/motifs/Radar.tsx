import { useCallback, useRef } from 'react'
import { useMotifCanvas, type MotifCtx } from './useMotifCanvas'

interface Blip {
  a: number
  r: number
  patched: boolean
  hits: number
}

/** Onyx — radar sweep hunting vulnerabilities; blips get "patched" over time. */
export default function Radar({ accent = '#ff4655' }: { accent?: string }) {
  const state = useRef({
    sweep: 0,
    blips: Array.from({ length: 8 }, (): Blip => ({
      a: Math.random() * Math.PI * 2,
      r: 0.25 + Math.random() * 0.65,
      patched: false,
      hits: 0,
    })),
  })

  const draw = useCallback(
    ({ c, w, h, t, dt }: MotifCtx) => {
      const s = state.current
      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.42

      // rings + cross
      c.strokeStyle = 'rgba(244,244,246,0.10)'
      c.lineWidth = 1
      for (let i = 1; i <= 3; i++) {
        c.beginPath()
        c.arc(cx, cy, (R * i) / 3, 0, Math.PI * 2)
        c.stroke()
      }
      c.beginPath()
      c.moveTo(cx - R, cy)
      c.lineTo(cx + R, cy)
      c.moveTo(cx, cy - R)
      c.lineTo(cx, cy + R)
      c.stroke()

      // sweep
      s.sweep = (s.sweep + dt * 1.1) % (Math.PI * 2)
      const grad = c.createConicGradient(s.sweep, cx, cy)
      grad.addColorStop(0, `${accent}55`)
      grad.addColorStop(0.12, `${accent}18`)
      grad.addColorStop(0.25, 'transparent')
      grad.addColorStop(1, 'transparent')
      c.fillStyle = grad
      c.beginPath()
      c.moveTo(cx, cy)
      c.arc(cx, cy, R, 0, Math.PI * 2)
      c.fill()

      // beam edge
      c.strokeStyle = `${accent}cc`
      c.lineWidth = 1.5
      c.beginPath()
      c.moveTo(cx, cy)
      c.lineTo(cx + Math.cos(s.sweep) * R, cy + Math.sin(s.sweep) * R)
      c.stroke()

      // blips
      for (const b of s.blips) {
        const bx = cx + Math.cos(b.a) * b.r * R
        const by = cy + Math.sin(b.a) * b.r * R
        let diff = s.sweep - b.a
        while (diff < 0) diff += Math.PI * 2
        if (diff < 0.05 && dt > 0) {
          b.hits++
          if (!b.patched && b.hits > 2 && Math.random() < 0.4) b.patched = true
          else if (b.patched && Math.random() < 0.08) {
            // new vuln appears elsewhere
            b.patched = false
            b.hits = 0
            b.a = Math.random() * Math.PI * 2
            b.r = 0.25 + Math.random() * 0.65
          }
        }
        const glow = Math.max(0.15, Math.exp(-diff * 2.2))
        const col = b.patched ? '#2ee6a8' : accent
        c.fillStyle = col
        c.globalAlpha = glow
        c.beginPath()
        c.arc(bx, by, b.patched ? 3 : 4, 0, Math.PI * 2)
        c.fill()
        c.globalAlpha = glow * 0.35
        c.beginPath()
        c.arc(bx, by, 9, 0, Math.PI * 2)
        c.fill()
        c.globalAlpha = 1
        if (b.patched && glow > 0.5) {
          c.font = '600 9px "JetBrains Mono Variable", monospace'
          c.fillStyle = '#2ee6a8'
          c.fillText('PATCHED', bx + 10, by + 3)
        }
      }

      // scan label
      c.font = '600 10px "JetBrains Mono Variable", monospace'
      c.fillStyle = 'rgba(244,244,246,0.45)'
      c.fillText(`SCANNING :: ${Math.floor(t * 7) % 999} probes`, 14, h - 14)
    },
    [accent],
  )

  return <canvas ref={useMotifCanvas(draw)} className="motif-canvas" aria-label="Radar scan animation" />
}
