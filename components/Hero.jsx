function Hero({ heroSize }) {
  const canvasRef = React.useRef(null);
  const mouseRef  = React.useRef({ x: -1e4, y: -1e4 });

  React.useEffect(() => {
    const cv = canvasRef.current;
    const cx = cv.getContext('2d');
    let W, H, pts = [], raf;

    function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    function hexRgb(hex) {
      hex = hex.trim().replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
    }
    function getAccent() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2e7d8f';
    }

    for (let i = 0; i < 90; i++) {
      pts.push({
        x: Math.random() * 1920, y: Math.random() * 1080,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.8 + .5,    o: Math.random() * .35 + .08,
      });
    }

    function frame() {
      cx.clearRect(0, 0, W, H);
      const { x: mx, y: my } = mouseRef.current;
      const [r, g, b] = hexRgb(getAccent());

      pts.forEach(p => {
        const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx*dx + dy*dy);
        if (d < 130) { p.x += dx/d * 1.8; p.y += dy/d * 1.8; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 110) {
            cx.beginPath();
            cx.moveTo(pts[i].x, pts[i].y);
            cx.lineTo(pts[j].x, pts[j].y);
            cx.strokeStyle = `rgba(${r},${g},${b},${.07 * (1 - d/110)})`;
            cx.lineWidth = .6;
            cx.stroke();
          }
        }
      }

      pts.forEach(p => {
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(${r},${g},${b},${p.o})`;
        cx.fill();
      });

      raf = requestAnimationFrame(frame);
    }
    frame();

    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  const heroLines = [
    [{ t: 'Turning ', em: false }, { t: 'ideas',      em: true  }, { t: ' into',   em: false }],
    [{ t: 'real-world ', em: false }, { t: 'apps', em: true }],
  ];
  let delay = 0.3;

  return (
    <section id="hero">
      <div className="hero-bg-img"></div>
      <div className="hero-bg-overlay"></div>
      <canvas id="pcanvas" ref={canvasRef}></canvas>

      <div className="hero-inner" style={{ position:'relative', zIndex:4, maxWidth:'520px' }}>
        <p className="hero-eyebrow">Full Stack Developer</p>

        <h1 className="hero-h1" style={{ fontSize: heroSize + 'px' }}>
          {heroLines.map((line, li) => (
            <div key={li}>
              {line.map(({ t, em }, wi) => {
                const d = delay;
                delay += 0.11;
                return (
                  <span key={wi} className="hw" style={{ animationDelay: d + 's' }}>
                    {em ? <em>{t}</em> : t}
                  </span>
                );
              })}
            </div>
          ))}
        </h1>

        <p className="hero-sub">
          Building scalable, production-ready applications — from thoughtful UI to robust backend architecture.
          Currently working with React, TypeScript, ASP.NET Core &amp; AWS.
        </p>

        <div className="hero-tags">
          {['React', 'TypeScript', 'ASP.NET Core', 'AWS'].map(tag => (
            <span key={tag} className="htag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="scroll-hint" style={{ position:'absolute', zIndex:4 }}>
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero });
