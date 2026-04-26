const ACCENT_COLORS = [
  { color: '#2e7d8f', label: 'Teal Blue'   },
  { color: '#3a6ea8', label: 'Steel Blue'  },
  { color: '#4a7a6a', label: 'Sage Green'  },
  { color: '#7a6aaa', label: 'Muted Purple'},
  { color: '#8a6a5a', label: 'Warm Clay'   },
];

function Tweaks({ tweaks, updateTweak, visible }) {
  return (
    <div id="tp" className={visible ? 'show' : ''}>
      <div className="tp-head">Tweaks</div>

      <div className="tp-row">
        <span className="tp-label">Style Variant</span>
        <div className="tp-opts">
          {[{ v: 'A', label: 'Editorial' }, { v: 'B', label: 'Geometric' }].map(({ v, label }) => (
            <button
              key={v}
              className={`tp-btn${tweaks.variant === v ? ' on' : ''}`}
              onClick={() => updateTweak('variant', v)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="tp-row">
        <span className="tp-label">Accent Color</span>
        <div className="tp-colors">
          {ACCENT_COLORS.map(({ color, label }) => (
            <div
              key={color}
              className={`tp-c${tweaks.accentColor === color ? ' on' : ''}`}
              style={{ background: color }}
              title={label}
              onClick={() => updateTweak('accentColor', color)}
            />
          ))}
        </div>
      </div>

      <div className="tp-row" style={{ marginBottom: 0 }}>
        <span className="tp-label">Hero Text Size</span>
        <input
          type="range" min="60" max="130"
          value={tweaks.heroSize}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
          onChange={e => updateTweak('heroSize', +e.target.value)}
        />
      </div>
    </div>
  );
}

Object.assign(window, { Tweaks });
