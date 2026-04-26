// Shared React hooks

function useReveal(threshold = 0.12) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// Returns inline tilt handlers using e.currentTarget — no ref needed
function makeTiltHandlers(intensity = 7) {
  return {
    onMouseMove(e) {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = 'box-shadow .3s';
      el.style.transform = `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.015)`;
    },
    onMouseLeave(e) {
      const el = e.currentTarget;
      el.style.transition = 'transform .55s ease, box-shadow .3s';
      el.style.transform = '';
      setTimeout(() => { if (el) el.style.transition = ''; }, 550);
    },
  };
}

Object.assign(window, { useReveal, makeTiltHandlers });
