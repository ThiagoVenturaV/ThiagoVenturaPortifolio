import { useEffect, useRef, type JSX } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiThreedotjs,
  SiGreensock,
  SiTailwindcss,
  SiDocker,
  SiGit,
  SiFigma,
} from 'react-icons/si';

const technologies = [
  { name: 'React', icon: <SiReact size={18} color="var(--gold)" /> },
  { name: 'TypeScript', icon: <SiTypescript size={18} color="var(--gold)" /> },
  { name: 'Next.js', icon: <SiNextdotjs size={18} color="var(--gold)" /> },
  { name: 'Node.js', icon: <SiNodedotjs size={18} color="var(--gold)" /> },
  { name: 'Python', icon: <SiPython size={18} color="var(--gold)" /> },
  { name: 'PostgreSQL', icon: <SiPostgresql size={18} color="var(--gold)" /> },
  { name: 'Three.js', icon: <SiThreedotjs size={18} color="var(--gold)" /> },
  { name: 'GSAP', icon: <SiGreensock size={18} color="var(--gold)" /> },
  { name: 'Tailwind', icon: <SiTailwindcss size={18} color="var(--gold)" /> },
  { name: 'Docker', icon: <SiDocker size={18} color="var(--gold)" /> },
  { name: 'Git', icon: <SiGit size={18} color="var(--gold)" /> },
  { name: 'Figma', icon: <SiFigma size={18} color="var(--gold)" /> },
];

import euDeZoro from '../assets/euDeZoro.png';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll(
      '.section-subtitle, .section-title, .about-text, .tech-item'
    );

    gsap.fromTo(
      elements,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Image parallax effect
    if (imageWrapperRef.current) {
      gsap.fromTo(
        imageWrapperRef.current,
        { y: 80, opacity: 0 },
        {
          y: -40,
          opacity: 1,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }

    // Parallax effect on the section background
    gsap.to(sectionRef.current, {
      backgroundPosition: '50% 30%',
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          fontSize: '15rem',
          fontFamily: 'var(--font-display)',
          color: 'rgba(201, 168, 76, 0.02)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        侍
      </div>

      <div ref={contentRef} className="about-content">
        <p className="section-subtitle">Sobre Mim</p>
        <h2 className="section-title">Quem sou eu</h2>
        <p className="about-text">
          Sou um desenvolvedor apaixonado por criar experiências digitais
          imersivas e de alta performance. Com foco em tecnologias modernas como AI&nbsp;Agents, React, TypeScript e Node.js, assim como uma base solida em Backend Java e Springboot, transformo ideias em interfaces que
          impressionam e funcionam perfeitamente.
        </p>
        <p className="about-text" style={{ marginTop: '1rem' }}>
          Assim como um espadachim que busca a perfeição em cada golpe, eu busco a
          excelência em cada linha de código. Minha abordagem combina design
          cinematográfico com arquitetura de software robusta, criando projetos que
          são tanto bonitos quanto funcionais.
        </p>

        <div className="tech-stack">
          {technologies.map((tech) => (
            <div key={tech.name} className="tech-item">
              {tech.icon}
              {tech.name}
            </div>
          ))}
        </div>
      </div>

      <div className="about-image-wrapper" ref={imageWrapperRef}>
        <div className="about-image-frame">
          <img
            src={euDeZoro}
            alt="Thiago Ventura"
            className="about-image"
          />
        </div>
      </div>
    </section>
  );
}
