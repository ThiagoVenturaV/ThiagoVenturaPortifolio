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
    image: "https://imgur.com/86UshjJ",
    stack: ["React", "Python", "FastAPI", "PostgreSQL", "AI/ML"],
    github: "https://github.com/ThiagoVenturaV/esportesdasorteback",
    deploy: "https://ed-script-prototipo-main2.vercel.app/",
  },
  {
    id: 2,
    title: "ServiceFlow",
    description: "Plataforma completa de suporte com IA integrada e ServiceNow",
    image: "https://imgur.com/hXPDd4o",
    stack: ["React", "REST API", "ServiceNow"],
    github: "https://github.com/ThiagoVenturaV/serviceflow",
    deploy: "https://serviceflows.vercel.app/",
  },
  {
    id: 3,
    title: "TaskAI",
    description: "Plataforma completa de gerenciamento de tarefas com IA integrada.",
    image: "https://imgur.com/a/Kk6xpVm",
    stack: ["React", "TypeScript", "REST API", "PostgreSQL", "IA"],
    github: "https://github.com/ThiagoVenturaV/taskaiBACKEND",
    deploy: "https://taskai-hazel.vercel.app/",
  },
  {
    id: 4,
    title: "Portfólio com katana 3D",
    description: "Portfólio pessoal interativo com modelo 3D de katana, animações GSAP e experiência imersiva.",
    image: "https://imgur.com/HIYuFXV",
    stack: ["React", "Three.js", "GSAP", "TypeScript", "IA"],
    github: "https://github.com/ThiagoVenturaV/ThiagoVenturaPortifolio",
    deploy: "https://thiago-ventura-portifolio.vercel.app/",
  },
];
