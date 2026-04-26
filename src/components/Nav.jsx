import { useState, useEffect } from 'react'

const NAV_SECTIONS = ['hero', 'work', 'skills', 'about', 'contact']

const navLinks = [
  { href: '#work',    label: 'Work'    },
  { href: '#skills',  label: 'Skills'  },
  { href: '#about',   label: 'About'   },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false)
  const [onHero,    setOnHero]    = useState(true)
  const [activeId,  setActiveId]  = useState('hero')
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const obs = new IntersectionObserver(
      ([entry]) => setOnHero(entry.isIntersecting),
      { threshold: 0.15 }
    )
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const observers = []
    const visibleMap = {}
    NAV_SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(([entry]) => {
        visibleMap[id] = entry.isIntersecting ? entry.intersectionRatio : 0
        const best = Object.entries(visibleMap).sort((a, b) => b[1] - a[1])[0]
        if (best && best[1] > 0) setActiveId(best[0])
      }, { threshold: [0, 0.1, 0.3, 0.5, 0.7, 1] })
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (!el) return
    window.__navScrollActive = true
    el.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => { window.__navScrollActive = false }, 1200)
    setMenuOpen(false)
  }

  const navCls = [
    'fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-14 z-[200]',
    'border-b border-transparent transition-[background,border-color] duration-[350ms]',
    'max-md:px-5',
    scrolled && !onHero && 'bg-bg/[0.88] backdrop-blur-md border-black/[0.06]',
    scrolled && onHero  && 'bg-[rgba(18,32,46,0.55)] backdrop-blur-xl border-white/[0.08]',
  ].filter(Boolean).join(' ')

  const nameCls = [
    'font-display font-bold text-[17px] tracking-[-0.02em] transition-colors duration-[350ms]',
    onHero ? 'text-white/95' : 'text-text',
  ].join(' ')

  const linkBaseCls = [
    'text-[14px] tracking-[0.03em] no-underline transition-colors duration-[350ms] relative',
    onHero ? 'text-white/65 hover:text-white' : 'text-muted hover:text-accent',
  ].join(' ')

  return (
    <>
      <nav id="nav" className={navCls}>
        <div className={nameCls}>Yuchen Wang</div>

        {/* Desktop links */}
        <ul className="flex gap-9 list-none max-md:hidden">
          {navLinks.map(({ href, label }) => {
            const id = href.slice(1)
            const isActive = activeId === id
            return (
              <li key={href}>
                <a
                  href={href}
                  className={linkBaseCls}
                  style={isActive ? {
                    color: onHero ? '#fff' : 'var(--color-accent)',
                    fontWeight: 500,
                  } : undefined}
                  onClick={(e) => handleNavClick(e, href)}
                >
                  {label}
                  {isActive && (
                    <span style={{
                      position: 'absolute', bottom: '-3px', left: 0, right: 0,
                      height: '1.5px',
                      background: onHero ? 'rgba(255,255,255,0.6)' : 'var(--color-accent)',
                      borderRadius: '2px',
                      animation: 'navUnderlineIn .25s ease forwards',
                    }} />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Hamburger — mobile only */}
        <button
          className={`nav-hamburger md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 bg-transparent border-0 cursor-pointer p-1.5 z-[300] transition-colors duration-[350ms] ${onHero ? 'text-white/90' : 'text-text'} ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-[250] bg-[rgba(12,22,36,0.97)] backdrop-blur-2xl transition-opacity duration-[350ms] hidden max-md:block ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      >
        <nav
          className="flex flex-col justify-center h-full px-10 pt-20 pb-16 gap-15"
        >
          {navLinks.map(({ href, label }, i) => {
            const isActive = activeId === href.slice(1)
            return (
            <a
              key={href}
              href={href}
              className="flex items-baseline gap-4 font-display text-[clamp(36px,10vw,54px)] font-black no-underline tracking-[-0.03em] leading-[1.1] transition-[color,opacity,transform] duration-[450ms]"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'none' : 'translateY(24px)',
                transitionDelay: menuOpen ? (0.06 + i * 0.07) + 's' : '0s',
                transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                color: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.85)',
              }}
              onClick={(e) => handleNavClick(e, href)}
            >
              <span className="font-body text-[12px] font-normal tracking-[0.08em] text-accent2 opacity-70">
                0{i + 1}
              </span>
              {label}
            </a>
            )
          })}
        </nav>
      </div>
    </>
  )
}
