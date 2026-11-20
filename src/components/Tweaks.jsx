const ACCENT_COLORS = [
  { color: '#2e7d8f', label: 'Teal Blue'    },
  { color: '#3a6ea8', label: 'Steel Blue'   },
  { color: '#4a7a6a', label: 'Sage Green'   },
  { color: '#7a6aaa', label: 'Muted Purple' },
  { color: '#8a6a5a', label: 'Warm Clay'    },
]

// Dev-only live-editing panel (loaded by App.jsx only when import.meta.env.DEV).
export default function Tweaks({ tweaks, updateTweak, visible }) {
  return (
    <div
      id="tp"
      className={`${visible ? 'block' : 'hidden'} fixed bottom-6 right-6 bg-white border border-black/10 rounded-[20px] px-[22px] py-6 z-[1000] min-w-[250px] shadow-[0_12px_48px_rgba(0,0,0,0.12)] font-body`}
    >
      <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#71717a] mb-5">Tweaks</div>

      <div className="mb-[18px]">
        <span className="text-[13px] font-medium mb-2.5 block text-[#18181b]">Accent Color</span>
        <div className="flex gap-2">
          {ACCENT_COLORS.map(({ color, label }) => (
            <button
              type="button"
              key={color}
              aria-label={label}
              aria-pressed={tweaks.accentColor === color}
              className={`w-[26px] h-[26px] rounded-full border-[2.5px] cursor-pointer transition-[transform,border-color] duration-[180ms] hover:scale-110 ${
                tweaks.accentColor === color ? 'border-[#1a1510]' : 'border-transparent'
              }`}
              style={{ background: color }}
              title={label}
              onClick={() => updateTweak('accentColor', color)}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="text-[13px] font-medium mb-2.5 block text-[#18181b]">Hero Text Size</span>
        <input
          aria-label="Hero text size"
          type="range" min="60" max="130"
          value={tweaks.heroSize}
          style={{ width: '100%', accentColor: 'var(--color-accent)' }}
          onChange={e => updateTweak('heroSize', +e.target.value)}
        />
      </div>
    </div>
  )
}
