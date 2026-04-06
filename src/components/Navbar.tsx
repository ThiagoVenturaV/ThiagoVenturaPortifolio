import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY.current && currentScrollY > 300) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}
    >
      <a href="#hero" className="nav-logo" onClick={(e) => handleNavClick(e, 'hero')}>
        TV
      </a>

      <button
        className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>
            Sobre
          </a>
        </li>
        <li>
          <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')}>
            Habilidades
          </a>
        </li>
        <li>
          <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')}>
            Projetos
          </a>
        </li>
        <li>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>
            Contato
          </a>
        </li>
      </ul>
    </nav>
  );
}
