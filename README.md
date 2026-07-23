# quantic-computing

Um "post-mortem técnico" de uma execução em QPU que parece 100% sério… até a
pessoa ignorar os quatro avisos de **NÃO ROLE ATÉ O FINAL** e clicar no botão
que claramente não deveria clicar. 🎣

Site estático puro — HTML + CSS + JS vanilla, sem build step, sem dependências
(só a fonte JetBrains Mono via Google Fonts).

## Estrutura

| Arquivo      | O que faz                                                        |
| ------------ | ---------------------------------------------------------------- |
| `index.html` | Esqueleto da página (terminal, zona final, overlays)              |
| `styles.css` | Estética de terminal, CRT/scanlines, avisos, botão, glitch        |
| `script.js`  | Boot sequence, renderização do log, shake de scroll, a armadilha  |
| `content.js` | **Toda a isca**: narrativa, avisos, textos do botão e vídeo-alvo  |

## Como trocar a pegadinha (reuso futuro)

Edite apenas `content.js`:

- `boot` / `log` — a narrativa (qualquer tema técnico, mesmo formato de linhas)
- `finalZone` — selo, rótulos do botão (normal + glitchados) e micro-copy
- `videoId` — o vídeo-alvo do YouTube
- `reveal` — o "Você caiu 🎣" que pisca sobre o vídeo (desligue com `enabled: false`)

Também dá para trocar o vídeo sem editar nada, via query string:
`https://seu-site.vercel.app/?v=OUTRO_ID_DO_YOUTUBE`

## Deploy na Vercel

1. [vercel.com/new](https://vercel.com/new) → importe este repositório
2. Framework preset: **Other** · sem build command · output: raiz
3. Deploy. Pronto — `https://quantic-computing.vercel.app` (ou similar)

Sem backend, sem variáveis de ambiente, sem functions.

## Detalhes de implementação

- Mobile-first (projetado para ~375–430px), fonte base 16px, botão ≥60px de altura
- O iframe do YouTube só entra no DOM **depois do clique** (nada de spoiler no
  view-source) e é injetado dentro do gesto de toque para o autoplay funcionar
  no mobile
- `prefers-reduced-motion` desliga glitch/shake/flicker e mostra tudo estático
- Vermelho (`#ff3333`) é reservado exclusivamente aos avisos e ao botão final —
  o resto do terminal é verde/cinza/âmbar para o perigo destoar de verdade
