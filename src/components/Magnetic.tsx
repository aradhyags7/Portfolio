import { useRef, type PointerEvent, type ReactNode } from 'react'
import { gsap } from '../lib/gsap'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

/** Wraps a control so it leans toward the cursor and springs back. */
export default function Magnetic({ children, strength = 0.32, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const xTo = useRef<((v: number) => void) | null>(null)
  const yTo = useRef<((v: number) => void) | null>(null)

  const ensure = () => {
    const el = ref.current
    if (!el) return false
    if (!xTo.current) {
      xTo.current = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
      yTo.current = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    }
    return true
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ensure()) return
    const r = ref.current!.getBoundingClientRect()
    xTo.current!((e.clientX - (r.left + r.width / 2)) * strength)
    yTo.current!((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const onLeave = () => {
    if (!ensure()) return
    xTo.current!(0)
    yTo.current!(0)
  }

  return (
    <div className={`magnetic ${className ?? ''}`} ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  )
}
