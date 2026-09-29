import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useIsTouch = () => useMediaQuery('(pointer: coarse)')

/** `?motion=full` forces the full experience, `?motion=reduced` forces the calm one */
function motionOverride(): boolean | null {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('motion')
  if (v === 'full') return false
  if (v === 'reduced') return true
  return null
}

export const usePrefersReducedMotion = () => {
  const system = useMediaQuery('(prefers-reduced-motion: reduce)')
  return motionOverride() ?? system
}
