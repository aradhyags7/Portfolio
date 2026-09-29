import { lazy, Suspense, useEffect, useRef } from 'react'
import { initSmoothScroll, destroySmoothScroll } from './lib/smoothScroll'
import { usePrefersReducedMotion } from './lib/hooks'
import SoundFX from './audio/SoundFX'
import CommandPalette from './components/CommandPalette'
import Cursor from './components/Cursor'
import EasterEggs from './components/EasterEggs'
import Nav from './components/Nav'
import SectionSpy from './components/SectionSpy'
import Preloader from './sections/Preloader'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import ProjectCase from './sections/ProjectCase'
import Experience from './sections/Experience'
import Dashboard from './sections/Dashboard'
import Journey from './sections/Journey'
import Contact from './sections/Contact'
import { useApp } from './store'

const SceneRoot = lazy(() => import('./three/SceneRoot'))
const MascotView = lazy(() => import('./three/MascotView'))

export default function App() {
  const reduced = usePrefersReducedMotion()
  const entered = useApp((s) => s.entered)
  const appRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initSmoothScroll(reduced)
    return () => destroySmoothScroll()
  }, [reduced])

  return (
    <div className={`app ${entered ? 'is-entered' : ''}`} ref={appRef}>
      <SoundFX />
      <Cursor />
      <SectionSpy />
      <EasterEggs />
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Dashboard />
        <Journey />
        <Contact />
      </main>
      <ProjectCase />
      <CommandPalette />

      {!reduced && (
        <Suspense fallback={null}>
          <div className="mascot-layer" aria-hidden="true">
            <MascotView />
          </div>
          <SceneRoot eventSource={appRef} />
        </Suspense>
      )}

      <div className="grain" aria-hidden="true" />
    </div>
  )
}
