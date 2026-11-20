import { useRef, useState, useEffect } from 'react'

export const FINE_POINTER_QUERY   = '(hover: hover) and (pointer: fine)'
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const matches = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches

export const hasFinePointer        = () => matches(FINE_POINTER_QUERY)
export const prefersReducedMotion  = () => matches(REDUCED_MOTION_QUERY)

/** Reactive media-query hook. */
export function useMediaQuery(query) {
  const [value, setValue] = useState(() => matches(query))
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setValue(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return value
}

export function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/**
 * 3D tilt + glare on hover. No-ops on touch / coarse pointers (where mouse
 * events are emulated on tap) and when the user prefers reduced motion.
 */
export function makeTiltHandlers(intensity = 7) {
  const enabled = () => hasFinePointer() && !prefersReducedMotion()
  return {
    onMouseEnter(e) {
      if (!enabled()) return
      e.currentTarget.style.willChange = 'transform'
    },
    onMouseMove(e) {
      if (!enabled()) return
      const el = e.currentTarget
      const r  = el.getBoundingClientRect()
      const x  = (e.clientX - r.left)  / r.width  - 0.5
      const y  = (e.clientY - r.top)   / r.height - 0.5
      el.style.transition = 'box-shadow .3s'
      el.style.transform  = `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.018)`

      let glare = el.querySelector('.tilt-glare')
      if (!glare) {
        glare = document.createElement('div')
        glare.className = 'tilt-glare'
        glare.style.cssText = [
          'position:absolute; inset:0; pointer-events:none; border-radius:inherit;',
          'opacity:0; transition:opacity .2s; z-index:10;',
        ].join('')
        el.style.position = el.style.position || 'relative'
        el.appendChild(glare)
      }
      const gx = (x + 0.5) * 100
      const gy = (y + 0.5) * 100
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.2) 0%, transparent 65%)`
      glare.style.opacity = '1'
    },
    onMouseLeave(e) {
      const el = e.currentTarget
      if (!el.style.transform) return
      el.style.transition = 'transform .55s ease, box-shadow .3s'
      el.style.transform  = ''
      const glare = el.querySelector('.tilt-glare')
      if (glare) glare.style.opacity = '0'
      setTimeout(() => {
        el.style.transition = ''
        el.style.willChange = 'auto'
      }, 560)
    },
  }
}
