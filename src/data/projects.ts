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
    image: "https://i.imgur.com/86UshjJ.jpg",
    stack: ["React", "Python", "FastAPI", "PostgreSQL", "AI/ML"],
    github: "https://github.com/ThiagoVenturaV/esportesdasorteback",
    deploy: "https://ed-script-prototipo-main2.vercel.app/",
  },
  {
    id: 2,
    title: "ServiceFlow",
    description: "Plataforma completa de suporte com IA integrada e ServiceNow",
    image: "https://i.imgur.com/hXPDd4o.jpg",
    stack: ["React", "REST API", "ServiceNow"],
    github: "https://github.com/ThiagoVenturaV/serviceflow",
    deploy: "https://serviceflows.vercel.app/",
  },
  {
    id: 3,
    title: "TaskAI",
    description: "Plataforma completa de gerenciamento de tarefas com IA integrada.",
    image: "https://i.imgur.com/Kk6xpVm.jpg",
    stack: ["React", "TypeScript", "REST API", "PostgreSQL", "IA"],
    github: "https://github.com/ThiagoVenturaV/taskaiBACKEND",
    deploy: "https://taskai-hazel.vercel.app/",
  },
  {
    id: 4,
    title: "Portfólio com katana 3D",
    description: "Portfólio pessoal interativo com modelo 3D de katana, animações GSAP e experiência imersiva.",
    image: "https://i.imgur.com/HIYuFXV.jpg",
    stack: ["React", "Three.js", "GSAP", "TypeScript", "IA"],
    github: "https://github.com/ThiagoVenturaV/ThiagoVenturaPortifolio",
    deploy: "https://thiago-ventura-portifolio.vercel.app/",
  },
];
