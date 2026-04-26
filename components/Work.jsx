function CardCanvas({ c1, c2, label }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    function draw() {
      const c = ref.current;
      if (!c) return;
      const pw = c.parentElement.clientWidth  || 700;
      const ph = c.parentElement.clientHeight || 300;
      c.width  = pw * 2;
      c.height = ph * 2;
      const cx = c.getContext('2d');
      cx.fillStyle = c1 + '12';
      cx.fillRect(0, 0, c.width, c.height);
      cx.save();
      cx.strokeStyle = c2 + '28';
      cx.lineWidth = 2.5;
      for (let i = -c.height; i < c.width + c.height; i += 32) {
        cx.beginPath(); cx.moveTo(i, 0); cx.lineTo(i + c.height, c.height); cx.stroke();
      }
      cx.restore();
      cx.fillStyle = c2 + '35';
      const fs = Math.round(c.height * .068);
      cx.font = `500 ${fs}px 'DM Sans', monospace`;
      cx.textAlign = 'center';
      cx.textBaseline = 'middle';
      cx.fillText(label, c.width / 2, c.height / 2);
    }
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [c1, c2, label]);

  return <canvas ref={ref} className="wcard-canvas"></canvas>;
}

const PROJECTS = [
  {
    wide: true, c1: '#7c3aed', c2: '#a78bfa', label: 'CloudTask — project screenshot',
    tags: ['React', 'ASP.NET Core', 'AWS ECS', 'PostgreSQL'],
    title: 'CloudTask',
    desc: 'Full-stack project management platform with real-time collaboration, role-based access control, and automated CI/CD pipelines. Deployed on AWS ECS with zero-downtime blue/green deployment.',
    year: '2024', delay: 0,
  },
  {
    wide: false, c1: '#0ea5e9', c2: '#38bdf8', label: 'DevMetrics — project screenshot',
    tags: ['TypeScript', 'React', 'D3.js'],
    title: 'DevMetrics',
    desc: 'Developer productivity analytics dashboard with interactive visualisations, custom date ranges, and team-level velocity insights.',
    year: '2024', delay: 0.1,
  },
  {
    wide: false, c1: '#e8936a', c2: '#f97316', label: 'ShopAPI — project screenshot',
    tags: ['ASP.NET Core', 'PostgreSQL', 'Docker'],
    title: 'ShopAPI',
    desc: 'High-performance e-commerce REST API handling 50k+ daily requests with JWT auth, Redis caching, and comprehensive OpenAPI documentation.',
    year: '2023', delay: 0.2,
  },
  {
    wide: false, c1: '#10b981', c2: '#34d399', label: 'WeatherNow — project screenshot',
    tags: ['React', 'TypeScript', 'AWS Lambda'],
    title: 'WeatherNow',
    desc: 'Real-time weather app with geolocation, 7-day animated forecasts, and a serverless backend on AWS Lambda + API Gateway.',
    year: '2023', delay: 0.1,
  },
];

function WorkCard({ wide, c1, c2, label, tags, title, desc, year, delay }) {
  const [ref, visible] = useReveal();
  const tilt = makeTiltHandlers(7);

  return (
    <div
      ref={ref}
      className={`wcard${wide ? ' wide' : ''} rev${visible ? ' on' : ''}`}
      style={{ transitionDelay: delay + 's' }}
      {...tilt}
    >
      <div className="wcard-img">
        <CardCanvas c1={c1} c2={c2} label={label} />
        <div className="wcard-over">View Project →</div>
      </div>
      <div className="wcard-body">
        <div className="wcard-tags">
          {tags.map(t => <span key={t} className="wcard-tag">{t}</span>)}
        </div>
        <h3 className="wcard-title">{title}</h3>
        <p className="wcard-desc">{desc}</p>
      </div>
      <div className="wcard-foot">
        <span className="wcard-year">{year}</span>
        <a href="#" className="wcard-link">GitHub <span>→</span></a>
      </div>
    </div>
  );
}

function Work() {
  const [ref, visible] = useReveal();
  return (
    <section className="sec" id="work">
      <div ref={ref} className={`sec-head rev${visible ? ' on' : ''}`}>
        <span className="sec-label">01 — Work</span>
        <h2 className="sec-title">Selected <em>Projects</em></h2>
        <div className="sec-rule"></div>
      </div>
      <div className="work-grid">
        {PROJECTS.map((p, i) => <WorkCard key={i} {...p} />)}
      </div>
    </section>
  );
}

Object.assign(window, { Work, WorkCard, CardCanvas });
