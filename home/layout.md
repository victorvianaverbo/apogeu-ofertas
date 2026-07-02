# Layout - Home | Ecossistema Apogeu do Palestrante

> Especificação de Diretor de Arte para /desenvolver.
> Base: copy.md + design aprovado (Hero + Seção 01 já em index.html/style.css).
> Identidade 100% Apogeu. O Avantik entra só como link/cartão de destino (identidade Avantik ali).

---

## Linguagem Visual Global (já estabelecida no design aprovado)

### Tokens (usar EXATAMENTE — já no :root de home/style.css)
```
--brasa-400:#FBB44C; --brasa-500:#ED7D2B; --brasa-600:#D9641A; --brasa-700:#B23E0C;
--grafite-950:#141417; --grafite-900:#1C1C20; --grafite-700:#3A3A42; --grafite-500:#5C5C66; --grafite-400:#8A8A94;
--marfim:#F6F4F1; --areia:#ECE8E2; --nevoa:#CFCBC4; --muted-bg:#FBFAF8;
--brasa-grad:linear-gradient(135deg,#FBB44C,#ED7D2B 50%,#C2470F);
--serif:Cormorant Garamond; --label:Jost; --ui:Hanken Grotesk;
--maxw:1200px; --pad:clamp(1.25rem,5vw,2.5rem);
--ease-out:cubic-bezier(0.16,1,0.3,1); --ease-spring:cubic-bezier(0.34,1.56,0.64,1);
```
Cores Avantik (SOMENTE no bloco de conexão Avantik): roxo `#2E2B5F`, dourado `#E8B931` / hover `#D4A522`, texto `#64748B`, fundo claro `#FFFFFF`/`#FAFAF9`.

### Componentes prontos (reusar de style.css): `.eyebrow` (+`--dark`), `.btn`/`.btn--primary`/`.btn--ghost`/`.btn--sm`, motivo de xadrez mascarado (`.hero::before`), `[data-reveal]` (IntersectionObserver já no index.html).

### Alternância de dobras (fundo)
Hero DARK → 01 claro(marfim) → **02 DARK** → **03 claro** → **04 DARK** → **05 claro (cartão Avantik)** → **06 DARK poster** → footer DARK.
Regra: nunca repetir arquétipo em seções consecutivas.

### Assets: `/assets/logo-apogeu-branco.png`, `/assets/logo-avantik.png`, `/assets/perfil.png`, `/favicon.svg`. Servir imagens via Netlify Image CDN no /desenvolver (`/.netlify/images?url=...&w=...&q=80`).

---

## Seção 0: HERO — JÁ IMPLEMENTADO (preservar)
Split Assimétrico | headline serif + em brasa, foto com nested frame, xadrez+brasa. Não reescrever.

## Seção 01: POR QUE O APOGEU EXISTE — JÁ IMPLEMENTADO (preservar)
Editorial 2 colunas (título sticky + corpo), fundo marfim, virada em brasa. Não reescrever.

---

## Seção 02: A JORNADA (as 3 ofertas) — núcleo (DARK)

### Arquetipo e Constraints
- Arquetipo: **Scroll Storytelling / Trilha numerada** (3 passos conectados por uma linha vertical de brasa — o "caminho" do palestrante)
- Constraints: **Timeline/linha condutora** (Estrutura), **Números com stroke** (Tipografia), **Dark Mode + xadrez** (Cor), **Hover Lift + brilho brasa** (Interação)
- Justificativa: a jornada É uma sequência (grátis → R$47 → evento). Uma trilha vertical com passos numerados dá progressão e evita "3 cards lado a lado". Cada passo é um card que leva à landing real.

### Conteúdo (exato)
- Eyebrow: `A jornada`  | Título: `Por onde você começa`
- Intro: `Três passos pensados pra te tirar do campo da ideia e te colocar no campo do resultado. Comece de graça e avance no seu ritmo.`
- Passo 1 — etiqueta `Passo 1 · Gratuito` — `O Jogo do Palestrante` — `Um diagnóstico de 2 minutos que lê o seu tabuleiro e mostra em que fase da carreira você está e qual é a sua próxima jogada.` — CTA `Fazer meu diagnóstico` → `/diagnostico/`
- Passo 2 — etiqueta `Passo 2 · R$ 47` — `Desvendando o Mercado de Palestras` — `A aula-mapa de onde está o dinheiro do mercado no Brasil: empresas, Sistema S, CDL, licitações, conselhos e congressos. O passo a passo de quem prospectar e como precificar.` — CTA `Quero o mapa` → `/desvendando/`
- Passo 3 — etiqueta `Passo 3 · Presencial` — `Encontro Entre Palestrantes — Belvedere` — `Uma noite ao vivo em Belo Horizonte com bastidor real, números reais e networking qualificado. 08 de julho, no Belvedere.` — CTA `Garantir minha vaga` → `/encontro/`
- Fecho: `Cada passo te aproxima de uma carreira que não depende de sorte.`

