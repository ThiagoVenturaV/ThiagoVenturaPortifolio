import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${8 + Math.random() * 12}s`,
      size: `${1 + Math.random() * 2}px`,
      opacity: 0.2 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            maxHeight: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.6 });

    // Split title into chars manually
    if (titleRef.current) {
      const text = titleRef.current.textContent || '';
      titleRef.current.innerHTML = text
        .split('')
        .map((char) =>
          char === ' '
            ? '<span class="char" style="width: 0.3em; display: inline-block;">&nbsp;</span>'
            : `<span class="char">${char}</span>`
        )
        .join('');

      tl.to('.hero-title .char', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power3.out',
        startAt: { y: 40, opacity: 0 },
      });
    }

    // Subtitle
    tl.to(
      subtitleRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    // CTA Buttons
    tl.to(
      ctaRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.4'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      {/* Background */}
      <div className="hero-bg">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(13, 31, 13, 0.6) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 80%, rgba(107, 15, 15, 0.15) 0%, transparent 50%),
              linear-gradient(180deg, #0a0a0a 0%, #0d1f0d 40%, #0a0a0a 100%)
            `,
            zIndex: 1,
          }}
        />
        {/* Atmospheric fog/mist effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.03) 0%, transparent 50%)
            `,
            zIndex: 2,
            animation: 'breathe 6s ease-in-out infinite',
          }}
        />
      </div>

      <Particles />

      {/* Content */}
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Thiago Ventura
        </h1>
        <p
          ref={subtitleRef}
          className="hero-subtitle"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          Desenvolvedor Web
        </p>
        <div
          ref={ctaRef}
          className="hero-cta-group"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          <a href="#projects" className="btn-primary" onClick={(e) => handleScroll(e, 'projects')}>
            Ver Projetos
          </a>
          <a href="#contact" className="btn-secondary" onClick={(e) => handleScroll(e, 'contact')}>
            Contato
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>

      {/* Breathe animation keyframes */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
}
