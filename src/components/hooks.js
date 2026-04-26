import { useRef, useState, useEffect } from 'react'

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

export function useHeroSnap() {
  const [exited, setExited] = useState(false)

  useEffect(() => {
    let touching = false

    const onTouchStart = () => { touching = true }
    const onTouchEnd   = () => { touching = false }

    let snapping = false

    const onScroll = () => {
      if (touching || snapping || window.__navScrollActive) return
      const y = window.scrollY
      const h = window.innerHeight
      if (!exited && y >= h * 0.5) {
        setExited(true)
        snapping = true
        window.scrollTo({ top: h, behavior: 'smooth' })
        setTimeout(() => { snapping = false }, 600)
      } else if (exited && y < 8) {
        setExited(false)
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })
    window.addEventListener('scroll',     onScroll,     { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('scroll',     onScroll)
    }
  }, [exited])

  return exited
}

export function makeTiltHandlers(intensity = 7) {
  return {
    onMouseEnter(e) {
      e.currentTarget.style.willChange = 'transform'
    },
    onMouseMove(e) {
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
          'background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, transparent 65%);',
          'opacity:0; transition:opacity .2s; z-index:10;',
        ].join('')
        el.style.position = el.style.position || 'relative'
        el.appendChild(glare)
      }
      const gx = ((e.clientX - r.left) / r.width)  * 100
      const gy = ((e.clientY - r.top)  / r.height) * 100
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.2) 0%, transparent 65%)`
      glare.style.opacity = '1'
    },
    onMouseLeave(e) {
      const el = e.currentTarget
      el.style.transition = 'transform .55s ease, box-shadow .3s'
      el.style.transform  = ''
      const glare = el.querySelector('.tilt-glare')
      if (glare) glare.style.opacity = '0'
      setTimeout(() => {
        if (el) {
          el.style.transition = ''
          el.style.willChange = 'auto'
        }
      }, 560)
    },
  }
}
