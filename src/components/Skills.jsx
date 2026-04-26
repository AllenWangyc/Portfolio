import { useState } from 'react'
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

function MarqueeRow({ tags, reverse, paused }) {
  const doubled = [...tags, ...tags]
  return (
    <div
      className={`flex gap-3 w-max mb-3 ${reverse ? 'animate-[mq2_22s_linear_infinite]' : 'animate-[mq1_28s_linear_infinite]'}`}
      style={{ animationPlayState: paused ? 'paused' : 'running' }}
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
      className={`sk-cat relative p-10 px-9 border border-black/7 overflow-hidden [transition:background_250ms,opacity_700ms,transform_700ms] hover:bg-bg2 opacity-0 translate-y-9 ${visible ? 'opacity-100 translate-y-0' : ''}`}
      style={{ transitionDelay: delay + 's' }}
    >
      <div className="font-display text-[72px] font-black text-accent opacity-[0.08] absolute top-4 right-6 leading-none tracking-[-0.04em] pointer-events-none select-none">
        {num}
      </div>
      <div className="font-display text-[20px] font-bold tracking-[-0.02em] mb-6">{title}</div>
      <div className="flex flex-col gap-2.5">
        {skills.map(s => (
          <div key={s} className="flex items-center gap-2.5 text-sm text-text">
            <div className="w-[5px] h-[5px] rounded-full bg-accent flex-shrink-0 opacity-60" />
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const [ref, visible] = useReveal()
  const [marqueePaused, setMarqueePaused] = useState(false)

  return (
    <section id="skills" className="bg-bg overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-14 pb-16 max-md:px-6">
        <div
          ref={ref}
          className={`flex items-baseline gap-5 pt-32 mb-[72px] opacity-0 translate-y-9 transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : ''}`}
        >
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-accent whitespace-nowrap">02 — Skills</span>
          <h2 className="font-display text-[clamp(32px,5vw,60px)] font-black tracking-tight leading-none">
            Tech <em className="italic text-accent">Stack</em>
          </h2>
          <div className="flex-1 h-px bg-black/9" />
        </div>
      </div>

      <div
        className="relative mb-14"
        onMouseEnter={() => setMarqueePaused(true)}
        onMouseLeave={() => setMarqueePaused(false)}
      >
        <div className="absolute top-0 bottom-0 left-0 w-[120px] bg-gradient-to-r from-bg to-transparent z-[2] pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-[120px] bg-gradient-to-l from-bg to-transparent z-[2] pointer-events-none" />
        <MarqueeRow tags={MARQUEE_ROW1} reverse={false} paused={marqueePaused} />
        <MarqueeRow tags={MARQUEE_ROW2} reverse={true}  paused={marqueePaused} />
      </div>

      <div className="max-w-[1240px] mx-auto px-14 pb-20 max-md:px-6">
        <div className="grid grid-cols-3 gap-[2px] rounded-card overflow-hidden max-md:grid-cols-1">
          {SK_CATS.map((cat, i) => (
            <SkCat key={cat.num} {...cat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
