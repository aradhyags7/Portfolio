import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { sfx } from '../../audio/synth'
import './SwipeDeck.css'

interface Profile {
  id: string
  name: string
  role: string
  wants: string
  emoji: string
  self?: boolean
}

const PROFILES: Profile[] = [
  { id: 'p1', name: 'Aisha', role: 'Rust · systems', wants: 'hackathon partner', emoji: '🦀' },
  { id: 'p2', name: 'Dev', role: 'Flutter · mobile', wants: 'co-founder energy', emoji: '📱' },
  { id: 'p3', name: 'Mira', role: 'ML · vision', wants: 'weekend project', emoji: '👁️' },
  { id: 'p4', name: 'Kabir', role: 'Go · backend', wants: 'open-source crew', emoji: '⚡' },
  { id: 'p5', name: 'Aradhya', role: 'Systems · ML', wants: 'HPC & AI research', emoji: '⚡', self: true },
]

function TopCard({ profile, onGone }: { profile: Profile; onGone: (dir: 1 | -1) => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-16, 16])
  const matchOpacity = useTransform(x, [40, 130], [0, 1])
  const skipOpacity = useTransform(x, [-130, -40], [1, 0])

  return (
    <motion.div
      className="swipe-card is-top"
      style={{ x, rotate }}
      drag="x"
      dragElastic={0.85}
      dragConstraints={{ left: 0, right: 0 }}
      dragMomentum={false}
      whileTap={{ scale: 1.03 }}
      onDragEnd={(_, info) => {
        const power = info.offset.x + info.velocity.x * 0.2
        if (power > 110) {
          sfx.chirp()
          void animate(x, 480, { duration: 0.32, ease: 'easeIn' }).then(() => onGone(1))
        } else if (power < -110) {
          if (profile.self) {
            // you can't skip the guy whose portfolio this is
            sfx.boing()
            void animate(x, 0, { type: 'spring', stiffness: 320, damping: 18 })
          } else {
            sfx.click()
            void animate(x, -480, { duration: 0.32, ease: 'easeIn' }).then(() => onGone(-1))
          }
        }
      }}
    >
      <span className="swipe-emoji" aria-hidden="true">{profile.emoji}</span>
      <strong className="swipe-name">{profile.name}</strong>
      <span className="swipe-role">{profile.role}</span>
      <span className="swipe-wants mono-label">wants: {profile.wants}</span>
      <motion.span className="swipe-stamp is-match" style={{ opacity: matchOpacity }}>
        MATCH
      </motion.span>
      <motion.span className="swipe-stamp is-skip" style={{ opacity: profile.self ? 0 : skipOpacity }}>
        SKIP
      </motion.span>
      {profile.self && <span className="swipe-hint mono-label">(this one only swipes right)</span>}
    </motion.div>
  )
}

/** Codeswipe — an actually swipeable deck. */
export default function SwipeDeck() {
  const [order, setOrder] = useState(PROFILES)
  const [matches, setMatches] = useState(0)

  const rotateDeck = (dir: 1 | -1) => {
    if (dir === 1) setMatches((m) => m + 1)
    setOrder((prev) => [...prev.slice(1), prev[0]])
  }

  return (
    <div className="swipe-deck" data-cursor="drag">
      {order
        .slice(0, 3)
        .map((p, i) =>
          i === 0 ? (
            <TopCard key={p.id} profile={p} onGone={rotateDeck} />
          ) : (
            <div
              key={p.id}
              className="swipe-card"
              style={{ transform: `translateY(${i * 14}px) scale(${1 - i * 0.06})`, zIndex: -i, opacity: 1 - i * 0.28 }}
              aria-hidden="true"
            >
              <span className="swipe-emoji">{p.emoji}</span>
              <strong className="swipe-name">{p.name}</strong>
              <span className="swipe-role">{p.role}</span>
            </div>
          ),
        )
        .reverse()}
      <span className="swipe-counter mono-label">
        {matches} match{matches === 1 ? '' : 'es'} · drag the card
      </span>
    </div>
  )
}
