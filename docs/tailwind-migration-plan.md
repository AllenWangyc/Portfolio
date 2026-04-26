# Plan: Migrate Portfolio 2.0 to TailwindCSS v4

## Status

**Phase 1 is COMPLETE.** Phases 2–4 remain.

### Completed
- [x] `npm install -D tailwindcss @tailwindcss/vite`
- [x] `vite.config.js` — added `tailwindcss()` plugin
- [x] `src/index.css` — fully rewritten (80 lines: `@theme`, variant B overrides, `@custom-variant variant-b`, `@layer base`, cursor, `.rev`, keyframes)
- [x] `src/App.jsx` — changed `setProperty('--accent', ...)` → `setProperty('--color-accent', ...)`
- [x] `src/components/Hero.jsx` — changed `getPropertyValue('--accent')` → `getPropertyValue('--color-accent')`
- [x] `src/components/Tweaks.jsx` — changed `var(--accent)` → `var(--color-accent)`

**Build not yet verified** — run `npm run build` first to confirm parity before migrating components.

---

## Context

The `CLAUDE.md` for this project mandates TailwindCSS for all styling, but TailwindCSS was not installed and the entire codebase used hand-written CSS in `src/index.css` (215 lines). This plan migrates all component-level styles to Tailwind utility classes, moves the theme system into Tailwind v4's `@theme {}` block, and strips `index.css` down to ~80 lines (keyframes, scroll-reveal, cursor shape, base body styles only).

**Approach:** Config-first (done), then component-by-component in order of complexity (simple → complex).

---

## Architecture Decisions (locked in)

- **TailwindCSS v4** via `@tailwindcss/vite` (no `tailwind.config.js` needed)
- **Theming:** CSS variables in `@theme {}` — variant B overrides cascade automatically
- **`--color-accent`** is set dynamically by App.jsx and read by Hero.jsx canvas
- **Legacy class names kept** alongside Tailwind classes for Cursor.jsx targeting:
  - `.wcard` (WorkCard) — Cursor.jsx line 41
  - `.htag` (Hero tags) — Cursor.jsx line 41
  - `.mq-tag` (Skills marquee) — Cursor.jsx line 41
  - `.tp-btn` (Tweaks buttons) — Cursor.jsx line 41
  - `.tp-c` (Tweaks color circles) — Cursor.jsx line 41
- **Footer** is inline `<footer>` in `src/App.jsx:49` — no separate component
- **Nav.jsx** already uses React state (`scrolled`, `onHero`) — no DOM classList changes needed

---

## Tailwind Class Reference

### Colors (from `@theme`)
| CSS class | Color |
|-----------|-------|
| `bg-bg` / `text-bg` | `#eef2f5` (page bg) |
| `bg-bg2` | `#dde6eb` (elevated bg) |
| `text-text` | `#1c2530` (body text) |
| `text-muted` | `#5a7280` (muted text) |
| `bg-accent` / `text-accent` / `border-accent` | `#2e7d8f` (teal) |
| `text-accent2` | `#6fa8b8` (lighter teal) |
| `bg-card` | `#f5f8fa` (card bg) |

### Other theme utilities
| Class | Value |
|-------|-------|
| `font-display` | Playfair Display (or Syne in variant B) |
| `font-body` | DM Sans |
| `rounded-card` | 16px (or 4px in variant B) |
| `variant-b:*` | Applies only when `data-variant="B"` on `<html>` |

### Shared section shell (replaces `.sec` everywhere)
```jsx
<section className="max-w-[1240px] mx-auto px-14 py-32">
```

### Shared section header (replaces `.sec-head`)
```jsx
<div className="flex items-baseline gap-5 mb-[72px]">
  <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-accent whitespace-nowrap">01 — Label</span>
  <h2 className="font-display text-[clamp(32px,5vw,60px)] font-black tracking-tight leading-none">
    Title <em className="italic text-accent">Italic</em>
  </h2>
  <div className="flex-1 h-px bg-black/9"></div>
</div>
```

---

## Remaining Implementation Steps

### Step 0: Verify build
```powershell
npm run build
```
Should succeed with no errors. If it fails, fix before proceeding.

### Step 1: Migrate Footer (in `src/App.jsx:49`)

Current:
```jsx
<footer>© 2026 Yuchen Wang · Turning ideas into real-world apps</footer>
```

