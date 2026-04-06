# 🎌 Thiago Ventura - Portfolio

Um portfólio de Desenvolvedor Web moderno, altamente imersivo e com foco em performance, inspirado profundamente na elegância da temática samurai (especificamente em menção a Roronoa Zoro de One Piece). 

Este projeto combina a solidez do **React** com interações impressionantes em 3D nativas de navegador, usando **Three.js** e scroll-animations baseadas na física avançada do **GSAP**.

## 🚀 Principais Features

- **Katana 3D Dinâmica (WebGL):** Modelo 3D interativo de uma espada (Katana) renderizada via Fiber, que acompanha suavemente a rolagem do usuário ao longo das 5 seções do site, reagindo de forma orgânica a redimensionamentos sem perdas (`frustumCulled` fixado) nas mais diversas resoluções de tela (*Viewports*).
- **Responsive Mobile-First:** A experiência flui perfeitamente desde celulares minúsculos até monitores ultra-wide. O Menu Mobile adota uma modernização limpa de **Glassmorphism modal** para economia inteligente do espaço real (Screen Estate).
- **Animações Cinematográficas:** Transições de letreiros letra a letra controladas por ref (`innerHTML.split()`), revelações robustas por rolagem (`ScrollTrigger`) e um moderno e belo Preloader Dourado blindando o site em seus primeiros milissegundos críticos.
- **Efeitos e Micro-interações:** Interações de hover refinadas que geram trilhos dourados estilo lâmina ("Slashes") em C-Level CTA buttons, e um fluido e denso carrossel manual avançado reescrevendo a listagem de projetos passados baseada em arrasto, scroll e toques.

## 💻 Tech Stack

- **[React 18](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**: O motor centralizado da UI, amparado por tipagem estática absoluta e arquitetura modular de alto nível.
- **[Vite](https://vitejs.dev/)**: O Bundler da nova geração, rodando o desenvolvimento através de HMR (Hot Module Replacement) instantâneo.
- **[Three.js](https://threejs.org/)** / **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** / **[@drei]**: Motor de computação de profundidades WebGL 3D otimizado via declaratividade em componentes JSX, cuidando inteiramente do render, sombras, lightbaking e posições reativas.
- **[GSAP](https://gsap.com/)**: Biblioteca premium de animações complexas em JavaScript de alta fluidez cuidando das animações contidas e tracking de frames do usuário pela página.
- **[Lenis](https://lenis.studiofreight.com/)**: Ferramenta de scroll contínuo e responsivo, normalizando as rolagens desajeitadas para frames suavizados e sedosos de computadores Desktop.
- **[react-icons](https://react-icons.github.io/react-icons/)**: Importação de biblioteca vetorial polimorfa e inteligente (`import { SiReact, SiDocker } from 'react-icons/si'`). Evitando sobrecarga dom via SVG bruto e elevando a performance extrema de leitura.

## 🗂 Arquitetura de Views Padrão

A navegação foi formatada em Single Page e é estruturalmente regida da seguinte forma:
- `Hero` (/): Entrada principal magnética. Destila estética afiada, tipografia ousada, e engata a primeira impressão assim que o background preloader desaparece.
- `About` (/sobre): Narrativa técnica conectada orgânica no painel grid de 12 chaves em tecnologias mapeadas. 
- `Skills` (/habilidades): Profundidade listada separando os conhecimentos em trilhos horizontais com hard-features.
- `Projects` (/projetos): Galeria flexível disposta nos painéis estilo card em loop e controles responsivos.
- `Contact` (/contato): Formulário de contato direto e imersivo flertando com uma fina requintagem do design estético global da ponta da espada e um encerramento formidável pelo Footer premium alinhado à risca.

## 🛠 Como Rodar Plenamente Este Projeto em Máquina Local

Se deseja forkar, auditar código, inspecionar a modelagem 3D ou buildá-lo localmente para estudos, confira como executar abaixo:

1. Você pode iniciar efetuando o Clone deste repositório da web:
   ```bash
   git clone https://github.com/ThiagoVenturaV/ThiagoVenturaPortifolio.git
   ```

2. Redirecione o terminal para ficar detentor ativo na base do workspace e adicione os binários principais com o instaldor Node:
   ```bash
   cd ThiagoVenturaPortifolio
   npm install
   ```

3. Gire a chave de servidor providenciada pelo Vite:
   ```bash
   npm run dev
   ```
   🚨 O seu terminal providenciará algo similar a `http://localhost:5173/`, é só acessá-lo no Browser (F12 Recomendado) e contemplar!

## 📜 Propriedade & Licenciamento Interno

Concebido como um artefato vivo de código contábil pessoal e demonstrativo de proficiência Front-end. Projetado, desenhado por design system em código puro e refinado exaustivamente por este mantenedor. (Citações visuais, logos, bibliotecas gráficas ou malhas geométricas estão amparadas em seus licenciamentos abertos ou originais). 
© Thiago Ventura.
