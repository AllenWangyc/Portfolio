import { useRef, useEffect } from 'react'
import { useReveal, makeTiltHandlers } from './hooks'

const MAX_TAGS = 5
const IMG_DIR = '/uploads/works'

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
    const ro = new ResizeObserver(draw)
    ro.observe(ref.current.parentElement)
    return () => ro.disconnect()
  }, [c1, c2, label])

  return <canvas ref={ref} aria-hidden="true" className="w-full h-full block" />
}

function ProjectImage({ image, title, wide, priority }) {
  const sizes = wide
    ? '(max-width: 767px) 100vw, (max-width: 1240px) 92vw, 1128px'
    : '(max-width: 767px) 100vw, (max-width: 1240px) 46vw, 554px'
  return (
    <img
      src={`${IMG_DIR}/${image}-1536.webp`}
      srcSet={`${IMG_DIR}/${image}-768.webp 768w, ${IMG_DIR}/${image}-1536.webp 1536w`}
      sizes={sizes}
      width={1536}
      height={1024}
      alt={`${title} — screenshot`}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}  /* lowercase: React 18 passes it through as an attribute */
      decoding="async"
      className="w-full h-full object-cover"
    />
  )
}

function FooterLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link text-[13px] font-medium text-accent no-underline inline-flex items-center gap-1.5 py-1"
    >
      {children}
      <span aria-hidden="true" className="inline-block transition-transform duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/link:translate-x-1.5">→</span>
    </a>
  )
}

export default function WorkCard({ wide, image, c1, c2, label, tags, title, desc, year, delay, github, demo, priority }) {
  const [ref, visible] = useReveal()
  const tilt = makeTiltHandlers(7)
  const primary = demo || github
  const shownTags = tags.slice(0, MAX_TAGS)
  const hiddenTags = tags.slice(MAX_TAGS)

  return (
    <article
      ref={ref}
      className={`wcard group relative flex flex-col bg-card rounded-card overflow-hidden border border-black/6 [transform-style:preserve-3d] hover:shadow-[0_28px_60px_rgba(0,0,0,0.11)] opacity-0 translate-y-9 transition-[opacity,transform,box-shadow] duration-700${wide ? ' md:col-span-full' : ''}${visible ? ' opacity-100 translate-y-0' : ''}`}
      style={{ transitionDelay: delay + 's' }}
      {...tilt}
    >
      <a
        href={primary}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title} — ${demo ? 'open live demo' : 'view on GitHub'}`}
        className="relative w-full bg-bg2 overflow-hidden aspect-3/2 block"
      >
        <div className="w-full h-full brightness-[0.97] transition-[filter,transform] duration-500 group-hover:brightness-105 group-hover:scale-[1.02]">
          {image
            ? <ProjectImage image={image} title={title} wide={wide} priority={priority} />
            : <CardCanvas c1={c1} c2={c2} label={label} />
          }
        </div>
        {/* Hover hint — Tailwind v4 `hover`/`group-hover` only apply on hover-capable devices */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[46%] flex items-end px-6 pb-[18px] text-[13px] tracking-[0.08em] uppercase text-white pointer-events-none bg-linear-to-t from-[rgba(12,22,32,0.72)] via-[rgba(12,22,32,0.35)] to-transparent opacity-0 translate-y-2 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {demo ? 'Open Live Demo →' : 'View Project →'}
        </div>
      </a>

      <div className="p-6 md:p-7 pb-5 flex-1">
        <ul className="flex gap-1.75 flex-wrap mb-3 list-none" aria-label="Tech stack">
          {shownTags.map(t => (
            <li key={t} className="text-[11px] font-medium tracking-wider uppercase text-accent bg-accent/10 px-2.5 py-0.75 rounded-full">
              {t}
            </li>
          ))}
          {hiddenTags.length > 0 && (
            <li
              title={hiddenTags.join(', ')}
              aria-label={`and ${hiddenTags.length} more: ${hiddenTags.join(', ')}`}
              className="text-[11px] font-medium tracking-wider text-muted bg-black/5 px-2.5 py-0.75 rounded-full"
            >
              +{hiddenTags.length}
            </li>
          )}
        </ul>
        <h3 className="font-display text-[clamp(20px,2.2vw,26px)] font-bold tracking-[-0.02em] leading-snug mb-2.5">{title}</h3>
        <p className="text-sm text-muted leading-[1.65]">{desc}</p>
      </div>

      <div className="px-6 md:px-7 py-3 border-t border-black/5 flex items-center justify-between gap-4">
        <span className="text-xs text-muted">{year}</span>
        <div className="flex items-center gap-5">
          {demo && <FooterLink href={demo}>Live Demo</FooterLink>}
          <FooterLink href={github}>GitHub</FooterLink>
        </div>
      </div>
    </article>
  )
}
