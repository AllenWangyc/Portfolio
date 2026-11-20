import SectionHeader from './SectionHeader'
import WorkCard from './WorkCard'

// image: base name of a screenshot in assets/works/ (run `npm run images` after adding one)
// demo:  optional live URL — when set, the card's primary link goes to the demo
const PROJECTS = [
  {
    wide: true,
    image: 'linshe',
    c1: '#65a30d', c2: '#a3e635', label: 'Linshe',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Claude Code'],
    title: 'Linshe – Neighbourhood Second-hand Marketplace',
    desc: "A bilingual second-hand marketplace PWA for Auckland's Chinese community. Sellers list single items, buyers send purchase intents, and contact details are shared only after the seller accepts, enforced by PostgreSQL Row-Level Security. Built through subagent-driven development with Claude Code and covered by 250+ automated test files.",
    year: '2026', delay: 0,
    github: 'https://github.com/AllenWangyc/linshe',
  },
  {
    wide: false,
    image: 'lymoon',
    c1: '#7c3aed', c2: '#a78bfa', label: 'Lymoon',
    tags: ['React Native', 'Expo', 'TypeScript', '.NET', 'REST API', 'Zustand', 'React Query'],
    title: 'Lymoon – Collaborative Schedule Management App',
    desc: 'A cross-platform mobile scheduling app that enables users to create and manage shared weekly schedules via join codes. Supports role-based permissions (manager vs member) and multi-user collaboration with an interactive weekly board. Designed with a scalable backend and clean mobile-first UX.',
    year: '2026', delay: 0.1,
    github: 'https://github.com/AllenWangyc/Lymoon',
  },
  {
    wide: false,
    image: 'factvax',
    c1: '#0ea5e9', c2: '#38bdf8', label: 'FactVax',
    tags: ['React', 'TypeScript', 'Node.js', 'AWS', 'Chrome Extension', 'REST API'],
    title: 'FactVax – Vaccine Misinformation Detector',
    desc: 'A web-based platform and Chrome extension for detecting vaccine-related misinformation in real time. Supports content analysis, result visualization, and user history tracking, with optimized backend performance.',
    year: '2025', delay: 0.2,
    github: 'https://github.com/AllenWangyc/factvax',
  },
  {
    wide: false,
    image: 'nike',
    c1: '#111827', c2: '#6b7280', label: 'Nike Shoes Shop',
    tags: ['React', 'Tailwind CSS', 'Responsive Design', 'JavaScript'],
    title: 'Nike Shoes Shop',
    desc: 'A responsive e-commerce frontend for showcasing Nike shoes, built with Tailwind CSS. Focused on mobile-first design, clean UI layout, and adaptive user experience across devices.',
    year: '2026', delay: 0.1,
    github: 'https://github.com/AllenWangyc/nike-shoes-shop',
  },
  {
    wide: false,
    image: 'magic-kitchen',
    c1: '#f97316', c2: '#fb923c', label: 'Magic Kitchen',
    tags: ['React', 'TypeScript', 'AI API', 'Prompt Engineering', 'REST API'],
    title: 'Magic Kitchen',
    desc: 'An AI-based web application that generates recipes from user-input ingredients using prompt-driven content generation. Focused on usability and efficient interaction design.',
    year: '2024', delay: 0.2,
    github: 'https://github.com/AllenWangyc/magic-kitchen',
  },
  {
    wide: false,
    image: 'pikachu',
    c1: '#facc15', c2: '#fbbf24', label: 'Pokedex',
    tags: ['React', 'JavaScript', 'REST API', 'Infinite Scroll', 'Filtering', 'CSS'],
    title: 'Pokedex',
    desc: 'A Pokémon explorer web app featuring infinite scrolling and multi-condition search (text and type filters). Built for efficient data browsing with smooth UX and dynamic content loading.',
    year: '2024', delay: 0.1,
    github: 'https://github.com/AllenWangyc/pokemon-explorer',
  },
]

export default function Work() {
  return (
    <section className="max-w-[1240px] mx-auto px-6 md:px-10 lg:px-14 py-20 md:py-32" id="work">
      <SectionHeader index="01" label="Work" title="Selected" accent="Projects" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROJECTS.map((p, i) => <WorkCard key={p.title} {...p} priority={i === 0} />)}
      </div>
    </section>
  )
}