New:
```jsx
<footer className="text-center py-7 text-xs text-muted border-t border-black/6">
  © 2026 Yuchen Wang · Turning ideas into real-world apps
</footer>
```

### Step 2: Migrate `src/components/Contact.jsx`

New file:
```jsx
import { useReveal } from './hooks'

const SOCIALS = [
  {
    label: 'GitHub', href: 'https://github.com/yuchenwang',
    icon: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://linkedin.com/in/yuchenwang',
    icon: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    label: 'Email', href: 'mailto:a.wangyc@gmail.com',
    icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
]

export default function Contact() {
  const [ref, visible] = useReveal()

  return (
    <section id="contact" className="text-center py-32 px-14 bg-bg">
      <div ref={ref} className={`max-w-[720px] mx-auto rev${visible ? ' on' : ''}`}>
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-accent mb-6">04 — Contact</p>
        <h2 className="font-display text-[clamp(42px,6.5vw,86px)] font-black tracking-[-0.035em] leading-none mb-10">
          Have an <em className="italic text-accent">idea?</em><br />Let's build it.
        </h2>
        <a
          href="mailto:a.wangyc@gmail.com"
          className="text-[clamp(17px,2.2vw,22px)] font-light text-muted no-underline border-b border-black/15 pb-0.5 inline-block mb-[52px] transition-[color,border-color] duration-200 hover:text-accent hover:border-accent"
        >
          a.wangyc@gmail.com
        </a>
        <div className="flex gap-3 justify-center flex-wrap">
          {SOCIALS.map(({ label, href, icon }) => (
            <a
              key={label} href={href}
              className="ct-soc inline-flex items-center gap-2 px-6 py-[11px] border-[1.5px] border-black/10 rounded-full text-sm font-medium text-text no-underline transition-all duration-[220ms] hover:bg-accent hover:text-white hover:border-accent"
            >
              {icon}{label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Step 3: Migrate `src/components/About.jsx`

New file:
```jsx
import { useReveal } from './hooks'

const STATS = [
  { num: '3+',  label: 'Years of full-stack experience' },
  { num: '20+', label: 'Projects shipped to production' },
  { num: '8+',  label: 'Technologies mastered' },
  { num: '∞',   label: 'Lines of TypeScript written' },
]

