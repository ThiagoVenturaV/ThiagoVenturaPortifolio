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
    title: "Esportes Da Sorte",
    description: "Plataforma completa de análise esportiva com IA integrada, painel de apostas ao vivo e algoritmos de análise preditiva.",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba6356b3?w=800&h=500&fit=crop",
    stack: ["React", "TypeScript", "FastAPI", "PostgreSQL", "AI/ML"],
    github: "https://github.com/thiagoventura",
    deploy: "#",
  },
  {
    id: 2,
    title: "Dashboard Analytics",
    description: "Dashboard interativo para visualização de dados em tempo real com gráficos animados e filtros dinâmicos.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    stack: ["React", "D3.js", "Node.js", "MongoDB"],
    github: "https://github.com/thiagoventura",
    deploy: "#",
  },
  {
    id: 3,
    title: "E-Commerce Platform",
    description: "Loja virtual completa com sistema de pagamento, carrinho de compras e painel administrativo.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    stack: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
    github: "https://github.com/thiagoventura",
    deploy: "#",
  },
  {
    id: 4,
    title: "Social Media App",
    description: "Rede social com mensagens em tempo real, feed de postagens e sistema de notificações push.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=500&fit=crop",
    stack: ["React Native", "Firebase", "Node.js", "Socket.io"],
    github: "https://github.com/thiagoventura",
    deploy: "#",
  },
  {
    id: 5,
    title: "Portfolio 3D",
    description: "Portfolio pessoal interativo com modelos 3D, animações GSAP e experiência imersiva.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    stack: ["React", "Three.js", "GSAP", "TypeScript"],
    github: "https://github.com/thiagoventura",
    deploy: "#",
  },
];
