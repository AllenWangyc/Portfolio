import { useState, useEffect, useRef } from 'react'
import { prefersReducedMotion } from './hooks'

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
  const firstMenuLink = useRef(null)
  const menuButton    = useRef(null)

  // Lock page scroll, close on Esc, and manage focus while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    firstMenuLink.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
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
    const visibleMap = {}
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { visibleMap[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0 })
      const best = Object.entries(visibleMap).sort((a, b) => b[1] - a[1])[0]
      if (best && best[1] > 0) setActiveId(best[0])
    }, { threshold: [0, 0.1, 0.3, 0.5, 0.7, 1] })
    NAV_SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const handleNavClick = (e, href) => {
    const el = document.querySelector(href)
    if (!el) return
    e.preventDefault()
    setMenuOpen(false)
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    history.replaceState(null, '', href)
  }

  const navCls = [
    'fixed top-0 left-0 right-0 z-[200] flex items-center justify-between',
    'h-[calc(4rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]',
    'pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:px-10 lg:px-14',
    'border-b border-transparent transition-[background,border-color] duration-[350ms]',
    scrolled && !onHero && !menuOpen && 'bg-bg/[0.88] backdrop-blur-md border-black/[0.06]',
    scrolled && onHero  && !menuOpen && 'bg-[rgba(18,32,46,0.55)] backdrop-blur-xl border-white/[0.08]',
  ].filter(Boolean).join(' ')

  const light = onHero || menuOpen

  const linkBaseCls = [
    'text-[14px] tracking-[0.03em] no-underline transition-colors duration-[350ms] relative',
    onHero ? 'text-white/65 hover:text-white' : 'text-muted hover:text-accent',
  ].join(' ')

  return (
    <>
      <nav id="nav" className={navCls} aria-label="Primary">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className={`font-display font-bold text-[17px] tracking-[-0.02em] no-underline transition-colors duration-[350ms] ${light ? 'text-white/95' : 'text-text'}`}
        >
          Yuchen Wang
        </a>

        {/* Desktop links */}
        <ul className="flex gap-9 list-none max-md:hidden">
          {navLinks.map(({ href, label }) => {
            const isActive = activeId === href.slice(1)
            return (
              <li key={href}>
                <a
                  href={href}
                  aria-current={isActive ? 'location' : undefined}
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

        {/* Hamburger — mobile only. Sits above the overlay (nav z-200 > overlay z-[190]). */}
        <button
          ref={menuButton}
          type="button"
          className={`nav-hamburger md:hidden flex flex-col justify-center gap-[5px] w-11 h-11 -mr-1.5 bg-transparent border-0 cursor-pointer p-2 transition-colors duration-[350ms] ${light ? 'text-white/90' : 'text-text'} ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : ''}
        className={`fixed inset-0 z-[190] bg-[rgba(12,22,36,0.97)] backdrop-blur-2xl transition-opacity duration-[350ms] md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      >
        <nav className="flex flex-col justify-center h-full px-10 pt-20 pb-16 gap-[clamp(20px,6vh,60px)]">
          {navLinks.map(({ href, label }, i) => {
            const isActive = activeId === href.slice(1)
            return (
              <a
                key={href}
                ref={i === 0 ? firstMenuLink : undefined}
                href={href}
                className="flex items-baseline gap-4 font-display text-[clamp(32px,10vw,54px)] font-black no-underline tracking-[-0.03em] leading-[1.1] transition-[color,opacity,transform] duration-[450ms]"
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'none' : 'translateY(24px)',
                  transitionDelay: menuOpen ? (0.06 + i * 0.07) + 's' : '0s',
                  transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                  color: isActive ? 'var(--color-accent2)' : 'rgba(255,255,255,0.85)',
                }}
                onClick={(e) => { e.stopPropagation(); handleNavClick(e, href) }}
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
