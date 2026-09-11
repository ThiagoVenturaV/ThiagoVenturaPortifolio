# Correção do vai e volta entre hero e Sobre

## Causa reproduzida

O `onWheel` do contêiner inteiro do chat chamava `stopPropagation()` e tentava cancelar a ação nativa com `preventDefault()` em um evento React de roda passivo. O evento deixava de chegar ao Lenis, mas o navegador ainda rolava a página. O Lenis continuava a animação anterior e escrevia uma posição antiga no frame seguinte.

Captura local com roda do mouse, ao subir de Sobre à hero e então descer sobre o campo do chat:

- Primeiro impulso para baixo: posição passou de 422 para 14 px no frame seguinte (recuo indevido de 408 px).
- Segundo impulso para baixo: posição passou de 409 para 2 px (recuo de 407 px).
- Não houve frames acima de 50 ms nessa captura. O defeito reproduzido foi uma disputa pela posição do scroll, não um travamento de renderização da katana.

Havia ainda dois controladores para navegação: `scrollIntoView({ behavior: 'smooth' })` nos links e Lenis na roda. Esse segundo conflito foi removido junto com a causa reproduzida.

## Alterações

- Removido o `onWheel` manual da caixa do chat. Campo, cabeçalho e botões deixam o evento chegar ao Lenis.
- A área de mensagens mantém `data-lenis-prevent` e `overscroll-behavior: contain`: rolagem nativa dentro da conversa, sem avançar a página ao atingir o limite.
- Links internos da hero, navbar e rodapé são tratados por um único listener em `useLenis`, chamando `lenis.scrollTo`. Cliques modificados, links externos, downloads e links em outra aba não são interceptados.
- Listener e ticker são removidos no cleanup. O ref do controlador é limpo ao desmontar.
- Importado o CSS fornecido pela versão instalada do Lenis, conforme sua [documentação](https://github.com/darkroomengineering/lenis).
- Geometria e trajetória da katana permanecem iguais.

## Validação

Repetida a mesma sequência após a alteração: a página terminou em 814 px, sem os recuos de 407/408 px. O registro remanescente de 3 px coincidiu com a inversão explícita da direção da roda, no timestamp do frame anterior ao evento; não foi um salto durante a descida.

Navegação por links: Sobre chegou exatamente ao topo da seção, e o logo voltou a `scrollY = 0`, sem recuos registrados. Os únicos `scrollIntoView` capturados nessa rodada foram chamadas `instant` da ferramenta de teste para posicionar os links antes do clique; nenhum smooth nativo foi disparado pelo app.

Conversa com 40 mensagens simuladas, somente na página de diagnóstico: scroll interno chegou a 339 px e depois ao limite de 875 px, enquanto a página permaneceu em 0. Nenhuma escrita de scroll pelo Lenis durante a rolagem interna.

`npm run build` e os 9 testes existentes passaram. ESLint passou em AskAiBar, Navbar, useLenis e main. O build continua emitindo o aviso anterior sobre tamanho de bundle.

Para conferir manualmente: subir de Sobre até a hero com o cursor centralizado; inverter a roda para baixo enquanto o cursor passa pelo campo e botões do chat; repetir; testar a rolagem dentro de uma conversa longa; usar os links enquanto ainda existe inércia de scroll.

A instrumentação temporária ficou em `.qa/`, ignorada pelo Git e fora do build de produção. Nenhum endpoint ou conteúdo de teste foi adicionado ao produto.
