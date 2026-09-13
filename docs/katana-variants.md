# Quatro katanas, uma coreografia

O portfólio sorteia uma katana por carregamento: a original, Wadō Ichimonji, Sandai Kitetsu ou Enma. A escolha permanece durante toda a navegação, incluindo resize, novas renderizações do React e rolagem inversa. Recarregar a página faz um novo sorteio.

`src/lib/katanaVariants.ts` mantém as quatro opções e guarda a última escolha em `localStorage`, na chave `portfolio:last-katana:v1`. Na primeira visita, cada opção tem 25% de chance. Nas seguintes, o sorteio é uniforme entre as três diferentes da anterior, sem uma sequência fixa. Se o navegador bloquear armazenamento, continua sorteando entre as quatro, podendo haver repetição. Não há intervalo de troca ou mudança durante a rolagem.

## Modelos

| Opção | Arquivo | Tamanho aproximado |
| --- | --- | --- |
| Original | `public/katana-sheathed.glb` | 6,97 MB |
| Wadō Ichimonji | `public/katanas/wado.glb` | 32,91 MB |
| Sandai Kitetsu | `public/katanas/sandai.glb` | 32,28 MB |
| Enma | `public/katanas/enma.glb` | 23,54 MB |

Os três GLBs novos são cópias exatas dos modelos autorais completos: geometria, texturas na resolução original, materiais PBR, bainhas, controles e clipes de animação. Não há redução de polígonos nem recompressão de imagens. Wadō tem 622.920 triângulos; Sandai, 413.824; Enma, 240.802. O tecido revisado do cabo da Wadō está incluído. Os arquivos da katana original do portfólio também foram preservados.

As lâminas preservam seus 4.108 triângulos. Um teste nos GLBs finais verifica que cada lâmina é uma única superfície fechada, sem buracos nem fragmentos desconectados. Outro compara o SHA-256 do arquivo publicado com o hash do modelo de origem registrado no manifesto. As URLs usam `?v=master-1` para evitar reutilizar versões reduzidas do cache do navegador.

Apenas a opção sorteada é carregada e pré-carregada. O navegador não baixa as outras três. A fidelidade completa aumenta o download inicial e o uso de memória/GPU; o tempo depende da conexão e do aparelho. Se o modelo escolhido falhar, a cena tenta a original; se esta também falhar, o conteúdo do portfólio permanece utilizável.

`katanaAssetParts` adapta os controles nativos `Sword_CTRL` e `Saya_CTRL` à escala e orientação da montagem do portfólio. A transformação acontece nos grupos em tempo de execução, sem reescrever malhas ou texturas. Para sincronizar os GLBs completos:

```powershell
node scripts/sync-zoro-katanas.mjs ../zoro-katanas/models
```

`public/katanas/manifest.json` registra hashes dos modelos de origem, tamanhos, triângulos e parâmetros de encaixe. O script copia os bytes sem converter os arquivos. Os arquivos Blender editáveis e suas texturas também permanecem na entrega `zoro-katanas`, fora deste repositório. As formas são reconstruções de fan art baseadas nas referências do anime e do [conjunto oficial PROPLICA](https://tamashiiweb.com/item/15253/?wovn=en).

## Iluminação

As três novas usam um ambiente de estúdio com preenchimento neutro controlado e painéis laterais estreitos. A intensidade e a área dos painéis frontais, assim como a luz ambiente e as luzes diretas, foram reduzidas para evitar o aspecto esbranquiçado nas bainhas e no tecido. O ambiente mantém uma base de reflexão para que o aço continue legível durante o giro, com luz lateral para marcar suas bordas. O mapa de iluminação é gerado localmente uma vez; não depende do download de um HDR externo. Ele ilumina os materiais sem mudar o fundo do site. Os valores originais de cor, metalicidade, rugosidade e texturas são preservados. A katana original mantém sua iluminação anterior.

## Movimento compartilhado

Todas usam `KatanaModel` e `katanaPose`, mantendo as fases, posições na página, giros, escalas responsivas, transparência da bainha e resposta à rolagem da [coreografia existente](katana-and-markdown.md). Os clipes autônomos dos modelos não são reproduzidos no site.

O único ajuste por modelo é o arco local de saque e retorno, calculado a partir da curvatura da própria lâmina para manter o encaixe na bainha. A coreografia da página e seus tempos são iguais. A opção original mantém os parâmetros anteriores. O movimento reduzido continua deixando a katana fechada na hero e ocultando-a depois dela.

## Verificação

- `npm test`: sorteio das quatro opções, exclusão da anterior, limites da coreografia, reversibilidade, encaixe, hashes dos modelos completos, transformação do rig, superfície fechada das lâminas e regressões anteriores.
- `npm run build` e ESLint dos arquivos alterados.
- Navegador em 1280×720 e 390×844: quatro opções, hero, saque, posição lateral, fechamento e retorno ao início.
- Inspeção das três lâminas expostas e dos materiais sob a iluminação usada na animação do portfólio.
- Recarregamentos reais, estabilidade durante resize, movimento reduzido e fallback com falha simulada do GLB.

O aviso anterior de bundle JavaScript acima de 500 kB permanece; os GLBs são arquivos separados e apenas um é carregado por visita.
