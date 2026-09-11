# Quatro katanas, uma coreografia

O portfólio sorteia uma katana por carregamento: a original, Wadō Ichimonji, Sandai Kitetsu ou Enma. A escolha permanece durante toda a navegação, incluindo resize, novas renderizações do React e rolagem inversa. Recarregar a página faz um novo sorteio.

`src/lib/katanaVariants.ts` mantém as quatro opções e guarda a última escolha em `localStorage`, na chave `portfolio:last-katana:v1`. Na primeira visita, cada opção tem 25% de chance. Nas seguintes, o sorteio é uniforme entre as três diferentes da anterior, sem uma sequência fixa. Se o navegador bloquear armazenamento, continua sorteando entre as quatro, podendo haver repetição. Não há intervalo de troca ou mudança durante a rolagem.

## Modelos

| Opção | Arquivo | Tamanho aproximado |
| --- | --- | --- |
| Original | `public/katana-sheathed.glb` | 6,97 MB |
| Wadō Ichimonji | `public/katanas/wado.glb` | 3,93 MB |
| Sandai Kitetsu | `public/katanas/sandai.glb` | 4,57 MB |
| Enma | `public/katanas/enma.glb` | 4,15 MB |

Os arquivos da katana original foram preservados. Os três novos são derivados para web dos modelos autorais completos entregues neste trabalho, com bainha, materiais PBR e o cabo de tecido revisado da Wadō. A geometria foi reduzida para aproximadamente 118–149 mil triângulos por conjunto; as texturas foram redimensionadas e incorporadas ao GLB. Os arquivos Blender completos e suas texturas de alta resolução permanecem na entrega `zoro-katanas`, fora deste repositório.

Apenas a opção sorteada é carregada e pré-carregada. O navegador não baixa as outras três. Se o modelo escolhido falhar, a cena tenta a original; se esta também falhar, o conteúdo do portfólio permanece utilizável.

Os modelos novos usam dois grupos principais, `Katana` e `Saya`, na mesma escala e orientação da montagem original. A conversão é reproduzível com Blender 5.2:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python scripts/prepare-zoro-katanas.py -- ../zoro-katanas/models
```

`public/katanas/manifest.json` registra hashes dos modelos de origem, tamanhos, triângulos e parâmetros de encaixe. O script não altera os modelos de origem. As formas são reconstruções de fan art baseadas nas referências do anime e do [conjunto oficial PROPLICA](https://tamashiiweb.com/item/15253/?wovn=en).

## Movimento compartilhado

Todas usam `KatanaModel` e `katanaPose`, mantendo as fases, posições na página, giros, escalas responsivas, transparência da bainha e resposta à rolagem da [coreografia existente](katana-and-markdown.md). Os clipes autônomos dos modelos não são reproduzidos no site.

O único ajuste por modelo é o arco local de saque e retorno, calculado a partir da curvatura da própria lâmina para manter o encaixe na bainha. A coreografia da página e seus tempos são iguais. A opção original mantém os parâmetros anteriores. O movimento reduzido continua deixando a katana fechada na hero e ocultando-a depois dela.

## Verificação

- `npm test`: sorteio das quatro opções, exclusão da anterior, limites da coreografia, reversibilidade, encaixe, integridade dos modelos e regressões anteriores.
- `npm run build` e ESLint dos arquivos alterados.
- Navegador em 1280×720 e 390×844: quatro opções, hero, saque, posição lateral, fechamento e retorno ao início.
- Recarregamentos reais, estabilidade durante resize, movimento reduzido e fallback com falha simulada do GLB.

O aviso anterior de bundle JavaScript acima de 500 kB permanece; os GLBs são arquivos separados e apenas um é carregado por visita.
