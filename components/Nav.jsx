function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [onHero,   setOnHero]   = React.useState(true);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setOnHero(entry.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const cls = [scrolled ? 'scrolled' : '', onHero ? 'on-hero' : ''].join(' ').trim();

  return (
    <nav id="nav" className={cls}>
      <div className="nav-name">Yuchen Wang</div>
      <ul className="nav-links">
        <li><a href="#work">Work</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

Object.assign(window, { Nav });
