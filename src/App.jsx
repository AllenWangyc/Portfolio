import { useState, useEffect, lazy, Suspense } from 'react'
import Cursor  from './components/Cursor'
import Nav     from './components/Nav'
import Hero    from './components/Hero'
import Work    from './components/Work'
import Skills  from './components/Skills'
import About   from './components/About'
import Contact from './components/Contact'

// The Tweaks panel is a dev-only tool for live-editing from an iframe host.
// `import.meta.env.DEV` is statically false in production builds, so it is tree-shaken out.
const Tweaks = import.meta.env.DEV ? lazy(() => import('./components/Tweaks')) : null

const TWEAK_DEFAULTS = { accentColor: '#2e7d8f', heroSize: 86 }

function useScrollbarSection() {
  useEffect(() => {
    const root = document.documentElement
    const hero = document.getElementById('hero')
    if (!hero) return
    root.setAttribute('data-in-hero', 'true')
    const obs = new IntersectionObserver(([entry]) => {
      root.setAttribute('data-in-hero', entry.isIntersecting ? 'true' : 'false')
    }, { threshold: 0.15 })
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])
}

function useDevTweaks() {
  const [tweaks,     setTweaks]     = useState(TWEAK_DEFAULTS)
  const [tweaksOpen, setTweaksOpen] = useState(false)

  useEffect(() => {
    if (!import.meta.env.DEV) return
    document.documentElement.style.setProperty('--color-accent', tweaks.accentColor)
  }, [tweaks.accentColor])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksOpen(true)
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false)
    }
    window.addEventListener('message', handler)
    window.parent.postMessage({ type: '__edit_mode_available' }, '*')
    return () => window.removeEventListener('message', handler)
  }, [])

  function updateTweak(key, value) {
    if (!import.meta.env.DEV) return
    setTweaks(prev => {
      const next = { ...prev, [key]: value }
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*')
      return next
    })
  }

  return { tweaks, tweaksOpen, updateTweak }
}

export default function App() {
  const { tweaks, tweaksOpen, updateTweak } = useDevTweaks()
  useScrollbarSection()

  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero heroSize={tweaks.heroSize} />
        <Work />
        <Skills />
        <About />
        <Contact />
      </main>
      <footer className="border-t border-black/6 px-6 md:px-10 lg:px-14 pt-7 pb-[calc(1.75rem+env(safe-area-inset-bottom))] text-xs text-muted">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Yuchen Wang</span>
          <a href="#hero" className="text-muted no-underline transition-colors hover:text-accent">
            Back to top ↑
          </a>
        </div>
      </footer>
      {Tweaks && (
        <Suspense fallback={null}>
          <Tweaks tweaks={tweaks} updateTweak={updateTweak} visible={tweaksOpen} />
        </Suspense>
      )}
    </>
  )
}
