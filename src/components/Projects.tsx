import { useEffect, useRef, useState } from 'react';
import { FiCode, FiExternalLink, FiGithub } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, type Project } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

function ProjectImage({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);

  if (!project.image || failed) {
    return (
      <div className="project-cover" aria-hidden="true">
        <FiCode className="project-cover-icon" />
        <strong>{project.title}</strong>
        <span>{project.category}</span>
      </div>
    );
  }

  return (
    <img
      src={project.image}
      alt={project.title}
      className="project-image"
      width="800"
      height="440"
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isDown = false;
    let startX = 0;
    let initialScroll = 0;
    let dragged = false;
    let isHovered = false;
    let isVisible = false;
    let autoEnabled = true;
    let previousTime = 0;
    let autoScrollId = 0;

    const updateButtons = () => {
      setCanScrollLeft(carousel.scrollLeft > 4);
      setCanScrollRight(carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 4);
    };
    const stopAuto = () => { autoEnabled = false; };
    const mouseDown = (event: MouseEvent) => {
      dragged = false;
      if (event.button !== 0 || (event.target as Element).closest('a, button')) return;
      isDown = true;
      startX = event.pageX;
      initialScroll = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
    };
    const mouseUp = () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    };
    const mouseMove = (event: MouseEvent) => {
      if (!isDown) return;
      const distance = event.pageX - startX;
      if (Math.abs(distance) > 5) dragged = true;
      if (!dragged) return;
      event.preventDefault();
      carousel.scrollLeft = initialScroll - distance * 2;
    };
    const mouseEnter = () => { isHovered = true; };
    const mouseLeave = () => { isHovered = false; mouseUp(); };
    const preventDragClick = (event: MouseEvent) => {
      if (dragged) {
        event.preventDefault();
        dragged = false;
      }
    };

    // Keep the existing gentle drift, but start only when the gallery is visible
    // and yield permanently as soon as the visitor takes control.
    const autoScroll = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 32) : 0;
      previousTime = time;
      if (isVisible && autoEnabled && !isDown && !isHovered &&
          !carousel.contains(document.activeElement) && !reducedMotion.matches) {
        carousel.scrollLeft += elapsed * 0.03;
      }
      if (autoEnabled && !reducedMotion.matches) {
        autoScrollId = requestAnimationFrame(autoScroll);
      }
    };
    const visibility = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.25 });
    visibility.observe(carousel);
    const resize = new ResizeObserver(updateButtons);
    resize.observe(carousel);
    autoScrollId = requestAnimationFrame(autoScroll);

    carousel.addEventListener('mousedown', mouseDown);
    carousel.addEventListener('mouseleave', mouseLeave);
    carousel.addEventListener('mouseenter', mouseEnter);
    carousel.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
    carousel.addEventListener('scroll', updateButtons, { passive: true });
    carousel.addEventListener('click', preventDragClick);
    // Include the arrow buttons, which live outside the scroll container.
    const section = sectionRef.current;
    section?.addEventListener('pointerdown', stopAuto, { passive: true });
    section?.addEventListener('keydown', stopAuto);
    carousel.addEventListener('wheel', stopAuto, { passive: true });

    const motion = gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        carousel.querySelectorAll('.project-card'),
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7,
          stagger: { amount: 0.6 },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      cancelAnimationFrame(autoScrollId);
      visibility.disconnect();
      resize.disconnect();
      motion.revert();
      carousel.removeEventListener('mousedown', mouseDown);
      carousel.removeEventListener('mouseleave', mouseLeave);
      carousel.removeEventListener('mouseenter', mouseEnter);
      carousel.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
      carousel.removeEventListener('scroll', updateButtons);
      carousel.removeEventListener('click', preventDragClick);
      carousel.removeEventListener('wheel', stopAuto);
      section?.removeEventListener('pointerdown', stopAuto);
      section?.removeEventListener('keydown', stopAuto);
    };
  }, []);

  const scrollProjects = (direction: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector<HTMLElement>('.project-card');
    const step = (card?.offsetWidth ?? 400) + parseFloat(getComputedStyle(carousel).gap || '0');
    carousel.scrollBy({
      left: direction * step,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="projects-header">
        <div>
          <p className="section-subtitle">Portfolio</p>
          <h2 className="section-title">Projetos</h2>
          <p className="projects-hint">
            {projects.length} projetos · Arraste ou use os botões para explorar
          </p>
        </div>
        <div className="carousel-controls">
          <button
            className={`carousel-btn left${!canScrollLeft ? ' disabled' : ''}`}
            onClick={() => scrollProjects(-1)}
            disabled={!canScrollLeft}
            aria-label="Projetos anteriores"
            aria-controls="projects-carousel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            className={`carousel-btn right${!canScrollRight ? ' disabled' : ''}`}
            onClick={() => scrollProjects(1)}
            disabled={!canScrollRight}
            aria-label="Próximos projetos"
            aria-controls="projects-carousel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div
        id="projects-carousel"
        className="projects-carousel"
        ref={carouselRef}
        role="region"
        aria-label="Galeria de projetos"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            scrollProjects(event.key === 'ArrowLeft' ? -1 : 1);
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            event.currentTarget.scrollTo({
              left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth,
              behavior: 'instant',
            });
          }
        }}
      >
        {projects.map((project) => (
          <article key={project.id} className="project-card" aria-labelledby={`project-${project.id}`}>
            <ProjectImage project={project} />
            <div className="project-info">
              <h3 id={`project-${project.id}`} className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-stack">
                {project.stack.map((tech) => <span key={tech}>{tech}</span>)}
              </div>
              <div className="project-links">
                <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub de ${project.title}`}>
                  <FiGithub aria-hidden="true" /> GitHub
                </a>
                {project.repositories?.map((repository) => (
                  <a key={repository.url} href={repository.url} target="_blank" rel="noopener noreferrer" aria-label={`${repository.label} de ${project.title} no GitHub`}>
                    <FiCode aria-hidden="true" /> {repository.label}
                  </a>
                ))}
                {project.deploy && (
                  <a href={project.deploy} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${project.title}`}>
                    <FiExternalLink aria-hidden="true" /> Deploy
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
