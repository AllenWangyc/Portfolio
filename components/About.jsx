const STATS = [
  { num: '3+',  label: 'Years of full-stack experience' },
  { num: '20+', label: 'Projects shipped to production' },
  { num: '8+',  label: 'Technologies mastered' },
  { num: '∞',   label: 'Lines of TypeScript written' },
];

function About() {
  const [textRef, textVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();

  return (
    <section className="sec" id="about" style={{ background: 'var(--bg2)', maxWidth: '100%', padding: '128px 0' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 56px' }}>
        <div className="about-inner">

          <div ref={textRef} className={`about-text rev${textVisible ? ' on' : ''}`}>
            <h2>Building with <em>purpose,</em><br />shipping with care.</h2>
            <p>
              I'm a full-stack developer who loves turning complex problems into clean, scalable solutions.
              I care deeply about code quality, developer experience, and the small details that make software feel great to use.
            </p>
            <p>
              When I'm not coding, I'm probably exploring new technologies, contributing to open source,
              or thinking about system architecture over a cup of tea.
            </p>
          </div>

          <div ref={statsRef} className={`about-stats rev${statsVisible ? ' on' : ''}`} style={{ transitionDelay: '.15s' }}>
            {STATS.map(({ num, label }) => (
              <div key={label} className="stat-box">
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

Object.assign(window, { About });