### Layout
- Section `.jornada`: fundo `radial-gradient(85% 60% at 50% 0%, #26262C, var(--grafite-950) 72%)`; xadrez `::before` (specs do hero, opacity 0.05, mask `70% 60% at 50% 15%`); `padding: clamp(5rem,11vw,8rem) var(--pad)`.
- Head centrado, `max-width:760px; margin:0 auto`; título Cormorant 600 `clamp(2.2rem,5vw,3.6rem)` cor `--marfim`; intro `--nevoa` max-width 52ch.
- Trilha: `max-width:820px; margin: clamp(3rem,6vw,4.5rem) auto 0; position:relative;`
  - Linha condutora: `::before` absoluto `left:2.1rem; top:1rem; bottom:5rem; width:2px; background: linear-gradient(to bottom, var(--brasa-500), rgba(237,125,43,0.12));`
  - Passo (`.step`): grid `grid-template-columns: 4.2rem 1fr; gap:1.4rem; padding: 0 0 clamp(2rem,4vw,3rem);`
    - Nó/número: círculo 4.2rem, `border:2px solid rgba(237,125,43,0.5); background:var(--grafite-950);` com número `01/02/03` Cormorant 600 `1.6rem` cor transparent + `-webkit-text-stroke:1.4px var(--brasa-500)`. Ao `.is-in`: preenche fundo com `rgba(237,125,43,0.12)` + glow `0 0 18px rgba(237,125,43,0.4)`.
    - Card do passo: `background:linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025)); border:1px solid rgba(255,255,255,0.12); border-radius:1.25rem; padding:clamp(1.4rem,3vw,2rem); backdrop-filter:blur(8px);`
      - Etiqueta: Jost 600 `0.66rem` uppercase ls 0.16em cor `--brasa-400`
      - Título: Cormorant 600 `clamp(1.5rem,2.4vw,2rem)` cor `--marfim`
      - Descrição: Hanken `0.98rem` cor `--nevoa` line-height 1.5, max-width 48ch
      - CTA: link Jost 600 `0.82rem` uppercase ls 0.06em cor `--brasa-400` + seta SVG; hover translateX(4px)
- Fecho: Cormorant 600 itálico `clamp(1.3rem,2vw,1.6rem)` cor `--brasa-400` centrado, `max-width:30ch; margin:clamp(2.5rem,5vw,3.5rem) auto 0`.

### Animações / Interação
- Cada `.step` `data-reveal` fade-up 700ms stagger 120ms; nó pulsa uma vez ao entrar (`box-shadow 0 0 0 0 → 0 0 0 12px transparent`, 900ms).
- Card hover (desktop): `translateY(-4px)` + border `rgba(237,125,43,0.5)` + `box-shadow:0 16px 40px rgba(0,0,0,0.4),0 0 26px rgba(237,125,43,0.12)`, 380ms.
- A linha condutora pode preencher com o scroll (opcional, mesma técnica da timeline do encontro; fallback: linha estática já visível).

### Responsividade
- ≤640px: colunas `3.4rem 1fr`; número `1.3rem`; título card `1.5rem`; linha condutora `left:1.7rem`.

---

## Seção 03: OS 4 PILARES (metodologia) — claro

### Arquetipo e Constraints
- Arquetipo: **Bento Box / Quadrantes** (2×2, uma célula-destaque)
- Constraints: **Color Blocking** (uma célula grafite entre as claras) (Cor), **Numeração grande stroke** (Tipografia), **Hover Fill / underline animado** (Interação)
- Justificativa: 4 itens irmãos pedem grade; quadrantes 2×2 com uma célula-destaque grafite quebram a simetria e evitam "4 cards iguais". NÃO usar ícones genéricos.

