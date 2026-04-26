const { useState, useEffect } = React;

const TWEAK_DEFAULTS = { variant: 'A', accentColor: '#2e7d8f', heroSize: 86 };

function App() {
  const [tweaks, setTweaks] = useState({ ...TWEAK_DEFAULTS });
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-variant', tweaks.variant);
    document.documentElement.style.setProperty('--accent', tweaks.accentColor);
  }, [tweaks.variant, tweaks.accentColor]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  function updateTweak(key, value) {
    setTweaks(prev => {
      const next = { ...prev, [key]: value };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
      return next;
    });
  }

  return (
    <>
      <Cursor />
      <Nav />
      <Hero heroSize={tweaks.heroSize} />
      <Work />
      <Skills />
      <About />
      <Contact />
      <footer>© 2026 Yuchen Wang · Turning ideas into real-world apps</footer>
      <Tweaks tweaks={tweaks} updateTweak={updateTweak} visible={tweaksOpen} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
