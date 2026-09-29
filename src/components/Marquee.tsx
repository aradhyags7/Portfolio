import type { ReactNode } from 'react'
import './Marquee.css'

interface MarqueeProps {
  children: ReactNode
  /** seconds per loop */
  speed?: number
  className?: string
}

export default function Marquee({ children, speed = 26, className }: MarqueeProps) {
  return (
    <div className={`marquee ${className ?? ''}`} style={{ ['--marquee-dur' as string]: `${speed}s` }}>
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
