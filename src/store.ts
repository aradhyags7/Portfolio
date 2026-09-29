import { create } from 'zustand'
import type { SectionId } from './content/resume'

export type BotMood = 'idle' | 'happy' | 'dizzy' | 'sleep' | 'wave' | 'flip' | 'party'

interface AppState {
  /** user clicked Enter on the preloader (also unlocks audio) */
  entered: boolean
  enter: () => void
  muted: boolean
  toggleMuted: () => void
  section: SectionId
  setSection: (s: SectionId) => void
  botMood: BotMood
  setBotMood: (m: BotMood) => void
  /** bot steps aside while an interactive 3D panel owns the screen */
  botSuppressed: boolean
  setBotSuppressed: (v: boolean) => void
  paletteOpen: boolean
  setPaletteOpen: (v: boolean) => void
  caseOpenId: string | null
  setCaseOpenId: (id: string | null) => void
}

const storedMute =
  typeof window !== 'undefined' && window.localStorage.getItem('at-muted') === '1'

export const useApp = create<AppState>((set) => ({
  entered: false,
  enter: () => set({ entered: true }),
  muted: storedMute,
  toggleMuted: () =>
    set((s) => {
      const muted = !s.muted
      window.localStorage.setItem('at-muted', muted ? '1' : '0')
      return { muted }
    }),
  section: 'hero',
  setSection: (section) => set({ section }),
  botMood: 'idle',
  setBotMood: (botMood) => set({ botMood }),
  botSuppressed: false,
  setBotSuppressed: (botSuppressed) => set({ botSuppressed }),

  paletteOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  caseOpenId: null,
  setCaseOpenId: (caseOpenId) => set({ caseOpenId }),
}))

// dev-only handle for poking at state from the console; stripped from builds
if (import.meta.env.DEV) {
  ;(window as unknown as { __app?: typeof useApp }).__app = useApp
}
