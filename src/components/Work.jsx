import { useReveal } from './hooks'
import WorkCard from './WorkCard'

const PROJECTS = [
  {
    wide: true, image: null, c1: '#7c3aed', c2: '#a78bfa', label: 'CloudTask — project screenshot',
    tags: ['React', 'ASP.NET Core', 'AWS ECS', 'PostgreSQL'],
    title: 'CloudTask',
    desc: 'Full-stack project management platform with real-time collaboration, role-based access control, and automated CI/CD pipelines. Deployed on AWS ECS with zero-downtime blue/green deployment.',
    year: '2024', delay: 0,
  },
  {
    wide: false, image: null, c1: '#0ea5e9', c2: '#38bdf8', label: 'DevMetrics — project screenshot',
    tags: ['TypeScript', 'React', 'D3.js'],
    title: 'DevMetrics',
    desc: 'Developer productivity analytics dashboard with interactive visualisations, custom date ranges, and team-level velocity insights.',
    year: '2024', delay: 0.1,
  },
  {
    wide: false, image: null, c1: '#e8936a', c2: '#f97316', label: 'ShopAPI — project screenshot',
    tags: ['ASP.NET Core', 'PostgreSQL', 'Docker'],
    title: 'ShopAPI',
    desc: 'High-performance e-commerce REST API handling 50k+ daily requests with JWT auth, Redis caching, and comprehensive OpenAPI documentation.',
    year: '2023', delay: 0.2,
  },
  {
    wide: false, image: null, c1: '#10b981', c2: '#34d399', label: 'WeatherNow — project screenshot',
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
      <div
        ref={ref}
        className={`flex items-baseline gap-5 mb-18 opacity-0 translate-y-9 transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : ''}`}
      >
        <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-accent whitespace-nowrap">01 — Work</span>
        <h2 className="font-display text-[clamp(32px,5vw,60px)] font-black tracking-tight leading-none">
          Selected <em className="italic text-accent">Projects</em>
        </h2>
        <div className="flex-1 h-px bg-black/9" />
      </div>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {PROJECTS.map((p, i) => <WorkCard key={i} {...p} />)}
      </div>
    </section>
  )
}
