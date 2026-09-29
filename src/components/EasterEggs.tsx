import { useEffect } from 'react'
import { sfx } from '../audio/synth'
import { useApp } from '../store'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

/** ↑↑↓↓←→←→BA — the bot throws a party. */
export default function EasterEggs() {
  const setBotMood = useApp((s) => s.setBotMood)

  useEffect(() => {
    let idx = 0
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === KONAMI[idx]) {
        idx++
        if (idx === KONAMI.length) {
          idx = 0
          sfx.success()
          sfx.chirp()
          setBotMood('party')
        }
      } else {
        idx = key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setBotMood])

  return null
}
