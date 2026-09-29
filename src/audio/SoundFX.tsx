import { useEffect, useRef } from 'react'
import { setSfxMuted, sfx, unlockAudio, type SfxName } from './synth'
import { useApp } from '../store'

const INTERACTIVE = 'a, button, [role="button"], [data-sfx]'

/**
 * Global sound side-effects: unlocks audio on Enter, syncs mute,
 * and plays click/hover for every interactive element via delegation.
 */
export default function SoundFX() {
  const entered = useApp((s) => s.entered)
  const muted = useApp((s) => s.muted)
  const lastHover = useRef(0)

  useEffect(() => {
    setSfxMuted(muted)
  }, [muted])

  useEffect(() => {
    if (!entered) return
    unlockAudio()
    sfx.powerOn()
  }, [entered])

  useEffect(() => {
    const resolveTarget = (e: Event) => {
      const el = e.target
      if (!(el instanceof Element)) return null
      return el.closest(INTERACTIVE)
    }

    const onClick = (e: MouseEvent) => {
      const t = resolveTarget(e)
      if (!t) return
      const kind = t.getAttribute('data-sfx')
      if (kind === 'none') return
      if (kind && kind in sfx) sfx[kind as SfxName]()
      else sfx.click()
    }

    const onOver = (e: PointerEvent) => {
      const t = resolveTarget(e)
      if (!t || t.getAttribute('data-sfx') === 'none') return
      const rel = e.relatedTarget
      if (rel instanceof Node && t.contains(rel)) return // still inside same control
      const now = performance.now()
      if (now - lastHover.current < 70) return
      lastHover.current = now
      sfx.hover()
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('pointerover', onOver, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('pointerover', onOver, true)
    }
  }, [])

  return null
}
