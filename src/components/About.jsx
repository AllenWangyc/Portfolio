import { useState, useEffect, useRef } from 'react'
import { useReveal } from './hooks'

const STATS = [
  { num: '3+',  label: 'Years of full-stack experience' },
  { num: '20+', label: 'Projects shipped to production' },
  { num: '8+',  label: 'Technologies mastered' },
  { num: '∞',   label: 'Lines of TypeScript written' },
]

function useCountUp(target, active, duration = 1200) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const num = parseInt(target)
    if (isNaN(num)) return
    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * num))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, target, duration])

  return count
}

function StatBox({ num, label, delay }) {
  const [ref, visible] = useReveal()
  const isSpecial = isNaN(parseInt(num))
  const suffix = num.replace(/\d+/g, '')
  const count = useCountUp(num, visible)

  return (
    <div
      ref={ref}
      className={`bg-card rounded-card border border-black/6 p-7 opacity-0 translate-y-9 transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : ''}`}
      style={{ transitionDelay: delay + 's' }}
    >
      <div className="font-display text-[clamp(36px,4vw,48px)] font-black text-accent tracking-[-0.03em] leading-none mb-1.5">
        {isSpecial ? num : count + suffix}
      </div>
      <div className="text-[13px] text-muted">{label}</div>
    </div>
  )
}

export default function About() {
  const [headerRef, headerVisible] = useReveal()
  const [textRef, textVisible] = useReveal()

  return (
    <section id="about" className="bg-bg2 overflow-hidden">
      <div className="max-w-310 mx-auto px-14 max-md:px-6">
        <div
          ref={headerRef}
          className={`flex items-baseline gap-5 pt-32 mb-18 opacity-0 translate-y-9 transition-[opacity,transform] duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : ''}`}
        >
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-accent whitespace-nowrap">03 — About</span>
          <h2 className="font-display text-[clamp(32px,5vw,60px)] font-black tracking-tight leading-none">
            About <em className="italic text-accent">Me</em>
          </h2>
          <div className="flex-1 h-px bg-black/9" />
        </div>
      </div>

      <div className="max-w-310 mx-auto px-14 pb-32 max-md:px-6">
        <div className="grid grid-cols-2 gap-20 items-center max-md:grid-cols-1 max-md:gap-10">

          <div
            ref={textRef}
            className={`opacity-0 translate-y-9 transition-[opacity,transform] duration-700 ${textVisible ? 'opacity-100 translate-y-0' : ''}`}
          >
            <h3 className="font-display text-[clamp(28px,4vw,44px)] font-black tracking-[-0.03em] leading-[1.15] mb-6">
              Building with <em className="italic text-accent">purpose,</em><br />shipping with care.
            </h3>
            <p className="text-muted text-[15px] leading-[1.75] mb-4">
              I'm a full-stack developer who loves turning complex problems into clean, scalable solutions.
              I care deeply about code quality, developer experience, and the small details that make software feel great to use.
            </p>
            <p className="text-muted text-[15px] leading-[1.75]">
              When I'm not coding, I'm probably exploring new technologies, contributing to open source,
              or thinking about system architecture over a cup of tea.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {STATS.map(({ num, label }, i) => (
              <StatBox key={label} num={num} label={label} delay={i * 0.08} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
