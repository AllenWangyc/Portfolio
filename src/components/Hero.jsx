import { useRef, useEffect } from 'react'
import { useHeroSnap } from './hooks'

export default function Hero({ heroSize }) {
  useHeroSnap()
  const canvasRef  = useRef(null)
  const mouseRef   = useRef({ x: -1e4, y: -1e4 })
  const visibleRef = useRef(true)

  useEffect(() => {
    const cv = canvasRef.current
    const cx = cv.getContext('2d')
    let W, H, pts = [], raf, lastTs = 0

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

    for (let i = 0; i < 55; i++) {
      pts.push({
        x: Math.random() * 1920, y: Math.random() * 1080,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.8 + .5,    o: Math.random() * .35 + .08,
      })
    }

    const hero = document.getElementById('hero')
    const obs = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting },
      { threshold: 0 }
    )
    if (hero) obs.observe(hero)

    function frame(ts) {
      raf = requestAnimationFrame(frame)
      if (ts - lastTs < 32) return
      lastTs = ts
      if (!visibleRef.current) return

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
    }
    frame(0)

    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      obs.disconnect()
    }
  }, [])

  const heroLines = [
    [{ t: 'Turning ', em: false }, { t: 'ideas', em: true }, { t: ' into', em: false }],
    [{ t: 'real-world ', em: false }, { t: 'apps', em: true }],
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center max-md:justify-end items-start text-left overflow-hidden pt-25 pb-20 px-[clamp(48px,8vw,120px)] max-md:pt-0 max-md:pb-16 max-md:px-7"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 bg-[url('/uploads/bg_image.jpg')] bg-center max-md:bg-left bg-cover scale-[1.03] animate-[heroZoom_18s_ease-in-out_infinite_alternate]" />

      {/* Overlay (responsive gradient handled in CSS) */}
      <div className="hero-bg-overlay" />

      {/* Dot-grid for variant B */}
      <div className="hidden variant-b:block absolute inset-0 z-3 bg-[radial-gradient(circle,rgba(46,125,143,0.06)_1px,transparent_1px)] bg-size-[30px_30px] pointer-events-none" />

      <canvas id="pcanvas" ref={canvasRef} className="absolute inset-0 z-2 opacity-35" />

      <div className="relative z-4 max-w-130 max-md:max-w-full">
        <p className="text-[12px] font-medium tracking-[0.14em] uppercase text-accent2 mb-7 opacity-0 translate-y-4 animate-[fup_0.6s_0.15s_forwards]">
          Full Stack Developer
        </p>

        <h1
          className="font-display font-black leading-none tracking-[-0.035em] mb-9 text-white overflow-hidden"
          style={{ fontSize: `clamp(38px, 11vw, ${heroSize}px)` }}
        >
          {heroLines.map((line, li) => (
            <div key={li} className="overflow-hidden" style={{ lineHeight: 1.06 }}>
              <div
                className="hero-line-inner"
                style={{ animationDelay: (0.3 + li * 0.18) + 's' }}
              >
                {line.map(({ t, em }, wi) => (
                  em
                    ? <em key={wi} className="italic text-accent2">{t}</em>
                    : <span key={wi}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </h1>

        <p className="text-[clamp(15px,1.8vw,19px)] text-white/72 font-light max-w-120 mb-10 opacity-0 translate-y-4 animate-[fup_0.6s_0.75s_forwards]">
          Building scalable, production-ready applications — from thoughtful UI to robust backend architecture.
          Currently working with React, TypeScript, ASP.NET Core &amp; AWS.
        </p>

        <div className="flex gap-2.5 flex-wrap opacity-0 translate-y-4 animate-[fup_0.6s_0.9s_forwards]">
          {['React', 'TypeScript', 'ASP.NET Core', 'AWS'].map(tag => (
            <span
              key={tag}
              className="htag bg-white/12 border border-white/18 px-4.5 py-1.5 rounded-full text-[13px] font-medium text-white/88 whitespace-nowrap transition-all duration-200 backdrop-blur-sm hover:bg-accent hover:text-white hover:border-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="scroll-hint absolute bottom-11 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-4 opacity-0 animate-[fup_0.6s_1.5s_forwards] max-md:hidden">
        <span className="text-[10px] tracking-[0.12em] uppercase text-white/50">Scroll</span>
        <div className="w-px h-13 bg-linear-to-b from-accent2 to-transparent animate-[spulse_1.8s_ease-in-out_infinite]" />
      </div>
    </section>
  )
}
