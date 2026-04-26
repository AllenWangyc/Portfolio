const MARQUEE_ROW1 = ['React', 'TypeScript', 'Next.js', 'HTML / CSS', 'ASP.NET Core', 'Node.js', 'PostgreSQL', 'GraphQL', 'REST API', 'Docker', 'AWS', 'Git', 'CI / CD', 'Redis'];
const MARQUEE_ROW2 = ['Tailwind CSS', 'AWS Lambda', 'ECS', 'S3', 'Vite', 'Jest', 'Swagger', 'Entity Framework', 'Zustand', 'React Query', 'GitHub Actions', 'Linux', 'Nginx'];

const SK_CATS = [
  {
    num: '01', title: 'Frontend',
    skills: ['React & Next.js', 'TypeScript', 'HTML / CSS / Tailwind', 'Zustand · React Query', 'Vite · Jest'],
  },
  {
    num: '02', title: 'Backend',
    skills: ['ASP.NET Core', 'Node.js', 'REST API · GraphQL', 'PostgreSQL · Redis', 'Entity Framework'],
  },
  {
    num: '03', title: 'Cloud / DevOps',
    skills: ['AWS (ECS · Lambda · S3)', 'Docker', 'GitHub Actions · CI/CD', 'Linux · Nginx', 'Git'],
  },
];

function MarqueeRow({ tags, reverse }) {
  const doubled = [...tags, ...tags];
  return (
    <div className={`marquee-row ${reverse ? 'r2' : 'r1'}`}>
      {doubled.map((tag, i) => (
        <span key={i} className={`mq-tag${i === 0 || i === tags.length ? ' accent' : ''}`}>{tag}</span>
      ))}
    </div>
  );
}

function SkCat({ num, title, skills, delay }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`sk-cat rev${visible ? ' on' : ''}`} style={{ transitionDelay: delay + 's' }}>
      <div className="sk-cat-num">{num}</div>
      <div className="sk-cat-title">{title}</div>
      <div className="sk-list">
        {skills.map(s => (
          <div key={s} className="sk-entry">
            <div className="sk-dot"></div>{s}
          </div>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  const [ref, visible] = useReveal();
  return (
    <section className="sec" id="skills" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, maxWidth: '100%' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px 64px' }}>
        <div ref={ref} className={`sec-head rev${visible ? ' on' : ''}`}>
          <span className="sec-label">02 — Skills</span>
          <h2 className="sec-title">Tech <em>Stack</em></h2>
          <div className="sec-rule"></div>
        </div>
      </div>

      <div className="marquee-wrap">
        <MarqueeRow tags={MARQUEE_ROW1} reverse={false} />
        <MarqueeRow tags={MARQUEE_ROW2} reverse={true} />
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px' }}>
        <div className="sk-cats">
          {SK_CATS.map((cat, i) => (
            <SkCat key={cat.num} {...cat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Skills });
