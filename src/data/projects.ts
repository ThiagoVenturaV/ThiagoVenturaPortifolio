export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image?: string;
  imageIsIllustration?: boolean;
  stack: string[];
  github: string;
  deploy?: string;
  repositories?: { label: string; url: string }[];
}

// Initial public repository review: 2026-09-11. Additions reviewed on 2026-11-10.
// See docs/project-catalog.md for sources and project status.
// Related codebases share one card; demos are included after checking their pages.
export const projects: Project[] = [
  {
    "id": 1,
    "title": "Edson Assist",
    "description": "Assistente de análise esportiva com painéis estatísticos, visualização de partidas e IA para explorar dados e probabilidades.",
    "category": "Análise esportiva",
    "image": "/projects/edson-assist.webp",
    "stack": [
      "React",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "IA"
    ],
    "github": "https://github.com/ThiagoVenturaV/EdsonAssist",
    "deploy": "https://ed-script-prototipo-main2.vercel.app/",
    "repositories": [
      {
        "label": "Backend",
        "url": "https://github.com/ThiagoVenturaV/EdsonAssistBack"
      }
    ]
  },
  {
    "id": 2,
    "title": "ServiceFlow",
    "description": "Atendimento conversacional com IA, abertura de chamados no ServiceNow e identidade visual configurável para cada operação.",
    "category": "Suporte e automação",
    "image": "/projects/serviceflow.webp",
    "stack": [
      "React",
      "REST API",
      "ServiceNow",
      "Groq"
    ],
    "github": "https://github.com/ThiagoVenturaV/serviceflow",
    "deploy": "https://serviceflows.vercel.app/"
  },
  {
    "id": 3,
    "title": "TaskAI",
    "description": "Gestão de tarefas em um quadro Kanban com agente de IA para organizar atividades por meio de linguagem natural.",
    "category": "Produtividade com IA",
    "image": "/projects/taskai.webp",
    "stack": [
      "React",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "IA"
    ],
    "github": "https://github.com/ThiagoVenturaV/taskai",
    "deploy": "https://taskai-hazel.vercel.app/",
    "repositories": [
      {
        "label": "Backend",
        "url": "https://github.com/ThiagoVenturaV/taskaiBACKEND"
      }
    ]
  },
  {
    "id": 4,
    "title": "Portfólio com katana 3D",
    "description": "Portfólio interativo com katana 3D, animação de desembainhar guiada pela rolagem e assistente conversacional com IA.",
    "category": "Experiência web",
    "image": "/projects/portfolio.webp",
    "stack": [
      "React",
      "Three.js",
      "GSAP",
      "TypeScript",
      "IA"
    ],
    "github": "https://github.com/ThiagoVenturaV/ThiagoVenturaPortifolio",
    "deploy": "https://thiago-ventura-portifolio.vercel.app/"
  },
  {
    "id": 5,
    "title": "Titi",
    "description": "Assistente local para Windows com conversa por texto e voz, mascote animado e ferramentas para executar ações no computador. Em beta.",
    "category": "Assistente desktop",
    "image": "/projects/titi.webp",
    "stack": [
      "Electron",
      "React",
      "TypeScript",
      "Ollama"
    ],
    "github": "https://github.com/ThiagoVenturaV/Assistente-de-Voz---Titi",
    "deploy": "https://titi-assistente.thiago2013ventura.chatgpt.site/",
    "repositories": [
      {
        "label": "Cód. do site",
        "url": "https://github.com/ThiagoVenturaV/Titi-Site"
      }
    ]
  },
  {
    "id": 6,
    "title": "Hora Certa",
    "description": "Aplicativo Android para organizar medicamentos, programar alarmes exatos e acompanhar doses e estoque, com dados armazenados no aparelho.",
    "category": "Aplicativo Android",
    "image": "/projects/hora-certa.webp",
    "stack": [
      "Kotlin",
      "Jetpack Compose",
      "SQLite",
      "Android"
    ],
    "github": "https://github.com/ThiagoVenturaV/HoraCerta-Android",
    "deploy": "https://hora-certa.thiago2013ventura.chatgpt.site/",
    "repositories": [
      {
        "label": "Cód. do site",
        "url": "https://github.com/ThiagoVenturaV/HoraCerta-Site"
      }
    ]
  },
  {
    "id": 7,
    "title": "Diversa AI",
    "description": "Assistente de educação inclusiva com busca em fontes, respostas em streaming e orientações adaptadas para famílias, professores e gestores.",
    "category": "Educação inclusiva",
    "image": "/projects/diversa-ai.webp",
    "stack": [
      "React",
      "FastAPI",
      "MongoDB",
      "FAISS",
      "RAG"
    ],
    "github": "https://github.com/ThiagoVenturaV/Diversa-AI",
    "deploy": "https://diversa-ai.vercel.app/",
    "repositories": [
      {
        "label": "Backend",
        "url": "https://github.com/ThiagoVenturaV/Diversa-AI-Backend"
      }
    ]
  },
  {
    "id": 8,
    "title": "Recife Digital",
    "description": "Plataforma de capacitação digital com cursos, avaliações, acompanhamento de progresso, certificados em PDF e recursos de acessibilidade.",
    "category": "Educação e inclusão digital",
    "image": "/projects/recife-digital.webp",
    "stack": [
      "React",
      "TypeScript",
      "PostgreSQL",
      "PWA"
    ],
    "github": "https://github.com/ThiagoVenturaV/RecifeDigital",
    "deploy": "https://recifedigital.vercel.app/"
  },
  {
    "id": 9,
    "title": "Pilar 360",
    "description": "Participação cidadã com registro de demandas urbanas, projetos comunitários e recompensas. Inclui um protótipo mobile em React Native.",
    "category": "Tecnologia cívica",
    "image": "/projects/pilar360.webp",
    "stack": [
      "React",
      "PostgreSQL",
      "PWA",
      "React Native",
      "Expo"
    ],
    "github": "https://github.com/ThiagoVenturaV/Participa360",
    "deploy": "https://pilar-360.vercel.app/",
    "repositories": [
      {
        "label": "Mobile",
        "url": "https://github.com/ThiagoVenturaV/Role-Access-Hub"
      }
    ]
  },
  {
    "id": 10,
    "title": "Recife por Elas",
    "description": "Contribuição em plataforma que reúne oportunidades de trabalho, cursos e uma rede de apoio para mulheres e mães solo no Recife.",
    "category": "Projeto colaborativo",
    "image": "/projects/recife-por-elas.webp",
    "stack": [
      "React",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Leaflet"
    ],
    "github": "https://github.com/ThiagoVenturaV/recife-por-elas",
    "deploy": "https://recife-por-elas.vercel.app/"
  },
  {
    "id": 12,
    "title": "Agente Participa",
    "description": "Agente para WhatsApp com memória por conversa, chamadas de ferramentas e orquestração de diálogos usando LangGraph e a API oficial da Meta.",
    "category": "Agentes e integrações",
    "stack": [
      "Python",
      "FastAPI",
      "LangGraph",
      "WhatsApp API",
      "Docker"
    ],
    "github": "https://github.com/ThiagoVenturaV/Participa",
    "image": "/projects/2-agente-participa-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 13,
    "title": "EloTech",
    "description": "Plataforma de capacitação e empregabilidade para mulheres trans e travestis, com bootcamps, candidaturas, mentoria e comunidade.",
    "category": "Educação e empregabilidade",
    "stack": [
      "React",
      "TypeScript",
      "PostgreSQL",
      "Vercel"
    ],
    "github": "https://github.com/ThiagoVenturaV/elotech",
    "image": "/projects/7-elotech-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 14,
    "title": "El Sabor",
    "description": "Sistema de pedidos para restaurantes com cardápio, carrinho, checkout Pix e painéis para administração e entregadores.",
    "category": "Pedidos e pagamentos",
    "stack": [
      "React",
      "TypeScript",
      "Express",
      "Mercado Pago"
    ],
    "github": "https://github.com/ThiagoVenturaV/ElsaborComPix",
    "image": "/projects/6-el-sabor-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 15,
    "title": "Monitoria GGE",
    "description": "Plataforma de monitoria acadêmica com envio de dúvidas, respostas multimídia e painéis para alunos, monitores e coordenação.",
    "category": "Monitoria acadêmica",
    "stack": [
      "Next.js",
      "Express",
      "Docker",
      "Cloudflare Workers"
    ],
    "github": "https://github.com/ThiagoVenturaV/MonitoriaGGE",
    "image": "/projects/10-monitoria-gge-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 16,
    "title": "TaskFlow",
    "description": "Gerenciador de tarefas Kanban com API em .NET, frontend Angular, Clean Architecture e controle de acesso por usuário e administrador.",
    "category": "Gestão de tarefas",
    "stack": [
      "C#",
      ".NET",
      "Angular",
      "PostgreSQL",
      "Docker"
    ],
    "github": "https://github.com/ThiagoVenturaV/TaskFlow-CRUD-.NET",
    "image": "/projects/13-taskflow-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 17,
    "title": "AVA FICR",
    "description": "API de ambiente virtual de aprendizagem para disciplinas, atividades, notas e solicitações à secretaria, desenvolvida em projeto acadêmico.",
    "category": "API educacional",
    "stack": [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Docker"
    ],
    "github": "https://github.com/ThiagoVenturaV/AVA-FICR",
    "image": "/projects/3-ava-ficr-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 18,
    "title": "Diagnóstico do Pilar",
    "description": "Dashboard territorial da Comunidade do Pilar que cruza dados socioeconômicos e geoespaciais para apoiar estudos de inclusão urbana.",
    "category": "Dados e território",
    "stack": [
      "Python",
      "Streamlit",
      "Plotly",
      "GeoPandas"
    ],
    "github": "https://github.com/ThiagoVenturaV/testaAI",
    "image": "/projects/5-diagnostico-pilar-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 19,
    "title": "Extrator de Tabelas",
    "description": "Automação local que extrai tabelas de PDFs com reconhecimento visual via Ollama e consolida os dados em planilhas Excel padronizadas.",
    "category": "Automação documental",
    "stack": [
      "Python",
      "Ollama",
      "PyMuPDF",
      "pandas",
      "OpenPyXL"
    ],
    "github": "https://github.com/ThiagoVenturaV/Extrator-de-tabela",
    "image": "/projects/8-extrator-tabelas-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 20,
    "title": "BooPay",
    "description": "Projeto do Squad 45 para comércio mediado por agentes de IA, com plataforma, plugin e landing implementados. O MVP ainda depende de validações externas.",
    "category": "Comércio com agentes de IA",
    "stack": [
      "Agentic Commerce",
      "Arquitetura",
      "Documentação"
    ],
    "github": "https://github.com/ThiagoVenturaV/Boopay",
    "image": "/projects/4-boopay-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 21,
    "title": "ResolveQA",
    "description": "Projeto colaborativo do Converge Challenge 2026 para acompanhar a resolução de bugs por agentes, com Kanban, painel administrativo e evidências. O frontend oferece modo de demonstração com dados sintéticos.",
    "category": "Agentes e qualidade de software",
    "stack": [
      "React",
      "TypeScript",
      "Python"
    ],
    "github": "https://github.com/ThiagoVenturaV/ResolveQA-front",
    "repositories": [
      {
        "label": "Backend original",
        "url": "https://github.com/moouraajv/ResolveQA"
      }
    ],
    "image": "/projects/12-resolveqa-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 22,
    "title": "Precinho",
    "description": "Interface de comércio conversacional para o contexto de farmácia, com catálogo, chat em streaming, carrinho e integração com uma API. Projeto com frontend e documentação públicos.",
    "category": "Comércio conversacional",
    "stack": [
      "Angular",
      "TypeScript",
      "SSE"
    ],
    "github": "https://github.com/ThiagoVenturaV/Precinho",
    "repositories": [
      {
        "label": "Documentação",
        "url": "https://github.com/ThiagoVenturaV/precinho-docs"
      }
    ],
    "image": "/projects/11-precinho-concept.webp",
    "imageIsIllustration": true
  },
  {
    "id": 23,
    "title": "Mahoraga Widget",
    "description": "Evolução do LibrasWidget: widget de acessibilidade em TypeScript com integração ao VLibras, leitura por voz, ajustes de contraste e ferramentas de leitura.",
    "category": "Acessibilidade web",
    "stack": [
      "TypeScript",
      "VLibras",
      "Web APIs",
      "Vite"
    ],
    "github": "https://github.com/ThiagoVenturaV/mahoraga-accessibility-widget",
    "image": "/projects/9-mahoraga-widget-concept.webp",
    "imageIsIllustration": true
  }
];
