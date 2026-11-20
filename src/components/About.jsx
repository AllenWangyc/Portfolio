import { useState, useEffect, useRef } from 'react'
import { useReveal, prefersReducedMotion } from './hooks'
import SectionHeader from './SectionHeader'

// TODO(Yuchen): confirm these numbers before publishing.
const STATS = [
  { num: '2',    label: 'Industry projects delivered' },
  { num: '6',    label: 'Full-stack apps shipped' },
  { num: '25+',  label: 'Technologies in daily use' },
  { num: '250+', label: 'Automated test files in Linshe' },
]

function useCountUp(target, active, duration = 1200) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const num = parseInt(target)
    if (isNaN(num)) return
    if (prefersReducedMotion()) { setCount(num); return }
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
      className={`bg-card rounded-card border border-black/6 p-5 sm:p-7 opacity-0 translate-y-9 transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : ''}`}
      style={{ transitionDelay: delay + 's' }}
    >
      <div className="font-display lining-nums tabular-nums text-[clamp(32px,4vw,48px)] font-black text-accent tracking-[-0.03em] leading-none mb-1.5">
        {isSpecial ? num : count + suffix}
      </div>
      <div className="text-[13px] text-muted">{label}</div>
    </div>
  )
}

export default function About() {
  const [textRef, textVisible] = useReveal()

  return (
    <section id="about" className="bg-bg2 overflow-hidden">
      <div className="max-w-310 mx-auto px-6 md:px-10 lg:px-14">
        <SectionHeader index="03" label="About" title="About" accent="Me" className="pt-20 md:pt-32" />
      </div>

      <div className="max-w-310 mx-auto px-6 md:px-10 lg:px-14 pb-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          <div
            ref={textRef}
            className={`opacity-0 translate-y-9 transition-[opacity,transform] duration-700 ${textVisible ? 'opacity-100 translate-y-0' : ''}`}
          >
            <h3 className="font-display text-[clamp(28px,4vw,44px)] font-black tracking-[-0.03em] leading-[1.15] mb-6">
              Building with <em className="italic text-accent">purpose,</em><br />shipping with care.
            </h3>
            <p className="text-muted text-[15px] leading-[1.75] mb-4">
              I'm a full-stack developer focused on building scalable applications, from clean frontend experiences to robust cloud-based systems.
              I work with modern tools and agent-driven workflows to turn complex ideas into practical, production-ready solutions.
            </p>
            <p className="text-muted text-[15px] leading-[1.75] mb-4">
              I care deeply about code quality, developer experience, and the small details that make software intuitive and reliable.
            </p>
            <p className="text-muted text-[15px] leading-[1.75]">
              When I'm not coding, I'm usually exploring new technologies, experimenting with AI agents,
              or thinking about system design and cloud architecture over a cup of tea.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-5">
            {STATS.map(({ num, label }, i) => (
              <StatBox key={label} num={num} label={label} delay={i * 0.08} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