### Conteúdo (exato)
- Eyebrow `--dark`: `Método` | Título: `Os 4 pilares de quem vive de palco`
- Intro: `Palestrante profissional não é feito de talento solto. É construído sobre quatro pilares. É neles que o Apogeu trabalha a sua evolução.`
- Pilar 01 **Conteúdo** — `O que você fala` — `Estruturar palestras que prendem, com narrativa, dados e uma mensagem que fica.`
- Pilar 02 **Performance** — `Como você fala` — `Oratória, presença de palco e improviso. O domínio que transforma a sala.`
- Pilar 03 **Apresentação** — `Como você se mostra` — `Fotos, vídeos e materiais que fazem o cliente te levar a sério antes de te ver no palco.`
- Pilar 04 **Posicionamento** — `Como você é percebido` — `Marca pessoal, nicho e autoridade. O que faz o cliente procurar você, e não o contrário.`

### Layout
- Section `.pilares`: fundo `var(--marfim)`, xadrez sutil claro (como `.porque::before`), `padding: clamp(5rem,11vw,8rem) var(--pad)`.
- Head centrado max-width 760px; título Cormorant 600 `clamp(2.2rem,5vw,3.6rem)` cor `--grafite-900`; intro `--grafite-700` max-width 54ch.
- Grade: `max-width:960px; margin: clamp(3rem,6vw,4rem) auto 0; display:grid; grid-template-columns:repeat(2,1fr); gap:1.1rem;`
  - Célula (`.pilar`): `background:var(--marfim)... na verdade #FFFFFF; border:1px solid var(--areia); border-radius:1.25rem; padding:clamp(1.8rem,3vw,2.4rem); min-height:210px; display:flex; flex-direction:column;`
    - Número `01`–`04`: Cormorant 600 `clamp(2.4rem,3.5vw,3rem)` cor transparent `-webkit-text-stroke:1.4px var(--brasa-500)`; margin-bottom auto.
    - Nome: Cormorant 600 `clamp(1.6rem,2.4vw,2.1rem)` cor `--grafite-900`.
    - Subtítulo ("O que você fala"): Jost 600 `0.68rem` uppercase ls 0.14em cor `--brasa-600`, margem 0.2rem 0 0.6rem.
    - Descrição: Hanken `0.98rem` cor `--grafite-700` line-height 1.5.
  - **Célula-destaque** = Pilar 01 (Conteúdo): `background:var(--grafite-900); color:var(--marfim);` número stroke `--brasa-400`; nome `--marfim`; descrição `--nevoa`. (color blocking)
- Underline animado: `.pilar::after` barra 2px brasa `left:padding; bottom:0; width:0 → 2.4rem` no hover.

### Animações / Interação
- Células `data-reveal` stagger 90ms.
- Hover (não destaque): `translateY(-6px)` + `box-shadow:0 20px 46px rgba(20,20,23,0.10)` + border `rgba(237,125,43,0.4)`; underline cresce. Destaque hover: `translateY(-6px)` + glow brasa sutil.

### Responsividade
- ≤720px: `grid-template-columns:1fr;` a célula-destaque perde a posição especial (vira card normal grafite). Padding `1.6rem`.

---

## Seção 04: QUEM CONDUZ — BRUNO BETTINI (DARK)

### Arquetipo e Constraints
- Arquetipo: **Split Assimétrico invertido** (conteúdo à esquerda, foto à direita) MAS com tratamento diferente do hero: aqui a foto é menor, em recorte com moldura, e o foco são as **credenciais em chips + citação**.
- Constraints: **Nested Frame** na foto (Layout), **Dark + xadrez** (Cor), **Hover nos chips** (Interação)
- Justificativa: dá rosto e autoridade ao ecossistema. Difere do hero por priorizar chips de credencial e uma citação editorial (não bullets/CTA).

### Conteúdo (exato)
- Eyebrow: `Quem conduz` | Nome (h2): `Bruno Bettini`
- Parágrafos:
  1. `Fundador da Avantik Palestras e do Apogeu do Palestrante. Bruno vive desse mercado e forma palestrantes que vivem dele.`
  2. `Já participou de licitações milionárias, ganhou editais de órgãos públicos e conhece por dentro como o dinheiro circula em cada canto: empresa privada, sistema S, CDL, conselhos, secretarias, congressos e bancos de palestrantes.` (destacar `licitações milionárias` e `editais` com cor brasa)
  3. Citação (destaque): `Não trabalho com promessa de fim de semana. Trabalho com construção.`
- Chips: `Licitações milionárias` · `Editais públicos ganhos` · `Sistema S` · `CDL e CACB` · `Conselhos (CREA, CRM)` · `Grandes congressos`

