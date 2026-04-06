import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { 
  SiReact, 
  SiTypescript, 
  SiJavascript, 
  SiHtml5, 
  SiNodedotjs, 
  SiPython, 
  SiPostgresql, 
  SiThreedotjs, 
  SiGreensock, 
  SiGit, 
  SiFigma, 
  SiGraphql 
} from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    name: 'React / Next.js',
    category: 'Frontend',
    color: '#61DAFB',
    icon: <SiReact size={24} />,
  },
  {
    name: 'TypeScript',
    category: 'Linguagem',
    color: '#3178C6',
    icon: <SiTypescript size={24} />,
  },
  {
    name: 'JavaScript',
    category: 'Linguagem',
    color: '#F7DF1E',
    icon: <SiJavascript size={24} />,
  },
  {
    name: 'HTML5 / CSS3',
    category: 'Frontend',
    color: '#E34F26',
    icon: <SiHtml5 size={24} />,
  },
  {
    name: 'Node.js',
    category: 'Backend',
    color: '#339933',
    icon: <SiNodedotjs size={24} />,
  },
  {
    name: 'Python',
    category: 'Backend',
    color: '#3776AB',
    icon: <SiPython size={24} />,
  },
  {
    name: 'PostgreSQL',
    category: 'Banco de Dados',
    color: '#4169E1',
    icon: <SiPostgresql size={24} />,
  },
  {
    name: 'Three.js / R3F',
    category: '3D / WebGL',
    color: '#049EF4',
    icon: <SiThreedotjs size={24} />,
  },
  {
    name: 'GSAP',
    category: 'Animação',
    color: '#88CE02',
    icon: <SiGreensock size={24} />,
  },
  {
    name: 'Git / DevOps',
    category: 'Ferramentas',
    color: '#F05032',
    icon: <SiGit size={24} />,
  },
  {
    name: 'Figma / UI',
    category: 'Design',
    color: '#F24E1E',
    icon: <SiFigma size={24} />,
  },
  {
    name: 'REST / GraphQL',
    category: 'API',
    color: '#E10098',
    icon: <SiGraphql size={24} />,
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.skill-hex');

    // Reveal cards with stagger
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50, scale: 0.8, rotateY: -15 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateY: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Animate the ring fill (conic gradient rotation)
    const rings = cardsRef.current.querySelectorAll('.skill-ring-progress');
    rings.forEach((ring) => {
      gsap.fromTo(
        ring,
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: ring,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (
          st.trigger === sectionRef.current ||
          (st.trigger instanceof Element && cardsRef.current?.contains(st.trigger))
        ) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      {/* Decorative kanji */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '3%',
          fontSize: '12rem',
          fontFamily: 'var(--font-display)',
          color: 'rgba(201, 168, 76, 0.02)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        剣
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p className="section-subtitle">Competências</p>
        <h2 className="section-title">Habilidades</h2>

        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem',
          }}
        >
          {skills.map((skill) => (
            <div key={skill.name} className="skill-hex">
              {/* Circular ring with icon */}
              <div className="skill-ring-wrapper">
                <div
                  className="skill-ring-progress"
                  style={{
                    background: `conic-gradient(${skill.color}44 0deg, ${skill.color}22 120deg, transparent 120deg)`,
                  }}
                >
                  <div className="skill-ring-inner">
                    <div
                      className="skill-icon-display"
                      style={{ color: skill.color }}
                    >
                      {skill.icon}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="skill-hex-name">{skill.name}</h3>
              <p className="skill-hex-category">{skill.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
