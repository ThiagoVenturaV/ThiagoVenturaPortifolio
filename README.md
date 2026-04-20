# 🎌 Thiago Ventura - Portfolio

Um portfólio de Desenvolvedor Web moderno, altamente imersivo e com foco em performance, inspirado profundamente na elegância da temática samurai (especificamente em menção a Roronoa Zoro de One Piece).

Este projeto combina a solidez do **React** com interações impressionantes em 3D nativas de navegador, usando **Three.js** e scroll-animations baseadas na física avançada do **GSAP**.

## 🚀 Principais Features

- **Katana 3D Dinâmica (WebGL):** Modelo 3D interativo de uma espada (Katana) renderizada via Fiber, que acompanha suavemente a rolagem do usuário ao longo das 5 seções do site, reagindo de forma orgânica a redimensionamentos sem perdas (`frustumCulled` fixado) nas mais diversas resoluções de tela (_Viewports_).
- **Responsive Mobile-First:** A experiência flui perfeitamente desde celulares minúsculos até monitores ultra-wide. O Menu Mobile adota uma modernização limpa de **Glassmorphism modal** para economia inteligente do espaço real (Screen Estate).
- **Animações Cinematográficas:** Transições de letreiros letra a letra controladas por ref (`innerHTML.split()`), revelações robustas por rolagem (`ScrollTrigger`) e um moderno e belo Preloader Dourado blindando o site em seus primeiros milissegundos críticos.
- **Efeitos e Micro-interações:** Interações de hover refinadas que geram trilhos dourados estilo lâmina ("Slashes") em C-Level CTA buttons, e um fluido e denso carrossel manual avançado reescrevendo a listagem de projetos passados baseada em arrasto, scroll e toques.
- **Ask AI com Groq + RAG:** Barra de conversa no Hero com inferência via modelo **llama-3.3-70b-versatile**, usando base de conhecimento local para responder como Thiago e entregar redes de contato durante o papo.

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
   🚨 Agora esse comando sobe o frontend e a API local ao mesmo tempo. O navegador abrirá algo similar a `http://localhost:5173/`.

## 📧 Configurando o EmailJS (Formulario de Contato)

O projeto ja possui integracao com o pacote `@emailjs/browser` no componente de contato.

1. Crie conta em [EmailJS](https://www.emailjs.com/) e faça login.
2. Em `Email Services`, conecte seu e-mail (Gmail, Outlook etc.) e copie o `Service ID`.
3. Em `Email Templates`, crie um template e copie o `Template ID`.
4. No template, use as variaveis abaixo (iguais aos `name` dos campos do formulario):
   - `{{user_name}}`
   - `{{user_email}}`
   - `{{message}}`
5. Em `Account > General`, copie sua `Public Key`.
6. Na raiz do projeto, crie um arquivo `.env.local` com base no `.env.example`:

   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
   ```

7. Reinicie o servidor (`npm run dev`) e teste o envio pelo formulario.

Se der erro no envio, abra o console do navegador para verificar se alguma variavel de ambiente nao foi preenchida.

## 🤖 Configurando Ask AI (Groq + RAG)

O chat IA do Hero depende de uma API local em Node + Express (`server/index.js`) e de uma base RAG em `server/data/knowledge-base.json`.

Em producao no Vercel, o projeto usa funcoes serverless nativas em `api/chat.js` e `api/health.js`.

1. Crie um arquivo `.env.local` (ou `.env`) na raiz com base em `.env.example`.
2. Preencha ao menos os campos abaixo:

   ```env
   GROQ_API_KEY=sua_chave_groq
   GROQ_MODEL=llama-3.3-70b-versatile
   PORT=8787
   RAG_TOP_K=4
   ```

3. Rode o projeto com:

   ```bash
   npm run dev
   ```

4. Teste a saude da API em `http://localhost:8787/api/health`.
5. No site, use a barra **ASK AI** na Hero para conversar sobre stack, experiencia e contatos.

### Personalizando o RAG

- Edite `server/data/knowledge-base.json` para ajustar tom, historias, experiencias e links.
- O ranking de contexto usa busca lexical em `server/rag/retriever.js`.
- Se quiser respostas mais longas ou mais curtas, ajuste `temperature` e `max_tokens` em `server/index.js`.

### Variaveis no Vercel

No painel do Vercel, para a IA funcionar, configure estas variaveis:

- `GROQ_API_KEY`
- `GROQ_MODEL` (opcional, existe fallback para `llama-3.3-70b-versatile`)
- `RAG_TOP_K` (opcional, existe fallback para `4`)

## 📜 Propriedade & Licenciamento Interno

Concebido como um artefato vivo de código contábil pessoal e demonstrativo de proficiência Front-end. Projetado, desenhado por design system em código puro e refinado exaustivamente por este mantenedor. (Citações visuais, logos, bibliotecas gráficas ou malhas geométricas estão amparadas em seus licenciamentos abertos ou originais).
© Thiago Ventura.
