import { setSfxMuted, sfx } from '../audio/synth'
import { useApp } from '../store'
import './SoundToggle.css'

export default function SoundToggle() {
  const muted = useApp((s) => s.muted)
  const toggleMuted = useApp((s) => s.toggleMuted)

  const onClick = () => {
    if (muted) {
      toggleMuted()
      setSfxMuted(false) // sync immediately so the confirmation click is audible
      sfx.click()
    } else {
      sfx.click()
      toggleMuted()
      setSfxMuted(true)
    }
  }

  return (
    <button
      className={`sound-toggle ${muted ? 'is-muted' : ''}`}
      onClick={onClick}
      aria-pressed={!muted}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Sound: off' : 'Sound: on'}
      data-sfx="none"
    >
      <span />
      <span />
      <span />
      <span />
    </button>
  )
}