### Layout
- Section `.bio` dark: mesmo fundo/xadrez da Jornada; `padding: clamp(5rem,11vw,8rem) var(--pad)`.
- Inner: `max-width:var(--maxw); margin:0 auto; display:grid; grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr); gap:clamp(2.5rem,6vw,5rem); align-items:center;`
  - Conteúdo à esquerda: nome Cormorant 600 `clamp(2.6rem,6vw,4rem)`; parágrafos Hanken `clamp(1.02rem,1vw+0.85rem,1.15rem)` cor `--nevoa` max-width 52ch; citação Cormorant 600 itálico `clamp(1.4rem,2.2vw,1.8rem)` cor `--brasa-400`, border-left `2px solid var(--brasa-500)`, padding-left 1.2rem, margin-top 1.6rem.
  - Chips: Jost 600 `0.8rem` cor `--marfim`, `background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); border-radius:100px; padding:0.42rem 0.9rem`; hover `translateY(-2px)` + border `--brasa-500`.
  - Foto à direita: `width:min(360px,80vw); aspect-ratio:4/5; margin:0 auto;` nested frame (`::before`-like span, `translate(16px,16px)`, border brasa, radius 1.4rem); imagem `object-fit:cover; radius:1.4rem`.

### Animações / Responsividade
- Foto `data-reveal` fade-left; parágrafos/chips stagger 80ms.
- ≤880px: coluna única, foto em cima (`order:-1`, max-width 300px centrada), texto centralizado; citação centralizada sem border-left (usar border-top).

---

## Seção 05: CONEXÃO COM O ECOSSISTEMA AVANTIK (cartão claro Avantik dentro do dark)

### Arquetipo e Constraints
- Arquetipo: **Spotlight / Framed Content** (um cartão claro "da marca Avantik" iluminado sobre fundo grafite)
- Constraints: **Color Blocking / Selective Color** (o único bloco com identidade Avantik: dourado+roxo em fundo claro) (Cor), **Glassmorphism/elevação** (Efeitos), **Hover Lift dourado** (Interação)
- Justificativa: é o ponto de conexão com a marca irmã. O cartão claro com logo/cores Avantik "salta" e comunica visualmente a passagem de um ecossistema pro outro — exatamente como na bio. NÃO trazer roxo/dourado pra fora deste cartão.

### Conteúdo (exato)
- Título (sobre o fundo dark, antes do cartão): `Depois de se posicionar, ganhe palco.`
- Cartão Avantik:
  - Eyebrow no cartão: `Ecossistema Avantik` (roxo `#2E2B5F`)
  - Logo Avantik (`/assets/logo-avantik.png`) altura ~30px
  - Texto: `O Apogeu forma. A Avantik conecta. Quando você constrói posicionamento e autoridade, o próximo passo é ser encontrado por quem contrata. A Avantik Palestras é o marketplace que liga empresas, RH e organizadores aos palestrantes certos, em todo o Brasil.`
  - CTA: `Conhecer a Avantik Palestras` → `https://avantikpalestras.com.br` (target _blank), botão com cores Avantik (fundo dourado `#E8B931`, texto `#2E2B5F`; hover `#D4A522`).

### Layout
- Section `.avantik-eco`: fundo `var(--grafite-950)`, `padding: clamp(5rem,11vw,8rem) var(--pad)`; centrado.
- Título dark: Cormorant 600 `clamp(2rem,4.5vw,3.2rem)` cor `--marfim`, centrado, max-width 20ch, margin-bottom clamp(2rem,4vw,2.8rem).
- Cartão: `max-width:720px; margin:0 auto; background:linear-gradient(180deg,#FFFFFF,#FAFAF9); border:1px solid rgba(232,185,49,0.5); border-radius:1.5rem; padding:clamp(2rem,5vw,3rem); text-align:center; box-shadow:0 30px 70px rgba(0,0,0,0.45), 0 0 50px rgba(232,185,49,0.10);`
  - Fio dourado no topo do cartão (`::after` 2px `linear-gradient(90deg,transparent,#E8B931,transparent)`).
  - Eyebrow roxo Jost 600 0.66rem ls 0.2em; logo Avantik centralizado; texto Hanken `1.02rem` cor `#64748B` max-width 46ch centrado; CTA `.btn` cores Avantik `padding:0.95rem 1.8rem`.

### Animação / Interação / Responsividade
- Cartão `data-reveal` scale(0.97)→1 + fade 800ms.
- Hover CTA: `translateY(-3px)` + shadow dourado. Hover cartão (opcional): borda `#E8B931`.
- ≤540px: cartão padding `1.6rem`.

---

## Seção 06: CTA FINAL (poster DARK)

