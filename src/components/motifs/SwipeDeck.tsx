import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { sfx } from '../../audio/synth'
import './SwipeDeck.css'

interface LessonCard {
  id: string
  name: string
  domain: string
  concept: string
  emoji: string
  core?: boolean
}

const LESSONS: LessonCard[] = [
  { id: 'l1', name: 'Calculus', domain: 'Symbolic Math', concept: 'SymPy step verification', emoji: '📐' },
  { id: 'l2', name: 'Physics', domain: 'Simulation', concept: 'WebGPU 3D vector fields', emoji: '⚛️' },
  { id: 'l3', name: 'CompSci', domain: 'Code Sandbox', concept: 'Monaco AST parser & trace', emoji: '💻' },
  { id: 'l4', name: 'Biology', domain: 'Molecular 3D', concept: 'Interactive MolStar PDB', emoji: '🧬' },
  { id: 'l5', name: 'Mentora AI', domain: 'Autonomous Teacher', concept: 'Sub-500ms WebRTC voice', emoji: '🎓', core: true },
]

function TopCard({ card, onGone }: { card: LessonCard; onGone: (dir: 1 | -1) => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-16, 16])
  const masterOpacity = useTransform(x, [40, 130], [0, 1])
  const reviewOpacity = useTransform(x, [-130, -40], [1, 0])

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
          if (card.core) {
            // the AI teacher stays in the classroom
            sfx.boing()
            void animate(x, 0, { type: 'spring', stiffness: 320, damping: 18 })
          } else {
            sfx.click()
            void animate(x, -480, { duration: 0.32, ease: 'easeIn' }).then(() => onGone(-1))
          }
        }
      }}
    >
      <span className="swipe-emoji" aria-hidden="true">{card.emoji}</span>
      <strong className="swipe-name">{card.name}</strong>
      <span className="swipe-role">{card.domain}</span>
      <span className="swipe-wants mono-label">focus: {card.concept}</span>
      <motion.span className="swipe-stamp is-match" style={{ opacity: masterOpacity }}>
        MASTERED
      </motion.span>
      <motion.span className="swipe-stamp is-skip" style={{ opacity: card.core ? 0 : reviewOpacity }}>
        REVIEW
      </motion.span>
      {card.core && <span className="swipe-hint mono-label">(AI teacher is permanent)</span>}
    </motion.div>
  )
}

/** Mentora dynamic classroom lesson deck. */
export default function SwipeDeck() {
  const [order, setOrder] = useState(LESSONS)
  const [mastered, setMastered] = useState(0)

  const rotateDeck = (dir: 1 | -1) => {
    if (dir === 1) setMastered((m) => m + 1)
    setOrder((prev) => [...prev.slice(1), prev[0]])
  }

  return (
    <div className="swipe-deck" data-cursor="drag">
      {order
        .slice(0, 3)
        .map((p, i) =>
          i === 0 ? (
            <TopCard key={p.id} card={p} onGone={rotateDeck} />
          ) : (
            <div
              key={p.id}
              className="swipe-card"
              style={{ transform: `translateY(${i * 14}px) scale(${1 - i * 0.06})`, zIndex: -i, opacity: 1 - i * 0.28 }}
              aria-hidden="true"
            >
              <span className="swipe-emoji">{p.emoji}</span>
              <strong className="swipe-name">{p.name}</strong>
              <span className="swipe-role">{p.domain}</span>
            </div>
          ),
        )
        .reverse()}
      <span className="swipe-counter mono-label">
        {mastered} concept{mastered === 1 ? '' : 's'} mastered · drag to evaluate
      </span>
    </div>
  )
}
