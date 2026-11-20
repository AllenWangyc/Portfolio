import { useReveal } from './hooks'

/**
 * Shared section heading: "01 — Work" eyebrow + display title + rule.
 * Desktop: one baseline-aligned row. Mobile: eyebrow stacked above the title, no rule.
 */
export default function SectionHeader({ index, label, title, accent, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 md:flex-row md:items-baseline md:gap-5 mb-12 md:mb-18 opacity-0 translate-y-9 transition-[opacity,transform] duration-700 ${visible ? 'opacity-100 translate-y-0' : ''} ${className}`}
    >
      <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-accent whitespace-nowrap">
        {index} — {label}
      </span>
      <h2 className="font-display text-[clamp(36px,5vw,60px)] font-black tracking-tight leading-none">
        {title} <em className="italic text-accent">{accent}</em>
      </h2>
      <div className="hidden md:block flex-1 h-px bg-black/9" />
    </div>
  )
}
