import { useCallback, useRef } from 'react'
import { useMotifCanvas, type MotifCtx } from './useMotifCanvas'

const AGENTS = ['Symptoms', 'Reports', 'Risk', 'Vitals', 'History', 'Routing', 'Escalate', 'Summary']

/** AI Health Companion — 8 agents orbiting a safety core. */
export default function Orbit({ accent = '#2ee6a8' }: { accent?: string }) {
  const hovered = useRef(-1)

  const draw = useCallback(
    ({ c, w, h, t, pointer }: MotifCtx) => {
      const cx = w / 2
      const cy = h / 2
      const R1 = Math.min(w, h) * 0.24
      const R2 = Math.min(w, h) * 0.4

      // core
      const pulse = 1 + Math.sin(t * 2.2) * 0.08
      const coreR = Math.min(w, h) * 0.075 * pulse
      const grad = c.createRadialGradient(cx, cy, 1, cx, cy, coreR * 2.4)
      grad.addColorStop(0, `${accent}ee`)
      grad.addColorStop(0.5, `${accent}44`)
      grad.addColorStop(1, 'transparent')
      c.fillStyle = grad
      c.beginPath()
      c.arc(cx, cy, coreR * 2.4, 0, Math.PI * 2)
      c.fill()
      c.fillStyle = '#07120d'
      c.beginPath()
      c.arc(cx, cy, coreR, 0, Math.PI * 2)
      c.fill()
      c.strokeStyle = accent
      c.lineWidth = 1.5
      c.stroke()
      c.font = `700 ${Math.max(9, coreR * 0.5)}px "JetBrains Mono Variable", monospace`
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillStyle = accent
      c.fillText('CORE', cx, cy)

      // orbit rings
      c.strokeStyle = 'rgba(244,244,246,0.09)'
      c.lineWidth = 1
      for (const r of [R1, R2]) {
        c.beginPath()
        c.arc(cx, cy, r, 0, Math.PI * 2)
        c.stroke()
      }

      hovered.current = -1
      for (let i = 0; i < 8; i++) {
        const ring = i < 5 ? R2 : R1
        const speed = i < 5 ? 0.32 : -0.5
        const angle = t * speed + (i < 5 ? (i / 5) * Math.PI * 2 : ((i - 5) / 3) * Math.PI * 2)
        const x = cx + Math.cos(angle) * ring
        const y = cy + Math.sin(angle) * ring

        const dx = pointer.x - x
        const dy = pointer.y - y
        const hot = dx * dx + dy * dy < 18 * 18
        if (hot) hovered.current = i

        // connection to core
        c.strokeStyle = hot ? accent : `${accent}22`
        c.lineWidth = hot ? 1.4 : 1
        c.beginPath()
        c.moveTo(cx, cy)
        c.lineTo(x, y)
        c.stroke()

        c.fillStyle = hot ? '#f4f4f6' : accent
        c.shadowColor = accent
        c.shadowBlur = hot ? 16 : 8
        c.beginPath()
        c.arc(x, y, hot ? 7 : 5, 0, Math.PI * 2)
        c.fill()
        c.shadowBlur = 0

        if (hot) {
          const label = AGENTS[i]
          c.font = '700 11px "JetBrains Mono Variable", monospace'
          const tw = c.measureText(label).width + 14
          const lx = Math.min(Math.max(x, tw / 2 + 4), w - tw / 2 - 4)
          c.fillStyle = '#0b1a13'
          c.strokeStyle = accent
          c.beginPath()
          c.roundRect(lx - tw / 2, y - 34, tw, 20, 6)
          c.fill()
          c.stroke()
          c.fillStyle = accent
          c.fillText(label, lx, y - 24)
        }
      }

      c.font = '600 10px "JetBrains Mono Variable", monospace'
      c.textAlign = 'left'
      c.fillStyle = 'rgba(244,244,246,0.4)'
      c.fillText('8 AGENTS · HOVER THEM', 14, h - 14)
    },
    [accent],
  )

  return <canvas ref={useMotifCanvas(draw)} className="motif-canvas is-interactive" aria-label="Agent orbit diagram" />
}
