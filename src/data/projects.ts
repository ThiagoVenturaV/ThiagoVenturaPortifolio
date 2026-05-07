export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  stack: string[];
  github: string;
  deploy: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Edson Assist",
    description: "Plataforma completa de análise esportiva com IA integrada, painel de apostas ao vivo e algoritmos de análise preditiva.",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba6356b3?w=800&h=500&fit=crop",
    stack: ["React", "Python", "FastAPI", "PostgreSQL", "AI/ML"],
    github: "https://github.com/ThiagoVenturaV/esportesdasorteback",
    deploy: "https://ed-script-prototipo-main2.vercel.app/",
  },
  {
    id: 2,
    title: "ServiceFlow",
    description: "Plataforma completa de suporte com IA integrada e ServiceNow",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    stack: ["React", "REST API", "ServiceNow"],
    github: "https://github.com/ThiagoVenturaV/serviceflow",
    deploy: "https://serviceflows.vercel.app/",
  },
  {
    id: 3,
    title: "TaskAI",
    description: "Plataforma completa de gerenciamento de tarefas com IA integrada.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    stack: ["React", "TypeScript", "REST API", "PostgreSQL", "IA"],
    github: "https://github.com/ThiagoVenturaV/taskaiBACKEND",
    deploy: "https://taskai-hazel.vercel.app/",
  },
  {
    id: 4,
    title: "Portfólio com katana 3D",
    description: "Portfólio pessoal interativo com modelo 3D de katana, animações GSAP e experiência imersiva.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    stack: ["React", "Three.js", "GSAP", "TypeScript", "IA"],
    github: "https://github.com/ThiagoVenturaV/ThiagoVenturaPortifolio",
    deploy: "https://thiago-ventura-portifolio.vercel.app/",
  },
];
