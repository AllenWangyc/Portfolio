# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite, default port 5173)
npm run build    # Production build
npm run preview  # Preview production build
```

No test framework is configured.

## UI Development Rules

- **Styling:** Use TailwindCSS utility classes for all new styles. Do not add rules to `src/index.css` for new UI work — that file is legacy and only maintained for existing global tokens and animations.
- **Responsive design:** Every UI change must account for both desktop and mobile. Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) and verify layouts at the `768px` breakpoint (the existing mobile breakpoint in `src/index.css`).

## Architecture

Single-page portfolio built with React 18 + Vite. All sections render as a continuous scroll page in this order: `Cursor → Nav → Hero → Work → Skills → About → Contact → Footer → Tweaks`.

**Entry point:** `src/main.jsx` → `src/App.jsx`

### App-level state (`src/App.jsx`)
- `tweaks` state holds `{ variant, accentColor, heroSize }` and drives global CSS custom property `--accent` and `data-variant` attribute on `<html>`.
- `Tweaks` panel is toggled via `postMessage` from a parent frame (`__activate_edit_mode` / `__deactivate_edit_mode`), enabling live preview editing from an iframe host.
- `updateTweak` posts `__edit_mode_set_keys` back to the parent frame on every change.

### Shared hooks (`src/components/hooks.js`)
- `useReveal(threshold)` — IntersectionObserver-based scroll reveal; returns `[ref, visible]`. Applied to section headers to add `.on` class to `.rev` elements.
- `useHeroSnap()` — Scroll-snap logic for the Hero section: auto-snaps to `100vh` when user scrolls past 50% of viewport height. Skips snap on touch to preserve mobile free-scroll.
- `makeTiltHandlers(intensity)` — Returns `{ onMouseMove, onMouseLeave }` for 3D card tilt effects.

### Theming
Two variants controlled by `data-variant` on `<html>`:
- **Variant A** (default): `--font-d: 'Playfair Display'`, rounded corners (`--radius: 16px`), teal accent.
- **Variant B**: `--font-d: 'Syne'`, sharp corners (`--radius: 4px`), same teal accent with a dot-grid overlay on Hero.

All theme tokens are CSS custom properties in `src/index.css` under `:root` and `[data-variant="B"]`.

### Hero section (`src/components/Hero.jsx`)
- Animated canvas background: 90 particles with mouse-repulsion and connecting lines, drawn with the `--accent` color.
- Background image at `/uploads/bg_image.jpg` with a `heroZoom` keyframe animation.
- `heroSize` prop controls the `font-size` of the `<h1>`.

### Work section (`src/components/Work.jsx` + `WorkCard.jsx`)
- Project data is a static `PROJECTS` array in `Work.jsx` — update this to add/modify portfolio projects.
- Cards use `makeTiltHandlers` for 3D hover tilt.
- Wide cards (`wide: true`) span both grid columns; narrow cards are 16/9 aspect ratio.

### Scroll reveal pattern
Sections wrap their reveal targets with `className="rev"` and toggle `"rev on"` using `useReveal`. This CSS transition fades elements up on scroll.

### CSS structure (`src/index.css`)
Single flat CSS file. Sections are commented with `/* ── SectionName ── */` headers. Responsive breakpoint at `max-width: 768px` at the bottom of the file.

### Duplicate/legacy files
The root `App.jsx` and `components/` directory are legacy files from before the Vite migration — the active source is entirely under `src/`. Do not edit the root-level duplicates.
