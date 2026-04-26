import { useState, useEffect } from 'react'
import Cursor  from './components/Cursor'
import Nav     from './components/Nav'
import Hero    from './components/Hero'
import Work    from './components/Work'
import Skills  from './components/Skills'
import About   from './components/About'
import Contact from './components/Contact'
import Tweaks  from './components/Tweaks'

const TWEAK_DEFAULTS = { variant: 'A', accentColor: '#2e7d8f', heroSize: 86 }

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

export default function App() {
  const [tweaks,     setTweaks]     = useState({ ...TWEAK_DEFAULTS })
  const [tweaksOpen, setTweaksOpen] = useState(false)

  useScrollbarSection()

  useEffect(() => {
    document.documentElement.setAttribute('data-variant',   tweaks.variant)
    document.documentElement.setAttribute('data-card-mode', 'lift')
    document.documentElement.style.setProperty('--color-accent', tweaks.accentColor)
  }, [tweaks.variant, tweaks.accentColor])

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksOpen(true)
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false)
    }
    window.addEventListener('message', handler)
    window.parent.postMessage({ type: '__edit_mode_available' }, '*')
    return () => window.removeEventListener('message', handler)
  }, [])

  function updateTweak(key, value) {
    setTweaks(prev => {
      const next = { ...prev, [key]: value }
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*')
      return next
    })
  }

  return (
    <>
      <Cursor />
      <Nav />
      <Hero heroSize={tweaks.heroSize} />
      <Work />
      <Skills />
      <About />
      <Contact />
      <footer className="text-center py-7 text-xs text-muted border-t border-black/6">
        © 2026 Yuchen Wang · Turning ideas into real-world apps
      </footer>
      <Tweaks tweaks={tweaks} updateTweak={updateTweak} visible={tweaksOpen} />
    </>
  )
}
