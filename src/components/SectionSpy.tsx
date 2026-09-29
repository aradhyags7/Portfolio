import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { sections } from '../content/resume'
import { scrollState, bindActivityListeners } from '../lib/scrollState'
import { useApp } from '../store'

/** Watches sections to drive nav highlight + the bot's travel; feeds hero fade progress. */
export default function SectionSpy() {
  const setSection = useApp((s) => s.setSection)

  useEffect(() => {
    bindActivityListeners()

    const triggers = sections.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) setSection(id)
        },
      }),
    )

    const heroFade = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollState.heroProgress = self.progress
      },
    })

    return () => {
      triggers.forEach((t) => t.kill())
      heroFade.kill()
    }
  }, [setSection])

  return null
}
