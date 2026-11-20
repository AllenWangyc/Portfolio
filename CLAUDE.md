# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite, default port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run images   # Generate responsive WebP variants for project screenshots (see Work section)
```

No test framework is configured.

## UI Development Rules

- **Styling:** Use TailwindCSS utility classes for all new styles. Do not add rules to `src/index.css` for new UI work — that file only holds theme tokens, keyframes, and the few global rules Tailwind can't express (focus ring, custom-cursor gating, reduced-motion, hamburger `nth-child`).
- **Responsive design:** Every UI change must account for phone, tablet and desktop. Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) and verify at 390px, 768px (`md`), 1024px (`lg`) and 1440px. Landscape phones use the custom `short:` variant (landscape and max-height 500px).
- **Interaction:** Tailwind v4 `hover:` only applies on hover-capable devices. Anything pointer-driven in JS (tilt, custom cursor, particles) must check `hasFinePointer()` and `prefersReducedMotion()` from `hooks.js`.

## Architecture

Single-page portfolio built with React 18 + Vite. Render order: `Cursor → Nav → <main>(Hero → Work → Skills → About → Contact) → <footer> → Tweaks (dev only)`.

**Entry point:** `src/main.jsx` → `src/App.jsx`

### App-level (`src/App.jsx`)
- `useDevTweaks()` — `tweaks` state `{ accentColor, heroSize }`. The `Tweaks` panel is lazy-loaded **only when `import.meta.env.DEV`**, so it is tree-shaken out of production. In dev it is toggled via `postMessage` from a parent frame (`__activate_edit_mode` / `__deactivate_edit_mode`), and `updateTweak` posts `__edit_mode_set_keys` back.
- `useScrollbarSection()` — Sets `data-in-hero` on `<html>` (IntersectionObserver on `#hero`); CSS hides the scrollbar while the hero is visible.

### Shared hooks (`src/components/hooks.js`)
- `useReveal(threshold)` — IntersectionObserver scroll reveal; returns `[ref, visible]`. Elements toggle `opacity-0 translate-y-9` → `opacity-100 translate-y-0`.
- `useMediaQuery(query)`, `hasFinePointer()`, `prefersReducedMotion()` and the `FINE_POINTER_QUERY` / `REDUCED_MOTION_QUERY` constants.
- `makeTiltHandlers(intensity)` — `{ onMouseEnter, onMouseMove, onMouseLeave }` for 3D card tilt + glare; no-op on touch or reduced motion.

### Shared components
- `SectionHeader` — "01 — Work" eyebrow + display title + rule. It stacks on mobile and sits in one row from `md`. Use it for every new section.
- `Cursor` — Dot + trailing ring. Mounted only for `(hover: hover) and (pointer: fine)` without reduced motion. It adds `custom-cursor` to `<html>`, which hides the native cursor. Its rAF loop stops once the ring catches up.

### Theming
Single theme. Tokens live in the TailwindCSS v4 `@theme` block in `src/index.css`. Tailwind v4 token names matter: use `--font-display` / `--font-body` (→ `font-display` / `font-body` utilities), `--color-*`, and `--radius-card`. Display font is Playfair Display; body font is DM Sans (Google Fonts in `index.html`).

### Hero section (`src/components/Hero.jsx`)
- Particle canvas (`useParticles`): 55 particles with pointer repulsion, drawn in `--color-accent`.
  - Rendered at devicePixelRatio and runs only while the hero is on screen.
  - Skipped on touch devices and under reduced motion.
- Background image `/uploads/bg_image.jpg` (preloaded in `index.html`). The `heroZoom` animation runs only from `md` up.
- Height is `min-h-svh`. The h1 size is `clamp(38px, 6.5vw, var(--hero-size))`, where `heroSize` sets `--hero-size`.
- CTAs: "View Work" goes to `#work` and "Get in touch" goes to `#contact`.

### Work section (`src/components/Work.jsx` + `WorkCard.jsx`)
- Project data is the static `PROJECTS` array in `Work.jsx`. Fields:
  - `title`, `desc`, `tags`, `year`, `github`
  - optional `demo`: when set, the image links to the demo and the footer shows "Live Demo" plus "GitHub"
  - `wide` (spans both columns; only the featured first project)
  - `delay`: alternate 0.1 / 0.2 for left and right columns
  - `image`
  - `c1` / `c2` / `label`: fallback canvas when there is no image
- **Images:** put the original screenshot (3:2, ≥1536px wide) in `assets/works/<name>.png|jpg|webp`. Run `npm run images` to write `public/uploads/works/<name>-768.webp` and `-1536.webp`, then set `image: '<name>'`. `WorkCard` builds the `srcSet` and `sizes`, lazy-loads every card except the first, and sets `width`/`height` to avoid layout shift.
- Tags show at most 5; the rest collapse into a `+N` chip.

### Nav (`src/components/Nav.jsx`)
- Active section tracking via one IntersectionObserver.
- Mobile menu is an accessible dialog: `aria-expanded`, Esc closes it, focus moves to the first link, and it is `inert` while closed.
- Respects safe-area insets.

### SEO
`index.html` has description, Open Graph and Twitter tags, and `theme-color`. `public/og.jpg` is a 1200×630 hero screenshot. `og:image` is relative until a production domain is set. `public/robots.txt` allows all.
