import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { person, sections } from '../content/resume'
import { scrollToSection } from '../lib/smoothScroll'
import { sfx } from '../audio/synth'
import { useApp } from '../store'
import './CommandPalette.css'

interface Action {
  id: string
  label: string
  hint: string
  run: () => void
}

export default function CommandPalette() {
  const open = useApp((s) => s.paletteOpen)
  const setOpen = useApp((s) => s.setPaletteOpen)
  const toggleMuted = useApp((s) => s.toggleMuted)
  const setBotMood = useApp((s) => s.setBotMood)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [flash, setFlash] = useState('')

  const actions = useMemo<Action[]>(
    () => [
      ...sections.map((s) => ({
        id: `jump-${s.id}`,
        label: `Jump to ${s.label}`,
        hint: 'navigate',
        run: () => scrollToSection(s.id),
      })),
      {
        id: 'copy-email',
        label: 'Copy email address',
        hint: person.email,
        run: () => {
          void navigator.clipboard.writeText(person.email).then(() => {
            sfx.success()
            setFlash('email copied ✓')
          })
        },
      },
      ...(person.resumePdf
        ? [
            {
              id: 'resume',
              label: 'Download résumé',
              hint: 'pdf',
              run: () => {
                const a = document.createElement('a')
                a.href = person.resumePdf
                a.download = 'Aradhya-Shinde-Resume.pdf'
                a.click()
              },
            },
          ]
        : []),
      {
        id: 'sound',
        label: 'Toggle sound',
        hint: 'mute / unmute',
        run: () => toggleMuted(),
      },
      {
        id: 'flip',
        label: 'Bot: do a flip',
        hint: '🤖',
        run: () => setBotMood('flip'),
      },
      {
        id: 'party',
        label: 'Bot: party mode',
        hint: '🪩',
        run: () => setBotMood('party'),
      },
      {
        id: 'github',
        label: 'Open GitHub profile',
        hint: '@' + person.github.handle,
        run: () => window.open(person.github.url, '_blank', 'noopener'),
      },
    ],
    [setBotMood, toggleMuted],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return actions
    return actions.filter((a) => (a.label + ' ' + a.hint).toLowerCase().includes(q))
  }, [actions, query])

  // global hotkey
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!useApp.getState().paletteOpen)
        sfx.whoosh()
      } else if (e.key === 'Escape' && useApp.getState().paletteOpen) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      setFlash('')
      window.setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => {
    setCursor(0)
  }, [query])

  const runAction = (a: Action) => {
    a.run()
    if (a.id !== 'copy-email') setOpen(false)
    else window.setTimeout(() => setOpen(false), 900)
  }

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, filtered.length - 1))
      sfx.hover()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
      sfx.hover()
    } else if (e.key === 'Enter' && filtered[cursor]) {
      runAction(filtered[cursor])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="palette"
            initial={{ y: -14, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Command palette"
          >
            <div className="palette-inputrow">
              <span className="palette-prompt mono-label">&gt;_</span>
              <input
                ref={inputRef}
                className="palette-input"
                placeholder="Type a command…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                spellCheck={false}
              />
              <span className="palette-esc mono-label">esc</span>
            </div>
            <ul className="palette-list" role="listbox">
              {filtered.length === 0 && <li className="palette-empty mono-label">nothing found</li>}
              {filtered.map((a, i) => (
                <li key={a.id}>
                  <button
                    className={`palette-item ${i === cursor ? 'is-active' : ''}`}
                    onClick={() => runAction(a)}
                    onPointerEnter={() => setCursor(i)}
                    role="option"
                    aria-selected={i === cursor}
                  >
                    <span>{flash && a.id === 'copy-email' ? flash : a.label}</span>
                    <span className="palette-hint mono-label">{a.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
