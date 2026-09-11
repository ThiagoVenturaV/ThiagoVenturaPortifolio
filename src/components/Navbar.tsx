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

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}
    >
      <a
        href="#hero"
        className="nav-logo"
        onClick={handleNavClick}
      >
        <img
          src="/logozoroquadradaSemFundo.png"
          alt="Logo Thiago Ventura"
          className="nav-logo-img"
        />
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
          <a href="#about" onClick={handleNavClick}>
            Sobre
          </a>
        </li>
        <li>
          <a href="#skills" onClick={handleNavClick}>
            Habilidades
          </a>
        </li>
        <li>
          <a href="#projects" onClick={handleNavClick}>
            Projetos
          </a>
        </li>
        <li>
          <a href="#contact" onClick={handleNavClick}>
            Contato
          </a>
        </li>
      </ul>
    </nav>
  );
}
