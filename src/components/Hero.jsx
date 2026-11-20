import { useRef, useEffect } from 'react'
import { hasFinePointer, prefersReducedMotion } from './hooks'

const TAGS = ['Full-stack', 'Cloud Services', 'Agent', 'DevOps']
const PARTICLES = 55
const LINK_DIST = 110
const REPEL_DIST = 130
const FRAME_MS = 32   // ~30fps is plenty for an ambient effect

function hexRgb(hex) {
  hex = hex.trim().replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
}

/**
 * Ambient particle network. Only runs on fine-pointer devices without reduced
 * motion, only while the hero is on screen, and renders at device pixel ratio.
 */
function useParticles(canvasRef) {
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv || !hasFinePointer() || prefersReducedMotion()) return
    const cx = cv.getContext('2d')
    let W = 0, H = 0, raf = 0, lastTs = 0, running = false
    const mouse = { x: -1e4, y: -1e4 }

    const readAccent = () => hexRgb(
      getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#2e7d8f'
    )
    let [r, g, b] = readAccent()
    // Accent only changes via the dev Tweaks panel (inline style on <html>).
    const mo = new MutationObserver(() => { [r, g, b] = readAccent() })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = cv.clientWidth
      H = cv.clientHeight
      cv.width  = W * dpr
      cv.height = H * dpr
      cx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const pts = Array.from({ length: PARTICLES }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      rad: Math.random() * 1.8 + .5, o: Math.random() * .35 + .08,
    }))

    function draw() {
      cx.clearRect(0, 0, W, H)
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy)
        if (d < REPEL_DIST && d > 0) { p.x += dx / d * 1.8; p.y += dy / d * 1.8 }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }
      cx.lineWidth = .6
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < LINK_DIST) {
            cx.beginPath()
            cx.moveTo(pts[i].x, pts[i].y)
            cx.lineTo(pts[j].x, pts[j].y)
            cx.strokeStyle = `rgba(${r},${g},${b},${.07 * (1 - d / LINK_DIST)})`
            cx.stroke()
          }
        }
      }
      for (const p of pts) {
        cx.beginPath()
        cx.arc(p.x, p.y, p.rad, 0, Math.PI * 2)
        cx.fillStyle = `rgba(${r},${g},${b},${p.o})`
        cx.fill()
      }
    }

    function frame(ts) {
      if (!running) return
      raf = requestAnimationFrame(frame)
      if (ts - lastTs < FRAME_MS) return
      lastTs = ts
      draw()
    }
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame) } }
    const stop  = () => { running = false; cancelAnimationFrame(raf) }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 })
    io.observe(cv)

    const onMove = (e) => {
      const rect = cv.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', resize)

    return () => {
      stop()
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}

const heroLines = [
  [{ t: 'Turning ', em: false }, { t: 'ideas', em: true }, { t: ' into', em: false }],
  [{ t: 'real-world ', em: false }, { t: 'apps', em: true }],
]

export default function Hero({ heroSize = 86 }) {
  const canvasRef = useRef(null)
  useParticles(canvasRef)

  return (
    <section
      id="hero"
      className="relative min-h-svh flex flex-col justify-center max-md:justify-end items-start text-left overflow-hidden pt-25 pb-20 px-[clamp(48px,8vw,120px)] max-md:pt-24 max-md:pb-[calc(3rem+env(safe-area-inset-bottom))] max-md:px-7 short:pt-20 short:pb-8"
    >
      {/* Background image — slow zoom only on larger screens (saves repaints / battery on mobile) */}
      <div className="absolute inset-0 z-0 bg-[url('/uploads/bg_image.jpg')] bg-center max-md:bg-left bg-cover scale-[1.03] md:animate-[heroZoom_18s_ease-in-out_infinite_alternate]" />

      {/* Overlay (responsive gradient handled in CSS) */}
      <div className="hero-bg-overlay" />

      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-2 w-full h-full opacity-35 pointer-events-none" />

      <div className="relative z-4 max-w-[780px] max-md:max-w-full">
        <p className="text-[12px] font-medium tracking-[0.14em] md:tracking-[0.22em] uppercase text-accent2 mb-7 short:mb-3 opacity-0 translate-y-4 animate-[fup_0.6s_0.15s_forwards]">
          Full Stack Developer
        </p>

        <h1
          className="font-display font-black leading-none tracking-[-0.035em] md:tracking-[0.01em] mb-9 short:mb-4 text-white overflow-hidden text-[clamp(38px,6.5vw,var(--hero-size))] short:text-[44px]"
          style={{ '--hero-size': `${heroSize}px` }}
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

        <p className="text-[clamp(15px,1.8vw,19px)] text-white/72 font-light max-w-120 mb-9 short:mb-4 short:text-[15px] md:tracking-wide opacity-0 translate-y-4 animate-[fup_0.6s_0.75s_forwards]">
          Building scalable, production-ready applications — from thoughtful UI to robust backend architecture.
          Currently working with React, TypeScript, ASP.NET Core &amp; AWS.
        </p>

        <div className="flex gap-3 flex-wrap mb-8 short:mb-0 opacity-0 translate-y-4 animate-[fup_0.6s_0.9s_forwards]">
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white no-underline shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110"
          >
            View Work
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full border border-white/35 bg-white/8 px-6 py-3 text-sm font-medium text-white no-underline backdrop-blur-sm transition-[background-color,border-color] duration-200 hover:bg-white/16 hover:border-white/60"
          >
            Get in touch
          </a>
        </div>

        <ul className="flex gap-2.5 flex-wrap list-none short:hidden opacity-0 translate-y-4 animate-[fup_0.6s_1.05s_forwards]" aria-label="Focus areas">
          {TAGS.map(tag => (
            <li
              key={tag}
              className="bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wide text-white/80 whitespace-nowrap backdrop-blur-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-11 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-4 opacity-0 animate-[fup_0.6s_1.5s_forwards] max-lg:hidden short:hidden" aria-hidden="true">
        <span className="text-[10px] tracking-[0.12em] uppercase text-white/50">Scroll</span>
        <div className="w-px h-13 bg-linear-to-b from-accent2 to-transparent animate-[spulse_1.8s_ease-in-out_infinite]" />
      </div>
    </section>
  )
}
