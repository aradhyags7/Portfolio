import { useCallback, useRef } from 'react'
import { sfx } from '../../audio/synth'
import { useMotifCanvas, type MotifCtx } from './useMotifCanvas'

interface Coin {
  x: number
  y: number
  r: number
  phase: number
  alive: boolean
  respawnAt: number
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

interface FloatText {
  x: number
  y: number
  text: string
  life: number
}

/** Finstar — clickable arcade coins with combo counter. */
export default function Arcade({ accent = '#ffb114' }: { accent?: string }) {
  const state = useRef({
    coins: [] as Coin[],
    sparks: [] as Spark[],
    texts: [] as FloatText[],
    score: 0,
    combo: 0,
    lastPop: 0,
    seeded: false,
    now: 0,
  })

  const draw = useCallback(
    ({ c, w, h, t }: MotifCtx) => {
      const s = state.current
      s.now = t
      if (!s.seeded && w > 10) {
        s.seeded = true
        s.coins = Array.from({ length: 6 }, (_, i) => ({
          x: (w / 7) * (i + 1) + (Math.random() - 0.5) * 20,
          y: h * (0.3 + Math.random() * 0.45),
          r: 15 + Math.random() * 6,
          phase: Math.random() * 6,
          alive: true,
          respawnAt: 0,
        }))
      }

      // coins
      for (const coin of s.coins) {
        if (!coin.alive) {
          if (t > coin.respawnAt) {
            coin.alive = true
            coin.x = w * (0.12 + Math.random() * 0.76)
            coin.y = h * (0.25 + Math.random() * 0.55)
          } else continue
        }
        const bob = Math.sin(t * 1.8 + coin.phase) * 6
        const y = coin.y + bob
        const squeeze = 0.82 + Math.sin(t * 2.4 + coin.phase) * 0.18
        c.save()
        c.translate(coin.x, y)
        c.scale(squeeze, 1)
        c.beginPath()
        c.arc(0, 0, coin.r, 0, Math.PI * 2)
        c.fillStyle = accent
        c.shadowColor = accent
        c.shadowBlur = 18
        c.fill()
        c.shadowBlur = 0
        c.fillStyle = '#1a1206'
        c.font = `800 ${coin.r * 1.1}px "JetBrains Mono Variable", monospace`
        c.textAlign = 'center'
        c.textBaseline = 'middle'
        c.fillText('₹', 0, 1)
        c.restore()
      }

      // sparks
      s.sparks = s.sparks.filter((sp) => sp.life > 0)
      for (const sp of s.sparks) {
        sp.life -= 0.03
        sp.x += sp.vx
        sp.y += sp.vy
        sp.vy += 0.12
        c.globalAlpha = Math.max(0, sp.life)
        c.fillStyle = accent
        c.fillRect(sp.x, sp.y, 3, 3)
      }
      c.globalAlpha = 1

      // float texts
      s.texts = s.texts.filter((ft) => ft.life > 0)
      for (const ft of s.texts) {
        ft.life -= 0.016
        ft.y -= 0.7
        c.globalAlpha = Math.max(0, ft.life)
        c.font = '800 15px "JetBrains Mono Variable", monospace'
        c.textAlign = 'center'
        c.fillStyle = '#f4f4f6'
        c.fillText(ft.text, ft.x, ft.y)
      }
      c.globalAlpha = 1

      // scoreboard
      c.font = '800 13px "JetBrains Mono Variable", monospace'
      c.textAlign = 'left'
      c.fillStyle = accent
      c.fillText(`SCORE ${String(s.score).padStart(4, '0')}`, 14, 24)
      if (s.combo > 1) {
        c.fillStyle = '#f4f4f6'
        c.fillText(`COMBO x${s.combo}`, 14, 42)
      }
      c.textAlign = 'left'
      c.font = '600 10px "JetBrains Mono Variable", monospace'
      c.fillStyle = 'rgba(244,244,246,0.4)'
      c.fillText('TAP THE COINS', 14, h - 14)
    },
    [accent],
  )

  const onTap = useCallback((x: number, y: number) => {
    const s = state.current
    for (const coin of s.coins) {
      if (!coin.alive) continue
      const dx = x - coin.x
      const dy = y - coin.y
      if (dx * dx + dy * dy < (coin.r + 12) ** 2) {
        coin.alive = false
        coin.respawnAt = s.now + 0.6
        const now = performance.now()
        s.combo = now - s.lastPop < 1400 ? s.combo + 1 : 1
        s.lastPop = now
        s.score += 10 * s.combo
        for (let i = 0; i < 10; i++) {
          s.sparks.push({
            x: coin.x,
            y: coin.y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.7) * 5,
            life: 1,
          })
        }
        s.texts.push({ x: coin.x, y: coin.y - 20, text: `+${10 * s.combo}`, life: 1 })
        if (s.combo > 0 && s.combo % 5 === 0) sfx.success()
        else sfx.pop()
        return
      }
    }
  }, [])

  return <canvas ref={useMotifCanvas(draw, onTap)} className="motif-canvas is-interactive" aria-label="Coin tapping mini-game" />
}