### Arquetipo e Constraints
- Arquetipo: **Poster / Type Hero** (tipografia dramática, ghost words ao fundo)
- Constraints: **Ghost/stroke words gigantes** (Tipografia), **brilho brasa** (Cor), **Reveal por linha** (Movimento)
- Justificativa: fecha em tom de manifesto, coerente com os CTAs finais das landings (família). Diferente das seções anteriores.

### Conteúdo (exato)
- Eyebrow: `Última chamada`
- Título (3 linhas reveladas): `O jogo já está` / `acontecendo.` / `A pergunta é onde você está nele.` (com `você` em brasa itálico)
- Texto: `Todos os dias, em todo o Brasil, empresas contratam palestrantes. A dúvida não é se há mercado, é se você está enxergando o seu lugar nele. Comece pelo diagnóstico. Em 2 minutos, de graça, você descobre em que fase do jogo está e qual é a sua próxima jogada.`
- CTA: `Fazer meu diagnóstico gratuito` → `/diagnostico/`
- Microcopy: `Grátis. 2 minutos. Resultado na hora.`
- Ghost words: `tabuleiro` (top -2%, left -3%, 14vw), `negócio` (bottom 4%, right -2%, 18vw), `palco` (mid, 11vw).

### Layout
- Section `.final`: `min-height:88svh; display:flex; align-items:center;` fundo `radial-gradient(70% 90% at 50% 55%, #26262C, var(--grafite-950) 80%)`; overflow hidden.
- Ghosts absolutos Cormorant `color:rgba(255,255,255,0.04)`; parallax leve opcional (rAF, fator 0.05–0.09) — respeitar reduced-motion.
- Inner centrado max-width 780px: título Cormorant 600 `clamp(2.6rem,8vw,5.5rem)` line-height 0.98 cor `--marfim` (spans reveal-line com translateY(100%)→0, delays 50/180/310ms); texto Hanken `clamp(1.05rem,1vw+1rem,1.25rem)` cor `--nevoa` max-width 54ch; CTA `.btn--primary .btn--lg`; microcopy Jost `0.85rem` cor `--nevoa`.

### Responsividade
- ≤540px: ghost do meio oculto; título `clamp(2.4rem,10vw,3.2rem)`.

---

## Footer (DARK)

- `background:var(--grafite-950); border-top:1px solid rgba(255,255,255,0.08); padding: clamp(3rem,6vw,4rem) var(--pad) 2.5rem;`
- Topo: logo Apogeu branco (altura ~40px) à esquerda; à direita nav inline (Jost 0.85rem cor `--nevoa`): `Diagnóstico` `/diagnostico/` · `Desvendando` `/desvendando/` · `Encontro` `/encontro/` · `Avantik` (externo).
- Linha de apoio: `Instagram @apogeudopalestrante` (link brasa) + `Belo Horizonte - MG`.
- Base (Jost 0.72rem cor `--grafite-500`): `Apogeu do Palestrante · Bruno Bettini`.
- ≤640px: empilhar (logo em cima, nav em coluna, base embaixo).

---

## Checklist de implementação (/desenvolver)
1. Preservar Hero + Seção 01 (só adicionar seções 02–06 + footer no fluxo do `<main>`).
2. Reusar tokens/componentes já em style.css (eyebrow, btn, xadrez, reveal). Adicionar CSS das novas seções ao style.css.
3. Alternância de dobras conforme especificado (dark/claro).
4. Imagens (perfil, logos) via Netlify Image CDN com width/height; `loading="lazy"` (hero eager já ok).
5. `prefers-reduced-motion`: desligar parallax dos ghosts e pulses.
6. Todos os CTAs internos → rotas reais (`/diagnostico/`, `/desvendando/`, `/encontro/`); Avantik → `https://avantikpalestras.com.br` (target _blank rel noopener).
7. Identidade Avantik (roxo/dourado/fundo claro) SÓ na Seção 05. Resto 100% Apogeu.
8. Sem emojis. PT-BR acentuado correto.
9. No /desenvolver: ajustar netlify.toml — servir esta home na raiz `/` (rewrite 200 → /home/index.html) e REMOVER o redirect 302 `/`→/diagnostico; adicionar redirect 301 `/bio`→`/bio/`.

## Variedade de arquétipos (conferência)
Hero: Split · 01: Editorial 2-col · 02: Trilha/Timeline · 03: Bento 2×2 · 04: Split invertido · 05: Spotlight/Framed · 06: Poster. Nenhum repetido em seções consecutivas.
