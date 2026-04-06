import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current) return;

    // GSAP Draggable-like horizontal scroll with mouse
    const carousel = carouselRef.current;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const mouseDown = (e: MouseEvent) => {
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    };

    const mouseLeave = () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    };

    const mouseUp = () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    };

    let autoScrollId: number;
    let isHovered = false;

    const autoScroll = () => {
      if (!isDown && !isHovered) {
        carousel.scrollLeft += 1;
        // Reset to start if reached end
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1) {
           carousel.scrollLeft = 0;
        }
      }
      autoScrollId = requestAnimationFrame(autoScroll);
    };

    autoScrollId = requestAnimationFrame(autoScroll);

    const mouseEnter = () => isHovered = true;
    const mouseLeaveCarousel = () => {
      isHovered = false;
      mouseLeave();
    };

    carousel.addEventListener('mousedown', mouseDown);
    carousel.addEventListener('mouseleave', mouseLeaveCarousel);
    carousel.addEventListener('mouseenter', mouseEnter);
    carousel.addEventListener('mouseup', mouseUp);
    carousel.addEventListener('mousemove', mouseMove);

    // Animate cards on scroll
    const cards = carousel.querySelectorAll('.project-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      cancelAnimationFrame(autoScrollId);
      carousel.removeEventListener('mousedown', mouseDown);
      carousel.removeEventListener('mouseleave', mouseLeaveCarousel);
      carousel.removeEventListener('mouseenter', mouseEnter);
      carousel.removeEventListener('mouseup', mouseUp);
      carousel.removeEventListener('mousemove', mouseMove);
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="projects-header">
        <div>
          <p className="section-subtitle">Portfolio</p>
          <h2 className="section-title">Projetos</h2>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'rgba(240, 237, 229, 0.4)',
              marginTop: '1rem',
              letterSpacing: '0.05em',
            }}
          >
            Arraste ou use os botões para explorar →
          </p>
        </div>
        <div className="carousel-controls">
          <button 
            className="carousel-btn left" 
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
              }
            }}
            aria-label="Projetos anteriores"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button 
            className="carousel-btn right" 
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
              }
            }}
            aria-label="Próximos projetos"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div className="projects-carousel" ref={carouselRef}>
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <img
              src={project.image}
              alt={project.title}
              className="project-image"
              loading="lazy"
            />
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-stack">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a href={project.deploy} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Deploy
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
