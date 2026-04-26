import { useRef, useEffect, useMemo } from 'react'

export default function Cursor() {
  const curRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ cx: 0, cy: 0, rx: 0, ry: 0 })

  const isTouch = useMemo(
    () => window.matchMedia('(pointer: coarse)').matches,
    []
  )

  useEffect(() => {
    if (isTouch) {
      document.body.style.cursor = 'auto'
      return
    }

    const onMove = (e) => {
      pos.current.cx = e.clientX
      pos.current.cy = e.clientY
      if (curRef.current) {
        curRef.current.style.left = e.clientX + 'px'
        curRef.current.style.top  = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', onMove)

    let raf
    const loop = () => {
      const p = pos.current
      p.rx += (p.cx - p.rx) * 0.13
      p.ry += (p.cy - p.ry) * 0.13
      if (ringRef.current) {
        ringRef.current.style.left = p.rx + 'px'
        ringRef.current.style.top  = p.ry + 'px'
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    const onDocMove = (e) => {
      const el = e.target.closest('a, button, .wcard, .htag, .mq-tag, .tp-btn, .tp-c, .ct-soc')
      if (el) {
        if (curRef.current)  { curRef.current.style.width = '8px';  curRef.current.style.height = '8px';  curRef.current.style.opacity = '0.5' }
        if (ringRef.current) { ringRef.current.style.width = '52px'; ringRef.current.style.height = '52px'; ringRef.current.style.opacity = '0.7' }
      } else {
        if (curRef.current)  { curRef.current.style.width = '12px'; curRef.current.style.height = '12px'; curRef.current.style.opacity = '1' }
        if (ringRef.current) { ringRef.current.style.width = '38px'; ringRef.current.style.height = '38px'; ringRef.current.style.opacity = '.45' }
      }
    }
    document.addEventListener('mousemove', onDocMove)

    const onClick = () => {
      if (!curRef.current) return
      curRef.current.style.transform = 'translate(-50%,-50%) scale(2.2)'
      curRef.current.style.opacity = '0'
      setTimeout(() => {
        if (curRef.current) {
          curRef.current.style.transform = 'translate(-50%,-50%) scale(1)'
          curRef.current.style.opacity = '1'
        }
      }, 220)
    }
    document.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousemove', onDocMove)
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div
        id="cur"
        ref={curRef}
        className="w-3 h-3 bg-accent rounded-full fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ transition: 'width .15s, height .15s, background .3s, opacity .2s, transform .2s' }}
      />
      <div
        id="cur-ring"
        ref={ringRef}
        className="w-[38px] h-[38px] border-[1.5px] border-accent rounded-full fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 opacity-[0.45]"
        style={{ transition: 'width .2s, height .2s, opacity .2s, border-color .3s' }}
      />
    </>
  )
}