export default function About() {
  const [textRef,  textVisible]  = useReveal()
  const [statsRef, statsVisible] = useReveal()

  return (
    <section id="about" className="bg-bg2 py-32">
      <div className="max-w-[1240px] mx-auto px-14">
        <div className="grid grid-cols-2 gap-20 items-center max-md:grid-cols-1 max-md:gap-10">

          <div ref={textRef} className={`rev${textVisible ? ' on' : ''}`}>
            <h2 className="font-display text-[clamp(28px,4vw,44px)] font-black tracking-[-0.03em] leading-[1.15] mb-6">
              Building with <em className="italic text-accent">purpose,</em><br />shipping with care.
            </h2>
            <p className="text-muted text-[15px] leading-[1.75] mb-4">
              I'm a full-stack developer who loves turning complex problems into clean, scalable solutions.
              I care deeply about code quality, developer experience, and the small details that make software feel great to use.
            </p>
            <p className="text-muted text-[15px] leading-[1.75]">
              When I'm not coding, I'm probably exploring new technologies, contributing to open source,
              or thinking about system architecture over a cup of tea.
            </p>
          </div>

          <div
            ref={statsRef}
            className={`grid grid-cols-2 gap-5 rev${statsVisible ? ' on' : ''}`}
            style={{ transitionDelay: '.15s' }}
          >
            {STATS.map(({ num, label }) => (
              <div key={label} className="bg-card rounded-card border border-black/6 p-7">
                <div className="font-display text-[clamp(36px,4vw,48px)] font-black text-accent tracking-[-0.03em] leading-none mb-1.5">{num}</div>
                <div className="text-[13px] text-muted">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
```

### Step 4: Migrate `src/components/Nav.jsx`

New file:
```jsx
import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [onHero,   setOnHero]   = useState(true)

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

  const navCls = [
    'fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-14 z-[200]',
    'border-b border-transparent transition-[background,border-color] duration-300',
    'max-md:px-6',
    scrolled && !onHero && 'bg-bg/[0.88] backdrop-blur-md border-black/[0.06]',
    scrolled && onHero  && 'bg-[rgba(18,32,46,0.55)] backdrop-blur-xl border-white/[0.08]',
  ].filter(Boolean).join(' ')

  const nameCls = [
    'font-display font-bold text-[17px] tracking-[-0.02em] transition-colors duration-300',
    onHero ? 'text-white/95' : 'text-text',
  ].join(' ')

  const linkBaseCls = [
    'text-[14px] tracking-[0.03em] no-underline transition-colors duration-300',
    onHero ? 'text-white/65 hover:text-white' : 'text-muted hover:text-accent',
  ].join(' ')

  return (
    <nav id="nav" className={navCls}>
      <div className={nameCls}>Yuchen Wang</div>
      <ul className="flex gap-9 list-none max-md:gap-5">
        <li><a href="#work"    className={linkBaseCls}>Work</a></li>
        <li><a href="#skills"  className={linkBaseCls}>Skills</a></li>
        <li><a href="#about"   className={linkBaseCls}>About</a></li>
        <li><a href="#contact" className={linkBaseCls}>Contact</a></li>
      </ul>
    </nav>
  )
}
```

### Step 5: Migrate `src/components/Work.jsx`

New file:
```jsx
import { useReveal } from './hooks'
import WorkCard from './WorkCard'

const PROJECTS = [
  {
    wide: true, c1: '#7c3aed', c2: '#a78bfa', label: 'CloudTask — project screenshot',
    tags: ['React', 'ASP.NET Core', 'AWS ECS', 'PostgreSQL'],
    title: 'CloudTask',
    desc: 'Full-stack project management platform with real-time collaboration, role-based access control, and automated CI/CD pipelines. Deployed on AWS ECS with zero-downtime blue/green deployment.',
    year: '2024', delay: 0,
  },
  {
    wide: false, c1: '#0ea5e9', c2: '#38bdf8', label: 'DevMetrics — project screenshot',
    tags: ['TypeScript', 'React', 'D3.js'],
    title: 'DevMetrics',
    desc: 'Developer productivity analytics dashboard with interactive visualisations, custom date ranges, and team-level velocity insights.',
    year: '2024', delay: 0.1,
  },
  {
    wide: false, c1: '#e8936a', c2: '#f97316', label: 'ShopAPI — project screenshot',
    tags: ['ASP.NET Core', 'PostgreSQL', 'Docker'],
    title: 'ShopAPI',
    desc: 'High-performance e-commerce REST API handling 50k+ daily requests with JWT auth, Redis caching, and comprehensive OpenAPI documentation.',
    year: '2023', delay: 0.2,
  },
  {
    wide: false, c1: '#10b981', c2: '#34d399', label: 'WeatherNow — project screenshot',
    tags: ['React', 'TypeScript', 'AWS Lambda'],
    title: 'WeatherNow',
    desc: 'Real-time weather app with geolocation, 7-day animated forecasts, and a serverless backend on AWS Lambda + API Gateway.',
    year: '2023', delay: 0.1,
  },
]

export default function Work() {
  const [ref, visible] = useReveal()
  return (
    <section className="max-w-[1240px] mx-auto px-14 py-32 max-md:px-6 max-md:py-20" id="work">
      <div ref={ref} className={`flex items-baseline gap-5 mb-[72px] rev${visible ? ' on' : ''}`}>
        <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-accent whitespace-nowrap">01 — Work</span>
        <h2 className="font-display text-[clamp(32px,5vw,60px)] font-black tracking-tight leading-none">
          Selected <em className="italic text-accent">Projects</em>
        </h2>
        <div className="flex-1 h-px bg-black/9"></div>
      </div>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {PROJECTS.map((p, i) => <WorkCard key={i} {...p} />)}
      </div>
    </section>
  )
}
```

### Step 6: Migrate `src/components/WorkCard.jsx`

New file:
```jsx
import { useRef, useEffect } from 'react'
import { useReveal, makeTiltHandlers } from './hooks'

function CardCanvas({ c1, c2, label }) {
  const ref = useRef(null)

  useEffect(() => {
    function draw() {
      const c = ref.current
      if (!c) return
      const pw = c.parentElement.clientWidth  || 700
      const ph = c.parentElement.clientHeight || 300
      c.width  = pw * 2
      c.height = ph * 2
      const cx = c.getContext('2d')
      cx.fillStyle = c1 + '12'
      cx.fillRect(0, 0, c.width, c.height)
      cx.save()
      cx.strokeStyle = c2 + '28'
      cx.lineWidth = 2.5
      for (let i = -c.height; i < c.width + c.height; i += 32) {
        cx.beginPath(); cx.moveTo(i, 0); cx.lineTo(i + c.height, c.height); cx.stroke()
      }
      cx.restore()
      cx.fillStyle = c2 + '35'
      const fs = Math.round(c.height * .068)
      cx.font = `500 ${fs}px 'DM Sans', monospace`
      cx.textAlign = 'center'
      cx.textBaseline = 'middle'
      cx.fillText(label, c.width / 2, c.height / 2)
    }
    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [c1, c2, label])

  return <canvas ref={ref} className="w-full h-full block"></canvas>
}

export default function WorkCard({ wide, c1, c2, label, tags, title, desc, year, delay }) {
  const [ref, visible] = useReveal()
  const tilt = makeTiltHandlers(7)

  return (
    <div
      ref={ref}
      className={`wcard group bg-card rounded-card overflow-hidden border border-black/6 cursor-none [transform-style:preserve-3d] transition-shadow duration-300 hover:shadow-[0_28px_60px_rgba(0,0,0,0.11)]${wide ? ' col-span-full' : ''} rev${visible ? ' on' : ''}`}
      style={{ transitionDelay: delay + 's' }}
      {...tilt}
    >
      <div className={`relative w-full bg-bg2 overflow-hidden ${wide ? 'aspect-[21/9]' : 'aspect-video'}`}>
        <CardCanvas c1={c1} c2={c2} label={label} />
        <div className="wcard-over absolute inset-0 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-[0.88] flex items-center justify-center text-white text-sm font-medium tracking-[0.06em]">
          View Project →
        </div>
      </div>
      <div className="p-7 pb-5">
        <div className="flex gap-[7px] flex-wrap mb-3">
          {tags.map(t => (
            <span key={t} className="wcard-tag text-[11px] font-medium tracking-[0.05em] uppercase text-accent bg-accent/10 px-2.5 py-[3px] rounded-full">
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-display text-[clamp(20px,2.2vw,26px)] font-bold tracking-[-0.02em] leading-snug mb-2.5">{title}</h3>
        <p className="text-sm text-muted leading-[1.65]">{desc}</p>
      </div>
      <div className="px-7 py-3.5 border-t border-black/5 flex items-center justify-between">
        <span className="text-xs text-muted">{year}</span>
        <a href="#" className="wcard-link text-[13px] font-medium text-accent no-underline flex items-center gap-[5px] transition-[gap] duration-200 hover:gap-2.5">
          GitHub <span>→</span>
        </a>
      </div>
    </div>
  )
}
```

### Step 7: Migrate `src/components/Tweaks.jsx`

New file:
```jsx
const ACCENT_COLORS = [
  { color: '#2e7d8f', label: 'Teal Blue'    },
  { color: '#3a6ea8', label: 'Steel Blue'   },
  { color: '#4a7a6a', label: 'Sage Green'   },
  { color: '#7a6aaa', label: 'Muted Purple' },
  { color: '#8a6a5a', label: 'Warm Clay'    },
]

export default function Tweaks({ tweaks, updateTweak, visible }) {
  return (
    <div
      id="tp"
      className={`${visible ? 'block' : 'hidden'} fixed bottom-6 right-6 bg-white border border-black/10 rounded-[20px] px-[22px] py-6 z-[1000] min-w-[250px] shadow-[0_12px_48px_rgba(0,0,0,0.12)] font-body`}
    >
      <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#71717a] mb-5">Tweaks</div>

      <div className="mb-[18px]">
        <span className="text-[13px] font-medium mb-2.5 block text-[#18181b]">Style Variant</span>
        <div className="flex gap-2">
          {[{ v: 'A', label: 'Editorial' }, { v: 'B', label: 'Geometric' }].map(({ v, label }) => (
            <button
              key={v}
              className={`tp-btn flex-1 py-2 px-1.5 border-[1.5px] rounded-lg text-xs font-medium cursor-pointer transition-all duration-[180ms] ${
                tweaks.variant === v
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-[#18181b] border-black/10'
              }`}
              onClick={() => updateTweak('variant', v)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-[18px]">
        <span className="text-[13px] font-medium mb-2.5 block text-[#18181b]">Accent Color</span>
        <div className="flex gap-2">
          {ACCENT_COLORS.map(({ color, label }) => (
            <div
              key={color}
              className={`tp-c w-[26px] h-[26px] rounded-full border-[2.5px] cursor-pointer transition-[transform,border-color] duration-[180ms] hover:scale-110 ${
                tweaks.accentColor === color ? 'border-[#1a1510]' : 'border-transparent'
              }`}
              style={{ background: color }}
              title={label}
              onClick={() => updateTweak('accentColor', color)}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="text-[13px] font-medium mb-2.5 block text-[#18181b]">Hero Text Size</span>
        <input
          type="range" min="60" max="130"
          value={tweaks.heroSize}
          style={{ width: '100%', accentColor: 'var(--color-accent)' }}
          onChange={e => updateTweak('heroSize', +e.target.value)}
        />
      </div>
    </div>
  )
}
```

### Step 8: Migrate `src/components/Skills.jsx`

New file:
```jsx
import { useReveal } from './hooks'

const MARQUEE_ROW1 = ['React', 'TypeScript', 'Next.js', 'HTML / CSS', 'ASP.NET Core', 'Node.js', 'PostgreSQL', 'GraphQL', 'REST API', 'Docker', 'AWS', 'Git', 'CI / CD', 'Redis']
const MARQUEE_ROW2 = ['Tailwind CSS', 'AWS Lambda', 'ECS', 'S3', 'Vite', 'Jest', 'Swagger', 'Entity Framework', 'Zustand', 'React Query', 'GitHub Actions', 'Linux', 'Nginx']

const SK_CATS = [
  {
    num: '01', title: 'Frontend',
    skills: ['React & Next.js', 'TypeScript', 'HTML / CSS / Tailwind', 'Zustand · React Query', 'Vite · Jest'],
  },
  {
    num: '02', title: 'Backend',
    skills: ['ASP.NET Core', 'Node.js', 'REST API · GraphQL', 'PostgreSQL · Redis', 'Entity Framework'],
  },
  {
    num: '03', title: 'Cloud / DevOps',
    skills: ['AWS (ECS · Lambda · S3)', 'Docker', 'GitHub Actions · CI/CD', 'Linux · Nginx', 'Git'],
  },
]

function MarqueeRow({ tags, reverse }) {
  const doubled = [...tags, ...tags]
  return (
    <div
      className={`flex gap-3 w-max mb-3 ${
        reverse
          ? '[animation:mq2_22s_linear_infinite]'
          : '[animation:mq1_28s_linear_infinite]'
      }`}
    >
      {doubled.map((tag, i) => (
        <span
          key={i}
          className={`mq-tag px-[22px] py-[9px] rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 cursor-none ${
            i === 0 || i === tags.length
              ? 'bg-accent text-white border border-accent'
              : 'bg-card border border-black/7 text-text hover:bg-accent hover:text-white hover:border-accent'
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

function SkCat({ num, title, skills, delay }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`sk-cat relative p-10 px-9 border border-black/7 overflow-hidden transition-[background] duration-[250ms] hover:bg-bg2 rev${visible ? ' on' : ''}`}
      style={{ transitionDelay: delay + 's' }}
    >
      <div className="font-display text-[72px] font-black text-accent opacity-[0.08] absolute top-4 right-6 leading-none tracking-[-0.04em] pointer-events-none select-none">
        {num}
      </div>
      <div className="font-display text-[20px] font-bold tracking-[-0.02em] mb-6">{title}</div>
      <div className="flex flex-col gap-2.5">
        {skills.map(s => (
          <div key={s} className="flex items-center gap-2.5 text-sm text-text">
            <div className="w-[5px] h-[5px] rounded-full bg-accent flex-shrink-0 opacity-60"></div>
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const [ref, visible] = useReveal()
  return (
    <section id="skills" className="bg-bg overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-14 pb-16 max-md:px-6">
        <div ref={ref} className={`flex items-baseline gap-5 pt-32 mb-[72px] rev${visible ? ' on' : ''}`}>
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-accent whitespace-nowrap">02 — Skills</span>
          <h2 className="font-display text-[clamp(32px,5vw,60px)] font-black tracking-tight leading-none">
            Tech <em className="italic text-accent">Stack</em>
          </h2>
          <div className="flex-1 h-px bg-black/9"></div>
        </div>
      </div>

      <div className="relative mb-14">
        <div className="absolute top-0 bottom-0 left-0 w-[120px] bg-gradient-to-r from-bg to-transparent z-[2] pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-[120px] bg-gradient-to-l from-bg to-transparent z-[2] pointer-events-none"></div>
        <MarqueeRow tags={MARQUEE_ROW1} reverse={false} />
        <MarqueeRow tags={MARQUEE_ROW2} reverse={true} />
      </div>

      <div className="max-w-[1240px] mx-auto px-14 max-md:px-6">
        <div className="grid grid-cols-3 gap-[2px] rounded-card overflow-hidden max-md:grid-cols-1">
          {SK_CATS.map((cat, i) => (
            <SkCat key={cat.num} {...cat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Step 9: Migrate `src/components/Hero.jsx`

New file:
```jsx
import { useRef, useEffect } from 'react'
import { useHeroSnap } from './hooks'

export default function Hero({ heroSize }) {
  useHeroSnap()
  const canvasRef = useRef(null)
  const mouseRef  = useRef({ x: -1e4, y: -1e4 })

  useEffect(() => {
    const cv = canvasRef.current
    const cx = cv.getContext('2d')
    let W, H, pts = [], raf

    function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    function hexRgb(hex) {
      hex = hex.trim().replace('#', '')
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
      return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)]
    }
    function getAccent() {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#2e7d8f'
    }

    for (let i = 0; i < 90; i++) {
      pts.push({
        x: Math.random() * 1920, y: Math.random() * 1080,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.8 + .5,    o: Math.random() * .35 + .08,
      })
    }

    function frame() {
      cx.clearRect(0, 0, W, H)
      const { x: mx, y: my } = mouseRef.current
      const [r, g, b] = hexRgb(getAccent())

      pts.forEach(p => {
        const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx*dx + dy*dy)
        if (d < 130) { p.x += dx/d * 1.8; p.y += dy/d * 1.8 }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      })

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx*dx + dy*dy)
          if (d < 110) {
            cx.beginPath()
            cx.moveTo(pts[i].x, pts[i].y)
            cx.lineTo(pts[j].x, pts[j].y)
            cx.strokeStyle = `rgba(${r},${g},${b},${.07 * (1 - d/110)})`
            cx.lineWidth = .6
            cx.stroke()
          }
        }
      }

      pts.forEach(p => {
        cx.beginPath()
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        cx.fillStyle = `rgba(${r},${g},${b},${p.o})`
        cx.fill()
      })

      raf = requestAnimationFrame(frame)
    }
    frame()

    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  const heroLines = [
    [{ t: 'Turning ', em: false }, { t: 'ideas', em: true }, { t: ' into', em: false }],
    [{ t: 'real-world ', em: false }, { t: 'apps', em: true }],
  ]
  let delay = 0.3

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-start text-left overflow-hidden"
      style={{ padding: '100px clamp(48px,8vw,120px) 80px' }}
    >
      {/* Background image with zoom animation */}
      <div className="absolute inset-0 z-0 bg-[url('/uploads/bg_image.jpg')] bg-center bg-cover scale-[1.03] [animation:heroZoom_18s_ease-in-out_infinite_alternate]"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[rgba(18,32,46,0.55)] via-[rgba(18,32,46,0.40)] to-[rgba(18,32,46,0.18)] variant-b:from-[rgba(18,32,46,0.58)] variant-b:via-[rgba(18,32,46,0.42)]"></div>

      {/* Variant B dot-grid overlay */}
      <div className="hidden variant-b:block absolute inset-0 z-[3] [background-image:radial-gradient(circle,rgba(46,125,143,0.06)_1px,transparent_1px)] [background-size:30px_30px] pointer-events-none"></div>

      {/* Particle canvas */}
      <canvas id="pcanvas" ref={canvasRef} className="absolute inset-0 z-[2] opacity-35"></canvas>

      {/* Hero content */}
      <div className="hero-inner relative z-[4]" style={{ maxWidth: '520px' }}>
        <p className="hero-eyebrow text-[12px] font-medium tracking-[0.14em] uppercase text-accent2 mb-7 opacity-0 translate-y-4 [animation:fup_0.6s_0.15s_forwards]">
          Full Stack Developer
        </p>

        <h1 className="font-display font-black leading-none tracking-[-0.035em] mb-9 text-white" style={{ fontSize: heroSize + 'px' }}>
          {heroLines.map((line, li) => (
            <div key={li}>
              {line.map(({ t, em }, wi) => {
                const d = delay
                delay += 0.11
                return (
                  <span key={wi} className="hw inline-block opacity-0 translate-y-12 [animation:fup_0.75s_forwards]" style={{ animationDelay: d + 's' }}>
                    {em ? <em className="italic text-accent2">{t}</em> : t}
                  </span>
                )
              })}
            </div>
          ))}
        </h1>

        <p className="hero-sub text-[clamp(15px,1.8vw,19px)] text-white/72 font-light max-w-[480px] mb-10 opacity-0 translate-y-4 [animation:fup_0.6s_0.9s_forwards]">
          Building scalable, production-ready applications — from thoughtful UI to robust backend architecture.
          Currently working with React, TypeScript, ASP.NET Core &amp; AWS.
        </p>

        <div className="hero-tags flex gap-2.5 flex-wrap opacity-0 translate-y-4 [animation:fup_0.6s_1.05s_forwards]">
          {['React', 'TypeScript', 'ASP.NET Core', 'AWS'].map(tag => (
            <span
              key={tag}
              className="htag bg-white/[0.12] border border-white/[0.18] px-[18px] py-1.5 rounded-full text-[13px] font-medium text-white/88 whitespace-nowrap transition-all duration-200 backdrop-blur-sm hover:bg-accent hover:text-white hover:border-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint absolute bottom-11 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[4] opacity-0 [animation:fup_0.6s_1.5s_forwards]">
        <span className="text-[10px] tracking-[0.12em] uppercase text-white/50">Scroll</span>
        <div className="w-px h-[52px] bg-gradient-to-b from-accent2 to-transparent [animation:spulse_1.8s_ease-in-out_infinite]"></div>
      </div>
    </section>
  )
}
```

### Step 10: Final cleanup

After all components are migrated:

1. Verify `src/index.css` has no orphaned rules beyond the ~80-line foundation
2. Run grep check:
   ```powershell
   Select-String -Path "src\components\*.jsx","src\App.jsx" -Pattern "className=.*\b(sec|wcard-body|wcard-foot|sk-cats|ct-inner|ct-label|ct-title|ct-email|ct-socials|about-inner|about-text|about-stats|stat-box|stat-num|stat-label|sec-head|sec-label|sec-title|sec-rule|nav-name|nav-links|marquee-wrap|marquee-row)\b"
   ```
   Should return zero matches.
3. Run `npm run build` — must succeed with no errors
4. Run `npm run dev` and check:
   - Desktop at 1280px — all sections render correctly
   - Mobile at 768px — layouts collapse to single column
   - Variant A → B toggle in Tweaks panel — font and radius change
   - Scroll reveal animations trigger on scroll
   - Particle canvas in Hero renders and responds to mouse
   - WorkCard tilt effect on hover

---

## Critical Files Summary

| File | Status |
|------|--------|
| `package.json` | ✅ Done |
| `vite.config.js` | ✅ Done |
| `src/index.css` | ✅ Done |
| `src/App.jsx` | ✅ `--color-accent` updated; footer pending (Step 1) |
| `src/components/Hero.jsx` | ✅ `--color-accent` updated; classes pending (Step 9) |
| `src/components/Tweaks.jsx` | ✅ `var(--color-accent)` updated; classes pending (Step 7) |
| `src/components/Nav.jsx` | ⏳ Step 4 |
| `src/components/Work.jsx` | ⏳ Step 5 |
| `src/components/WorkCard.jsx` | ⏳ Step 6 |
| `src/components/Skills.jsx` | ⏳ Step 8 |
| `src/components/About.jsx` | ⏳ Step 3 |
| `src/components/Contact.jsx` | ⏳ Step 2 |
| `src/components/Cursor.jsx` | ✅ No changes needed |
| `src/components/hooks.js` | ✅ No changes needed |
