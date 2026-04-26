function Cursor() {
  const curRef  = React.useRef(null);
  const ringRef = React.useRef(null);
  const pos     = React.useRef({ cx: 0, cy: 0, rx: 0, ry: 0 });

  React.useEffect(() => {
    const onMove = (e) => {
      pos.current.cx = e.clientX;
      pos.current.cy = e.clientY;
      if (curRef.current) {
        curRef.current.style.left = e.clientX + 'px';
        curRef.current.style.top  = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const loop = () => {
      const p = pos.current;
      p.rx += (p.cx - p.rx) * 0.11;
      p.ry += (p.cy - p.ry) * 0.11;
      if (ringRef.current) {
        ringRef.current.style.left = p.rx + 'px';
        ringRef.current.style.top  = p.ry + 'px';
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    const grow   = () => {
      if (curRef.current)  { curRef.current.style.width = '22px'; curRef.current.style.height = '22px'; }
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };
    const shrink = () => {
      if (curRef.current)  { curRef.current.style.width = '12px'; curRef.current.style.height = '12px'; }
      if (ringRef.current) ringRef.current.style.opacity = '.45';
    };

    const targets = document.querySelectorAll('a, button, .wcard, .htag, .mq-tag, .tp-btn, .tp-c');
    targets.forEach(el => { el.addEventListener('mouseenter', grow); el.addEventListener('mouseleave', shrink); });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      targets.forEach(el => { el.removeEventListener('mouseenter', grow); el.removeEventListener('mouseleave', shrink); });
    };
  }, []);

  return (
    <>
      <div id="cur"      ref={curRef}></div>
      <div id="cur-ring" ref={ringRef}></div>
    </>
  );
}

Object.assign(window, { Cursor });
