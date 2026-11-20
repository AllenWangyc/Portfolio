import { useRef, useEffect } from 'react'
import { useMediaQuery, FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from './hooks'

const INTERACTIVE = 'a, button, [role="button"], input, label, select, textarea, .wcard, .mq-tag'

/**
 * Custom dot + trailing ring cursor. Only mounted on hover-capable, fine-pointer
 * devices without reduced-motion; everyone else keeps the native cursor.
 * Position is applied via transform on outer wrappers (no transition), while
 * hover/click scaling runs on inner elements (with transition).
 */
export default function Cursor() {
  const finePointer   = useMediaQuery(FINE_POINTER_QUERY)
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY)
  const enabled = finePointer && !reducedMotion

  const dotWrap  = useRef(null)
  const ringWrap = useRef(null)
  const dot      = useRef(null)
  const ring     = useRef(null)

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('custom-cursor')

    const p = { cx: -100, cy: -100, rx: -100, ry: -100 }
    let raf = 0
    let hovering = false
    let clickTimer = 0

    const place = (el, x, y) => { if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)` }

    const loop = () => {
      p.rx += (p.cx - p.rx) * 0.13
      p.ry += (p.cy - p.ry) * 0.13
      place(ringWrap.current, p.rx, p.ry)
      // Stop the loop once the ring has caught up; the next move restarts it.
      raf = (Math.abs(p.cx - p.rx) + Math.abs(p.cy - p.ry) > 0.2) ? requestAnimationFrame(loop) : 0
    }

    const setVisible = (v) => {
      if (dotWrap.current)  dotWrap.current.style.opacity  = v ? '1' : '0'
      if (ringWrap.current) ringWrap.current.style.opacity = v ? '1' : '0'
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      if (p.cx === -100) { p.rx = e.clientX; p.ry = e.clientY }   // first move: no fly-in
      p.cx = e.clientX
      p.cy = e.clientY
      place(dotWrap.current, p.cx, p.cy)
      setVisible(true)
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const applyHover = () => {
      if (dot.current)  { dot.current.style.transform  = `scale(${hovering ? 0.67 : 1})`; dot.current.style.opacity = hovering ? '0.5' : '1' }
      if (ring.current) { ring.current.style.transform = `scale(${hovering ? 1.37 : 1})`; ring.current.style.opacity = hovering ? '0.7' : '0.45' }
    }

    const onOver = (e) => {
      const next = !!e.target.closest?.(INTERACTIVE)
      if (next !== hovering) { hovering = next; applyHover() }
    }

    const onDown = () => {
      if (!dot.current) return
      dot.current.style.transform = 'scale(2.2)'
      dot.current.style.opacity = '0'
      clearTimeout(clickTimer)
      clickTimer = setTimeout(applyHover, 220)
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerdown', onDown, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      root.classList.remove('custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
      clearTimeout(clickTimer)
    }
  }, [enabled])

  if (!enabled) return null

  const wrap = 'fixed top-0 left-0 pointer-events-none opacity-0 transition-opacity duration-200'
  return (
    <div aria-hidden="true">
      <div ref={dotWrap} className={`${wrap} z-[9999]`}>
        <div
          ref={dot}
          className="w-3 h-3 -ml-1.5 -mt-1.5 bg-accent rounded-full transition-[transform,opacity] duration-150"
        />
      </div>
      <div ref={ringWrap} className={`${wrap} z-[9998]`}>
        <div
          ref={ring}
          className="w-[38px] h-[38px] -ml-[19px] -mt-[19px] border-[1.5px] border-accent rounded-full opacity-45 transition-[transform,opacity] duration-200"
        />
      </div>
    </div>
  )
}
