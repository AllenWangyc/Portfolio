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

  return <canvas ref={ref} className="wcard-canvas w-full h-full block" />
}

export default function WorkCard({ wide, image, c1, c2, label, tags, title, desc, year, delay, github }) {
  const [ref, visible] = useReveal()
  const tilt = makeTiltHandlers(7)

  return (
    <div
      ref={ref}
      className={`wcard group bg-card rounded-card overflow-hidden border border-black/6 cursor-none [transform-style:preserve-3d] hover:shadow-[0_28px_60px_rgba(0,0,0,0.11)] opacity-0 translate-y-9 transition-[opacity,transform,box-shadow] duration-700${wide ? ' col-span-full' : ''}${visible ? ' opacity-100 translate-y-0' : ''}`}
      style={{ transitionDelay: delay + 's' }}
      {...tilt}
    >
      <a href={github} target="_blank" rel="noopener noreferrer" className="relative w-full bg-bg2 overflow-hidden aspect-3/2 block">
        {image
          ? <img src={image} alt={title} className="w-full h-full object-cover" />
          : <CardCanvas c1={c1} c2={c2} label={label} />
        }
        {/* wcard-over: styled by [data-card-mode="lift"] CSS in index.css */}
        <div className="wcard-over absolute opacity-0 pointer-events-none flex text-white">
          View Project →
        </div>
      </a>
      <div className="p-7 pb-5">
        <div className="flex gap-1.75 flex-wrap mb-3">
          {tags.map(t => (
            <span key={t} className="wcard-tag text-[11px] font-medium tracking-wider uppercase text-accent bg-accent/10 px-2.5 py-0.75 rounded-full">
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-display text-[clamp(20px,2.2vw,26px)] font-bold tracking-[-0.02em] leading-snug mb-2.5">{title}</h3>
        <p className="text-sm text-muted leading-[1.65]">{desc}</p>
      </div>
      <div className="px-7 py-3.5 border-t border-black/5 flex items-center justify-between">
        <span className="text-xs text-muted">{year}</span>
        <a href={github} target="_blank" rel="noopener noreferrer" className="wcard-link group/link text-[13px] font-medium text-accent no-underline flex items-center gap-1.5">
          GitHub <span className="inline-block transition-transform duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/link:translate-x-1.5">→</span>
        </a>
      </div>
    </div>
  )
}
