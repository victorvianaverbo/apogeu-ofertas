# Layout — Dominando o Mercado de Palestras | Imersão Presencial

> Especificação de direção de arte para a página completa em /dominando-o-mercado-de-palestras/.
> SEM LOGOS do Apogeu (sem nav no hero; footer só contato + copyright).
> Os dois botões de CTA abrem o modal de captura (nome + WhatsApp) e gravam o lead no
> Supabase (tabela "dominando-o-mercado-de-palestras", ver leads.sql) antes de redirecionar.
> WhatsApp da página: wa.me/5531984240009 (31 9 8424-0009).
> Base: copy.md (textos) + index.html/style.css aprovados (Hero + Seção 01).
> Este documento é a bíblia da implementação no /desenvolver. Nada deve ser
> interpretado ou simplificado: valores exatos abaixo.

---

## 0. Linguagem Visual Global (extraída do design aprovado)

### Paleta (hex exatos, já em uso no style.css)

| Token | Hex | Uso |
|---|---|---|
| --brasa-300 | #FBC97A | acentos claros sobre escuro |
| --brasa-400 | #FBB44C | início do gradiente brasa, destaques |
| --brasa-500 | #ED7D2B | accent principal (dots, markers) |
| --brasa-600 | #D9641A | accent sobre fundo claro, hover |
| --brasa-700 | #B23E0C | strong em texto sobre claro |
| --grafite-950 | #141417 | fundo dark profundo (hero, CTA final) |
| --grafite-900 | #1C1C20 | fundo dark secundário (marquee, seções dark) |
| --grafite-800 | #2A2A30 | superfícies sobre dark |
| --grafite-700 | #3A3A42 | texto secundário sobre claro |
| --grafite-400 | #8A8A94 | texto muted |
| --marfim | #F6F4F1 | fundo claro base, texto sobre dark |
| --areia | #ECE8E2 | bordas sobre claro |
| --nevoa | #CFCBC4 | texto secundário sobre dark |
| --bronze | #C9A24B | detalhe premium pontual (selo garantia) |
| --brasa-grad | linear-gradient(135deg,#FBB44C,#ED7D2B 50%,#C2470F) | CTAs, ênfases |

### Tipografia (manter em TODA a página)

- **Headings:** "Cormorant Garamond", Georgia, serif — weight 600, itálico para ênfase
- **Body:** "Hanken Grotesk", system-ui, sans-serif — weights 400/500/600/700
- **Labels/kickers/números:** "Jost", system-ui, sans-serif — weights 400/500/600/700, sempre uppercase + letter-spacing 0.1em a 0.34em

### Tokens estruturais

- Container: max-width 1240px (--maxw); padding lateral clamp(1.25rem, 5vw, 2.5rem) (--pad)
- Padding vertical de seção: clamp(4.5rem, 9vw, 8rem)
- Easing padrão: cubic-bezier(0.16, 1, 0.3, 1) (--ease-out); spring: cubic-bezier(0.34, 1.56, 0.64, 1) (--ease-spring)
- Border-radius de botões: 12px
- Grain: SVG feTurbulence data-URI (já no CSS), opacity 0.5, apenas em seções dark

### Sistema de reveal (já implementado no script.js)

- Classe `.reveal`: opacity 0 + translateY(26px) → `.is-in` opacity 1 + translateY(0)
- Transição: 0.8s --ease-out, delay em stagger de 0.09s por irmão (var --d)
- Trigger: IntersectionObserver threshold 0.2, rootMargin "0px 0px -8% 0px"
- Respeitar prefers-reduced-motion: sem reveal, conteúdo visível
- Hero NÃO usa reveal de entrada (regra do projeto); apenas animações ambientes pós-load (classe `.is-loaded` no html)

### Ritmo de fundos (mapa da página, alternância dark/claro)

1. Hero — grafite-950 (dark)
2. Marquee — grafite-900 (dark)
3. S01 Problema — marfim (claro)
4. S02 O Que Você Constrói — grafite-950 (dark)
5. S03 3 Verdades — marfim (claro)
6. S04 Para Quem É — grafite-900 (dark)
7. S05 Cronograma — marfim (claro)
8. S06 Quem Conduz — grafite-950 (dark)
9. S07 Turma Pequena — marfim (claro, respiro)
10. S08 Investimento + Garantia — grafite-950 (dark, com glow brasa)
11. S09 Informações Gerais — marfim (claro)
12. S10 FAQ — muted-bg #FBFAF8 (claro)
13. S11 CTA Final + Footer — grafite-950 (dark)

### Regras invioláveis (decisões do usuário)

- SEM escassez de vagas em qualquer texto ou selo
- SEM travessões (—) em qualquer texto visível; usar ponto, dois-pontos ou vírgula
- SEM cards de vidro flutuantes estilo "ficha" (o ticket do hero foi rejeitado)
- SEM emojis; sem 3 cards com ícones; sem grids simétricos de features
- FUNIL: a compra passa por uma reunião com o Bruno; não há checkout direto.
  SEM PREÇO em nenhum texto da página (valor apresentado na conversa).
  CTAs sempre em DOIS BOTÕES lado a lado (.cta-row, gap 0.9rem, empilha no 640px):
  1) .btn--fire = Calendly https://calendly.com/brunobettini/reuniao-bruno-bettini?back=1&month=2026-07
  2) .btn--wpp (contorno 1.5px rgba(246,244,241,0.3), hover borda/texto brasa + bg rgba(237,125,43,0.08))
     = "Falar no WhatsApp" (wa.me/5531984240009 com texto pré-preenchido); ambos target _blank rel noopener;
  ambos os botões abrem primeiro o modal de captura (nome + WhatsApp → Supabase) e só então redirecionam

---

## Seção HERO (aprovada, não alterar)

### Arquétipo e Constraints
- Arquétipo: Split Assimétrico (texto 7fr / retrato 4.4fr) com Type Hero à esquerda
- Constraints: Texto com Stroke (palavra DOMINANDO), Xadrez diagonal mascarado (assinatura Apogeu), Bleed Right (trilho de datas vertical), Grain, Mask Reveal na foto, animações ambientes pós-load
- Justificativa: tipografia serif gigante carrega a promessa; o retrato do Bruno equilibra a composição no desktop e abre a página no mobile

### Conteúdo, layout, tipografia, cores, animações
Exatamente como implementado em index.html/style.css:
- Fundo: radial grafite + xadrez diagonal (linear-gradients 45deg marfim, size 96px, opacity 0.05, mask radial 75% 65% at 45% 25%) + grain
- Kicker: "Imersão presencial · 24, 25 e 26 de julho · Belo Horizonte" (dot brasa pulsando 2.4s)
- H1 4 linhas, clamp(3rem, 8.4vw, 7.4rem), line-height 0.94, "negócio" em itálico com brasa-grad em background-clip
- Sub máx 56ch, cor nevoa, strong marfim, termina em dois-pontos
- Pilares (destaque): lista Jost 600 0.84rem uppercase ls 0.14em cor marfim, marcador ◆ brasa-500 0.45rem, gap 0.75rem 1.5rem
- CTA em .cta-row: botão fire "Agendar conversa com o Bruno" (Calendly) + botão contorno "Falar no WhatsApp"; microcopy "Vaga confirmada na conversa · Garantia incondicional de 7 dias"
- Fatos: 12 / 3 / 10+ com números serif em brasa-grad, divisores verticais 1px rgba(255,255,255,0.14), border-top rgba(246,244,241,0.12)
- Retrato (grid col 2, justify-self end, min(100%, 460px)): /.netlify/images?url=/assets/perfil.png&w=880&q=80, aspect 4/5, object-position 50% 18%, radius 22px topo, filter contrast(1.04) saturate(0.94), mask-image linear-gradient(180deg, #000 68%, transparent 100%) fundindo no grafite; glow ::before radial rgba(237,125,43,0.16) inset -14%; figcaption "Bruno Bettini · Fundador do Apogeu do Palestrante" Jost 0.68rem ls 0.18em com traço brasa 1.6rem, margin-top -1.9rem
- Palavra "DOMINANDO" stroke 1px rgba(246,244,241,0.09), clamp(7rem, 19vw, 19rem), bottom -0.14em, wordGlow 7s alternate
- Responsivo 1080px: 1 coluna (foto acima do texto, centrada, máx 440px); esconde trilho de datas
- Responsivo 640px (mobile): .hero__nav oculto (sem logo); foto full-width aspect 1/1.05; ordem via flex order: foto > kicker > título > CTA > sub > pilares > fatos; botão full-width

---

## Faixa MARQUEE (aprovada, não alterar)

Track duplicado, translateX(0 → -50%) em 26s linear infinite, pausada com prefers-reduced-motion.
Itens: "12 workshops práticos ◆ 3 dias imersivos ◆ das 9h às 20h ◆ Belo Horizonte ◆ certificado incluso ◆ coffee break incluso ◆". Jost 500, 0.78rem, ls 0.28em, cor nevoa; ◆ brasa-500 0.5rem, margem 0 1.6rem. Fundo grafite-900, bordas 1px rgba(246,244,241,0.08).

---

## Seção 01: O Problema (aprovada, não alterar)

### Arquétipo e Constraints
- Arquétipo: Editorial assimétrico com coluna sticky
- Constraints: Sticky Element (Layout), Stagger reveal (Movimento), hover shift na lista (Interação)

### Como implementado
- Grid 5fr / 6.5fr, gap clamp(2.5rem, 6vw, 6rem); aside sticky top clamp(2rem, 6vw, 4rem)
- sec-tag "01 O problema": número serif itálico brasa-600 1.1rem + label Jost 0.72rem ls 0.2em + linha 3rem × 1px nevoa
- Título clamp(2.4rem, 4.6vw, 4rem) serif, "Estrutura, sim." em itálico brasa-600, máx 14ch
- Lead clamp(1.15rem, 1.4vw, 1.35rem), strong brasa-700
- Sintomas S.1 a S.4: serif 600 clamp(1.25rem, 1.9vw, 1.6rem), bordas areia, número Jost brasa-600 0.7rem; hover: cor text + padding-left 0.5rem em 0.4s
- Virada: border-left 3px brasa-grad (border-image), serif clamp(1.5rem, 2.6vw, 2.15rem), em bloco itálico brasa-600, máx 24ch
- 1080px: 1 coluna, aside estático

---

## Seção 02: O Que Você Vai Construir (7 entregas)

### Arquétipo e Constraints
- Arquétipo: Progressive Reveal (índice editorial expansível, estilo sumário de revista)
- Constraints: Reveal on Demand (Interação), Headline Full Width (Tipografia), Grain (Efeitos), Stagger (Movimento)
- Justificativa: 7 entregas em cards viraria grid genérico; um índice 01–07 em linhas full-width dá peso editorial, e a descrição revelada sob demanda mantém a seção densa porém escaneável

### Conteúdo (exato da copy)
- sec-tag: "02 As entregas"
- Título: "Você entra com conteúdo. *Sai com um negócio.*" ("Sai com um negócio." em itálico brasa-400)
- Intro: "Durante três dias intensos, você vai aprender e aplicar em sala o método usado pelos palestrantes mais rentáveis do país:"
- Itens (número, nome, descrição):
  1. Masterclass Estratégica | Transforme o seu conteúdo em produto comercial, com estrutura que vende antes mesmo de você subir no palco.
  2. Esteira de Produtos | Organize palestras, treinamentos e mentorias numa linha coesa, com margens inteligentes e cadência de vendas.
  3. Copywriting e Sexy Canvas | Comunicação que gera conexão e conversão real, não curtida vazia.
  4. Proposta Comercial | Monte propostas que comunicam valor e eliminam objeções antes da negociação começar.
  5. Posicionamento Magnético | Construa a percepção de autoridade que faz empresas procurarem você, e não o contrário.
  6. Calendário Anual de Vendas | Planeje o ano inteiro e negocie com visão de longo prazo, em vez de correr atrás do próximo mês.
  7. Monitoramento de Performance | Um sistema pra medir, ajustar e crescer com método, não no achismo.

### Layout
- Fundo grafite-950 com grain (mesmo data-URI do hero, opacity 0.4)
- Container 1240px; padding clamp(4.5rem, 9vw, 8rem) var(--pad)
- Cabeçalho da seção: grid 2 colunas (título 7fr / intro 5fr, alinhados na base, gap clamp(2rem, 5vw, 4rem)); em 1080px empilha
- Lista: largura total do container, border-top 1px rgba(246,244,241,0.12)
- Cada item `<li>`: border-bottom 1px rgba(246,244,241,0.12); padding 0
  - Linha-título (sempre visível, cursor pointer): grid `64px 1fr auto`, align baseline, padding 1.4rem 0
    - Número: Jost 600, 0.78rem, ls 0.18em, brasa-400, formato "01."
    - Nome: serif 600, clamp(1.6rem, 3.2vw, 2.6rem), cor marfim, line-height 1.1
    - Indicador: círculo 34px, border 1px rgba(246,244,241,0.25), com "+" Jost 300 1.1rem centrado; transição transform 0.4s --ease-out
  - Painel descrição: grid-template-rows 0fr → 1fr em 0.45s --ease-out (técnica overflow hidden em wrapper interno); aberto: padding 0 0 1.6rem 64px; texto Hanken 400, 1rem/1.65, cor nevoa, máx 58ch
- Estado aberto (classe `.is-open`): nome ganha cor brasa-300; "+" rotaciona 45deg (vira ×); círculo com background rgba(237,125,43,0.12) e border brasa-500

### Tipografia
- Título da seção: serif 600, clamp(2.4rem, 4.6vw, 4rem), lh 1.02, ls -0.02em, marfim
- Intro: Hanken 400, clamp(1.02rem, 1vw + 0.8rem, 1.15rem), nevoa, máx 44ch

### Cores
- Fundo #141417; texto marfim #F6F4F1; muted #CFCBC4; números/acentos #FBB44C e #ED7D2B; bordas rgba(246,244,241,0.12)

### Animações
- Entrada: itens com .reveal stagger 0.09s
- Abertura do painel: 0.45s --ease-out; fechamento 0.35s
- Comportamento: apenas 1 item aberto por vez (fecha o anterior); item 01 já abre por padrão no load para ensinar a interação

### Interatividade
- Desktop e mobile: clique/tap na linha-título alterna
- Hover (desktop): linha ganha padding-left 0.4rem em 0.4s --ease-out; nome clareia para #FFFFFF
- Acessibilidade: usar button dentro do h3, aria-expanded, aria-controls

### Responsividade
- 1080px: cabeçalho empilha; nome clamp(1.4rem, 5vw, 1.8rem)
- 640px: grid da linha vira `44px 1fr auto`; painel aberto padding-left 44px; círculo 30px

---

## Seção 03: 3 Verdades

### Arquétipo e Constraints
- Arquétipo: Card Stack (cartas que empilham no scroll, sticky)
- Constraints: Sticky Element (Layout), Scroll Progress com scale/offset (Movimento), Numeração oversized (Tipografia)
- Justificativa: três verdades são três "golpes" sequenciais; o empilhamento sticky obriga leitura uma a uma, com drama, sem virar 3 cards lado a lado

### Conteúdo (exato da copy)
- sec-tag: "03 As verdades"
- Título da seção: "3 verdades que ninguém te contou sobre *vender palestras*"
- Verdade 1: "Preço não é o começo. É o reflexo da sua estrutura." / "Antes de cobrar caro, é preciso saber o que você entrega, como entrega e a quem."
- Verdade 2: "O segredo não é ter muitos produtos. É ter uma linha coesa." / "Cada palestra deve alimentar o próximo passo do seu cliente dentro da sua esteira."
- Verdade 3: "A venda começa depois do contrato." / "O diferencial real está no pós-evento: acompanhamento, recompra e indicação."

### Layout
- Fundo marfim; padding clamp(4.5rem, 9vw, 8rem) var(--pad)
- Cabeçalho centrado: sec-tag + título serif clamp(2.4rem, 4.6vw, 4rem) máx 18ch, margem inferior clamp(3rem, 6vw, 4.5rem)
- Stack: container com display grid; cada card `position: sticky; top: calc(12vh + N*28px)` (N = 0,1,2); margem entre cards 24vh (cria o percurso de scroll)
- Card: max-width 820px centrado; background #FFFFFF; border 1px areia; border-radius 20px; padding clamp(2rem, 4vw, 3.2rem); box-shadow 0 24px 48px -28px rgba(28,28,32,0.18)
- Filete superior: 2px brasa-grad, inset 20px horizontais (como o ticket aprovado, único eco permitido)
- Dentro do card: número gigante "1." serif itálico brasa-600 clamp(3rem, 6vw, 4.5rem) posicionado à esquerda; título serif 600 clamp(1.6rem, 3vw, 2.3rem) lh 1.12; texto Hanken 1.05rem/1.6 grafite-700, máx 52ch; grid `auto 1fr` gap 1.5rem
- Cards 2 e 3, quando empilham, o de trás recebe scale progressivo 0.97/0.94 e translateY leve (efeito baralho); implementar com animation-timeline: view() quando suportado; fallback: apenas o sticky empilhado sem scale

### Cores
- Fundo #F6F4F1; card #FFFFFF; borda #ECE8E2; número #D9641A; título #1C1C20; texto #3A3A42

### Animações
- Cada card entra com .reveal (fade-up 0.8s)
- Scale do card anterior: animation-timeline view(), range "entry 0%" a "exit 100%", scale 1 → 0.94, filter brightness(0.98)

### Interatividade
- Sem hover especial nos cards (são leitura); seleção de texto permitida

### Responsividade
- 1080px: top do sticky calc(9vh + N*20px)
- 640px: número acima do título (grid 1 coluna), card padding 1.6rem, margem entre cards 18vh

---

## Seção 04: Para Quem É

### Arquétipo e Constraints
- Arquétipo: Scroll Storytelling em container estreito (narrativa de identificação)
- Constraints: Texto Revelar com preenchimento progressivo (Movimento), Container Narrow (Layout), High Contrast (Cor)
- Justificativa: é a seção-espelho ("essa sala é sua"); frases grandes que acendem uma a uma criam o momento de identificação pessoal, sem lista com checkmarks

### Conteúdo (exato da copy)
- sec-tag: "04 Pra quem é"
- Título: "Se hoje você ainda está improvisando, *essa sala é sua.*"
- Intro: "Essa imersão foi feita pra você que:"
- Frases (uma a uma):
  - "Sente que o seu trabalho não reflete o seu potencial"
  - "Responde cotações sem saber quanto cobrar"
  - "Tem redes sociais que não geram contratos"
  - "Entrega valor que o público não enxerga, e não sabe por quê"
- Fechamento: "Você vai sair com clareza, plano e ferramentas práticas pra se posicionar como profissional de alto valor e transformar palestras num negócio previsível e rentável."
- Frase final (assinatura da seção): "Aqui não há plateia. Há profissionais em construção."

### Layout
- Fundo grafite-900 com grain opacity 0.35; padding clamp(5rem, 10vw, 9rem) var(--pad)
- Container estreito: max-width 880px centrado, texto alinhado à esquerda
- sec-tag em versão dark (label rgba(246,244,241,0.5), número brasa-400, linha rgba(246,244,241,0.25))
- Título serif clamp(2.4rem, 4.6vw, 4rem), marfim, em itálico brasa-400
- Intro Jost 500 0.9rem uppercase ls 0.14em nevoa, margem 2.5rem 0 1.5rem
- Frases: cada uma em serif 600 clamp(1.7rem, 3.4vw, 2.7rem) lh 1.15, bloco próprio com padding 1.1rem 0, sem bordas
- Fechamento: Hanken 1.05rem/1.65 nevoa, máx 58ch, margem-top 2.5rem
- Assinatura: Jost 600 0.9rem uppercase ls 0.22em, brasa-400, com linha 1px rgba(246,244,241,0.2) de 4rem à esquerda, margem-top 2rem

### Animações (o momento "uau" da seção)
- Preenchimento progressivo: cada frase começa em rgba(246,244,241,0.22) e "acende" para marfim conforme entra no viewport
  - Preferencial: background: linear-gradient(90deg, #F6F4F1 50%, rgba(246,244,241,0.22) 50%); background-size 200% 100%; background-clip: text; color transparent; background-position animada de 100% → 0% com animation-timeline: view(), range "entry 25%" a "cover 55%"
  - Fallback (sem suporte): IntersectionObserver adiciona .is-lit com transition color 0.9s --ease-out, stagger 0.12s
- Assinatura entra com .reveal delay 0.2s

### Interatividade
- Nenhuma ação de clique; a seção é contemplativa

### Responsividade
- 640px: frases clamp(1.35rem, 6.4vw, 1.7rem); paddings verticais 0.8rem

---

## Seção 05: Como Funciona (Cronograma)

### Arquétipo e Constraints
- Arquétipo: Timeline vertical com coluna sticky
- Constraints: Sticky Element (Layout), Draw SVG/linha que cresce com scroll (Movimento), Color Coding por tipo de bloco (Cor)
- Justificativa: cronograma é prova de densidade do evento; timeline com horários em Jost e código de cores Conteúdo/Workshop/Debriefing comunica o método sem virar tabela chata

### Conteúdo (exato da copy)
- sec-tag: "05 Como funciona"
- Título: "Um formato pensado pra aplicar, revisar e consolidar *em tempo real*"
- Texto de apoio (coluna sticky): "Sexta, sábado e domingo, das 9h às 20h. Cada bloco segue a mesma estrutura: Conteúdo, Workshop e Debriefing. São 12 workshops práticos ao longo dos 3 dias: aprendizado aplicado, validação em grupo e acompanhamento próximo em cada etapa. Coffee break incluso à tarde."
- Legenda (na coluna sticky): Conteúdo / Workshop / Debriefing / Pausas
- Timeline (hora | rótulo):
  - 08h45 às 09h00 | Credenciamento e boas-vindas (pausa)
  - 09h00 às 10h00 | Conteúdo · Bloco 1 (manhã)
  - 10h00 às 11h30 | Workshop · Aplicação prática do conteúdo
  - 11h30 às 12h00 | Debriefing · Revisão e anotações guiadas
  - 12h00 às 13h30 | Intervalo para almoço (livre) (pausa)
  - 13h30 às 14h00 | Conteúdo · Bloco 2 (tarde 1)
  - 14h00 às 15h00 | Workshop · Exercício de implementação
  - 15h00 às 15h30 | Debriefing · Discussão e validação em grupo
  - 15h30 às 16h00 | Coffee break (incluso) (pausa)
  - 16h00 às 16h30 | Conteúdo · Bloco 3 (tarde 2)
  - 16h30 às 17h30 | Workshop · Construção prática
  - 17h30 às 18h00 | Debriefing · Síntese e direcionamentos
  - 18h00 às 18h30 | Conteúdo · Bloco 4 (noite)
  - 18h30 às 19h30 | Workshop · Atividade final do dia
  - 19h30 às 20h00 | Debriefing · Encerramento do ciclo diário
  - 20h00 | Encerramento das atividades do dia (pausa)

### Layout
- Fundo marfim; padding clamp(4.5rem, 9vw, 8rem) var(--pad)
- Grid 4.5fr / 7fr, gap clamp(2.5rem, 6vw, 5rem); coluna esquerda sticky top clamp(2rem, 6vw, 4rem)
- Coluna esquerda: sec-tag + título (serif clamp(2.2rem, 4vw, 3.4rem), máx 16ch, "em tempo real" itálico brasa-600) + texto de apoio (Hanken 1rem/1.65 grafite-700, máx 40ch) + legenda
- Legenda: 4 linhas, cada uma com quadrado 10px (rotacionado 45deg, estilo ◆) na cor do tipo + rótulo Jost 500 0.75rem uppercase ls 0.14em grafite-700
- Timeline (coluna direita): lista vertical com pseudo-linha contínua a 7px da esquerda (2px, areia); sobre ela, uma linha "de progresso" brasa-grad que cresce com scroll
- Cada item: grid `16px 150px 1fr`, gap 1.25rem, padding 0.85rem 0
  - Marcador: losango 10px (div rotate 45deg) na cor do tipo, centrado na linha
  - Hora: Jost 600 0.8rem ls 0.08em grafite-400, variante tabular
  - Rótulo: Hanken 500 1rem grafite-900; o prefixo do tipo ("Conteúdo", "Workshop", "Debriefing") com cor do tipo e weight 700
- Nota final sob a timeline: "Estrutura idêntica nos 3 dias. 4 ciclos por dia, 12 workshops no total." em Jost 500 0.78rem uppercase ls 0.14em grafite-400, border-top 1px areia, padding-top 1.25rem

### Cores (código por tipo)
- Conteúdo: #1C1C20 (grafite-900, marcador preenchido)
- Workshop: #D9641A (brasa-600) — é o protagonista do método
- Debriefing: #C9A24B (bronze)
- Pausas (credenciamento, almoço, coffee, encerramento): marcador vazado, border 1.5px #CFCBC4, texto grafite-400

### Animações
- Linha de progresso: transform scaleY 0 → 1, transform-origin top; animation-timeline: view() no container da timeline, range "entry 0%" a "exit 60%"; fallback: scaleY atualizado via scroll listener com requestAnimationFrame
- Itens: .reveal com stagger 0.05s (mais rápido que o padrão, são 16 itens)
- Losangos: scale 0 → 1 0.4s --ease-spring quando .is-in

### Interatividade
- Hover no item: hora ganha cor grafite-900; background rgba(237,125,43,0.05) na linha inteira (border-radius 8px, padding-left 0.4rem com transição 0.3s)

### Responsividade
- 1080px: 1 coluna; coluna esquerda estática; legenda em linha (flex wrap)
- 640px: grid do item `12px 92px 1fr`, hora 0.72rem; rótulo 0.95rem

---

## Seção 06: Quem Conduz (Bruno Bettini)

### Arquétipo e Constraints
- Arquétipo: Split com Overlap (foto sangrando + nome sobreposto)
- Constraints: Imagem Duotone/dessaturada (Mídia), Overlap Elements (Layout), Texto com Stroke reprise "BETTINI" (Tipografia)
- Justificativa: autoridade pede rosto; o overlap do nome serif sobre a foto tratada em grafite integra a imagem à linguagem tipográfica da página

### Conteúdo (exato da copy)
- sec-tag: "06 Quem conduz"
- Nome: "Bruno Bettini"
- Parágrafos:
  1. "Há mais de 10 anos, Bruno Bettini intermedia palestrantes em todo o Brasil. Ele vive o bastidor dos eventos corporativos: sabe o que faz um palestrante ser contratado, lembrado e recontratado. E sabe o que faz um profissional talentoso ficar invisível."
  2. "Criou essa imersão pra quebrar um ciclo silencioso: o de palestrantes bons que não conseguem se posicionar, precificar ou vender com consistência."
  3. "Não é uma imersão motivacional. É um processo técnico e emocional, baseado em mais de uma década de bastidor."
- Credenciais (linha corrida com separadores ◆, NÃO chips/boxes): "10+ anos intermediando palestrantes ◆ Bastidor de eventos corporativos ◆ Fundador da Avantik Palestras e do Apogeu do Palestrante"

### Layout
- Fundo grafite-950 com grain 0.4; padding clamp(4.5rem, 9vw, 8rem) 0 (imagem sangra a margem esquerda)
- Grid 5.5fr / 6.5fr, gap 0; container 1240px apenas na coluna de texto
- Foto: usar /assets/perfil.png (a mesma do hero, MAS em duotone grafite pra não repetir a leitura); servir via /.netlify/images com w=900&q=80
  - Tratamento: filter grayscale(1) contrast(1.06) brightness(0.92); overlay ::after com linear-gradient(160deg, rgba(20,20,23,0) 55%, rgba(20,20,23,0.85) 100%) para fundir com o fundo; border-radius 0; enquadramento diferente do hero (object-position 50% 35%, corte mais fechado no rosto)
  - Altura: min(640px, 78vh); object-fit cover; object-position top center
- Palavra "BETTINI" vazada atrás da coluna de texto: Jost 700, clamp(5rem, 12vw, 11rem), stroke 1px rgba(246,244,241,0.07), rotacionada 0deg, posicionada top right, overflow hidden
- Nome "Bruno Bettini": serif 600 itálico clamp(2.6rem, 5vw, 4.2rem) marfim, posicionado com margin-left -8% sobrepondo a borda direita da foto (desktop)
- Parágrafos: Hanken 1.02rem/1.7 nevoa, máx 54ch; strong marfim
- Credenciais: Jost 500 0.78rem uppercase ls 0.16em brasa-300, ◆ brasa-500 0.45rem com margem 0 0.9rem; border-top 1px rgba(246,244,241,0.12), padding-top 1.5rem, margem-top 2rem

### Animações
- Foto: clip-path inset(0 100% 0 0) → inset(0 0 0 0) em 1s --ease-out quando .is-in (mask reveal da esquerda)
- Nome: .reveal delay 0.15s; parágrafos stagger 0.09s
- "BETTINI" vazado: parallax sutil com translateY entre -20px e 20px via animation-timeline: view() (opcional, só desktop)

### Interatividade
- Nenhum clique; foto não é link

### Responsividade
- 1080px: 1 coluna; foto full-width altura 60vw máx 480px; nome sem margin negativa, sobre a foto na base (position absolute bottom 1.5rem left var(--pad) com text-shadow 0 2px 24px rgba(0,0,0,0.5))
- 640px: credenciais em bloco com line-height 2

---

## Seção 07: Turma Pequena (interlúdio de respiro)

### Arquétipo e Constraints
- Arquétipo: White Space Hero / Isolated Element (declaração única centrada)
- Constraints: Container Narrow (Layout), Mask Reveal por linha (Movimento), Selective Color (Cor)
- Justificativa: depois de duas seções densas, um respiro em marfim com uma única declaração dá peso à ideia de exclusividade sem apelar pra escassez

### Conteúdo (exato da copy)
- sec-tag (centrado): "07 A turma"
- Título: "Uma turma pequena. *De propósito.*"
- Texto 1: "A sala é pequena porque o formato exige: acompanhamento próximo, aplicação prática e feedback real em cada workshop."
- Texto 2: "Você vai fazer parte de uma comunidade de palestrantes que realmente vivem do palco e constroem marcas pessoais com base em consistência, entrega e resultado."

### Layout
- Fundo marfim; padding clamp(5.5rem, 11vw, 10rem) var(--pad)
- Container máx 720px, tudo centrado
- sec-tag centrado (sem linha ::after, apenas número + label)
- Título serif clamp(2.6rem, 5.4vw, 4.6rem), "De propósito." itálico brasa-600
- Textos Hanken clamp(1.02rem, 1vw + 0.8rem, 1.15rem)/1.7 grafite-700, margem-top 1.5rem
- Ornamento: linha vertical 1px × 72px brasa-grad acima do sec-tag, centrada (liga a seção anterior a esta, como um fio)

### Animações
- Linha vertical: scaleY 0 → 1 transform-origin top, 0.8s --ease-out quando .is-in
- Título: mask reveal por linha (clip-path inset(0 0 100% 0) → inset(0)) 0.9s --ease-out; fallback .reveal
- Textos: .reveal stagger 0.12s

### Responsividade
- 640px: padding vertical clamp(4rem, 14vw, 5.5rem)

---

## Seção 08: Investimento + Garantia

### Arquétipo e Constraints
- Arquétipo: Split Assimétrico de oferta (inclusos à esquerda, preço à direita) integrado ao fundo (SEM card flutuante)
- Constraints: Glow/luz brasa (Efeitos), Texto Circular girando no selo de garantia (Tipografia + Movimento), Border gradiente na divisão (Layout)
- Justificativa: a oferta precisa de palco próprio; integrar preço e garantia na mesma cena evita o card genérico de pricing e fecha a decisão num único olhar

### Conteúdo (exato da copy)
- sec-tag: "08 Investimento"
- Etiqueta acima do preço: "Dominando o Mercado de Palestras · Presencial · 24 a 26 de julho"
- Título: "Sua vaga na imersão"
- Inclui (lista):
  - 3 dias de imersão presencial, das 9h às 20h
  - 12 workshops práticos com validação em grupo
  - Coffee break à tarde nos 3 dias
  - Certificado de participação
- SEM preço (removido da página; valor apresentado na conversa)
- Prazo: "Inscrições até 24/07/2026"
- Passos da inscrição (lista numerada com círculos brasa 22px): 1. Agende uma conversa online com o Bruno / 2. Valide se a imersão é pro seu momento / 3. Garanta sua vaga
- CTAs em .cta-row: botão fire "Agendar minha conversa" (Calendly) + botão contorno "Falar no WhatsApp"
- Microcopy: "Inscrição confirmada na conversa · Garantia incondicional de 7 dias"
- Garantia (bloco integrado): título "Garantia incondicional de 7 dias"; texto "Você tem 7 dias após a inscrição pra decidir. Se achar que não é pra você, devolvemos 100% do valor, sem justificativa e sem burocracia."
- Selo circular: texto em círculo "GARANTIA INCONDICIONAL · 7 DIAS · GARANTIA INCONDICIONAL · 7 DIAS ·"

### Layout
- Fundo grafite-950; glow: radial-gradient(50% 60% at 70% 40%, rgba(237,125,43,0.14), transparent 70%) fixo no fundo; grain 0.4
- Padding clamp(4.5rem, 9vw, 8rem) var(--pad)
- Cabeçalho: sec-tag dark + título serif clamp(2.4rem, 4.6vw, 4rem) marfim
- Corpo: grid 6fr / 5.5fr, gap clamp(2.5rem, 6vw, 5rem), separados por border-left 1px com gradiente vertical (rgba(246,244,241,0) → rgba(246,244,241,0.18) → rgba(246,244,241,0)) na coluna direita (desktop)
- Coluna esquerda (o que está incluso):
  - Label "O que está incluso" Jost 600 0.72rem uppercase ls 0.2em nevoa
  - Lista: cada item com losango brasa 8px + Hanken 500 clamp(1.05rem, 1.3vw, 1.2rem) marfim, padding 0.9rem 0, border-bottom 1px rgba(246,244,241,0.1)
  - Bloco garantia abaixo (margem-top 2.5rem): selo circular 120px à esquerda (texto circular Jost 600 0.6rem ls 0.24em brasa-300 girando; centro: "7" serif itálico 2rem bronze) + textos à direita (título Hanken 700 1.05rem marfim; texto 0.95rem/1.6 nevoa)
- Coluna direita (preço e ação):
  - Etiqueta Jost 500 0.72rem uppercase ls 0.18em nevoa
  - Preço: serif 600 clamp(3.4rem, 6.5vw, 5.2rem) marfim, lh 1; "ou 12x de R$ 258,56" Hanken 500 1.05rem brasa-300 logo abaixo
  - Prazo: Jost 500 0.75rem uppercase ls 0.16em rgba(246,244,241,0.5), margem-top 0.8rem
  - CTA .btn--fire width 100% máx 380px, margem-top 2rem, padding 1.15rem
  - Microcopy Jost 0.72rem uppercase ls 0.12em rgba(246,244,241,0.55) centrado sob o botão

### Animações
- Selo circular: rotate 360deg em 18s linear infinite (pausa em prefers-reduced-motion)
- Preço: .reveal + counter sutil NÃO (número monetário fixo, sem counter); apenas fade-up
- Glow do fundo: opacity 0.8 → 1 breathing 6s ease-in-out alternate (sutil)
- Lista de inclusos: stagger 0.09s

### Interatividade
- CTA hover: translateY(-3px) + shadow 0 22px 44px -14px rgba(237,125,43,0.7) + saturate(1.08), 0.35s --ease-spring (padrão do site)

### Responsividade
- 1080px: 1 coluna (preço primeiro, inclusos depois); sem border divisória; selo 100px
- 640px: preço clamp(2.8rem, 13vw, 3.4rem); CTA full-width

---

## Seção 09: Informações Gerais

### Arquétipo e Constraints
- Arquétipo: Tabela editorial (linhas dt/dd, herdando o vocabulário das linhas com borda da página)
- Constraints: Hover row shift (Interação), Ghost button WhatsApp (Estruturas), Asymmetric grid (Layout)
- Justificativa: informação de serviço pede leitura utilitária; a tabela editorial mantém a elegância sem inventar moda

### Conteúdo (exato da copy)
- sec-tag: "09 Informações gerais"
- Título: "O que você precisa saber"
- Linhas (rótulo | valor):
  - Local | Auditório Ademincon · Av. José Maria Alckmin, 952, Belvedere, Belo Horizonte - MG
  - Datas e horário | 24, 25 e 26 de julho de 2026, das 9h às 20h
  - Estrutura | Ambiente pensado pra experiência do participante, com estrutura completa, conforto e atmosfera de treinamento imersivo
  - Estacionamento | Disponível nas imediações do espaço (pago)
  - Certificado | Sim, para todos os participantes
- Contato: botão ghost "Falar com o suporte no WhatsApp" → https://wa.me/5531984240009 (31 9 8424-0009)

### Layout
- Fundo marfim; padding clamp(4.5rem, 9vw, 8rem) var(--pad)
- Grid 4fr / 7.5fr: esquerda sec-tag + título (sticky não necessário, seção curta) + botão WhatsApp; direita a tabela
- Tabela: dl com linhas grid `180px 1fr`, gap 1.5rem, padding 1.1rem 0, border-bottom 1px areia
  - dt: Jost 600 0.7rem uppercase ls 0.18em grafite-400
  - dd: Hanken 400 1rem/1.6 grafite-900
- Botão ghost: border 1.5px grafite-900, border-radius 12px, padding 0.95rem 1.8rem, Jost 600 0.82rem uppercase ls 0.08em, cor grafite-900, background transparent

### Interatividade
- Linha hover: background #FBFAF8 + padding-left 0.4rem (0.3s)
- Ghost hover: background grafite-900, cor marfim, 0.3s ease; active translateY(1px)

### Responsividade
- 1080px: 1 coluna, botão após a tabela
- 640px: linha da tabela vira 1 coluna (dt acima do dd, gap 0.3rem)

---

## Seção 10: FAQ

### Arquétipo e Constraints
- Arquétipo: Reveal on Demand em duas colunas com título sticky
- Constraints: Sticky Element (Layout), expansão grid-rows suave + rotação do indicador (Movimento), perguntas em serif (Tipografia)
- Justificativa: FAQ precisa ser rápido de escanear; perguntas em serif grande com abertura fluida elevam o padrão sem "accordion básico" de template

### Conteúdo (exato da copy)
- sec-tag: "10 Perguntas frequentes"
- Título (coluna sticky): "Ficou alguma dúvida?"
- Apoio (coluna sticky): "Se não encontrar a resposta aqui, chama o suporte no WhatsApp: 31 9 8424-0009."
- Q&A (a primeira abre por padrão):
  0. Como funciona a inscrição? | Antes de confirmar a vaga, você faz uma conversa online com o Bruno pra alinhar expectativas e validar se a imersão faz sentido pro seu momento. É só agendar o melhor horário no calendário ou chamar no WhatsApp 31 9 8424-0009.
  1. Preciso levar algo? | Sim. Notebook, caderno e disposição pra aplicar em tempo real. Cada módulo tem práticas de construção e revisão.
  2. Posso parcelar? | Sim, em até 12x de R$ 258,56. As condições de pagamento são alinhadas na conversa com o Bruno ou no suporte via WhatsApp 31 9 8424-0009.
  3. Tem certificado? | Sim, entregue ao final da imersão para todos os participantes.
  4. O estacionamento é gratuito? | Não, mas há opções próximas ao espaço, com acesso facilitado.
  5. O almoço está incluso? | Não. O intervalo de almoço é livre (12h às 13h30), com opções na região. O coffee break da tarde está incluso nos 3 dias.
  6. E se eu me inscrever e mudar de ideia? | Você tem garantia incondicional de 7 dias após a compra: devolvemos 100% do valor, sem justificativa. Cancelamentos seguem a política da Sympla (solicitação até 7 dias após a compra e até 48h antes do início do evento).

### Layout
- Fundo #FBFAF8 (muted-bg, diferencia da seção anterior); padding clamp(4.5rem, 9vw, 8rem) var(--pad)
- Grid 4fr / 7.5fr; esquerda sticky top clamp(2rem, 6vw, 4rem)
- Título serif clamp(2.2rem, 4vw, 3.2rem); apoio Hanken 1rem grafite-700 máx 30ch, número do WhatsApp como link sublinhado brasa-600
- Itens: border-bottom 1px areia; pergunta em button full-width, grid `1fr 34px`, padding 1.3rem 0, text-align left
  - Pergunta: serif 600 clamp(1.25rem, 2vw, 1.6rem) grafite-900
  - Indicador: círculo 34px border 1px nevoa com "+" (mesmo componente da S02, versão light)
- Resposta: grid-rows 0fr → 1fr 0.4s --ease-out; aberta: padding 0 3rem 1.4rem 0; Hanken 1rem/1.65 grafite-700, máx 60ch

### Interatividade
- Um aberto por vez; primeiro item aberto por padrão
- Hover pergunta: cor brasa-700; círculo border brasa-500
- aria-expanded/aria-controls em todos

### Responsividade
- 1080px: 1 coluna, título estático
- 640px: pergunta 1.15rem

---

## Seção 11: CTA Final + Footer

### Arquétipo e Constraints
- Arquétipo: Poster (fechamento dramático, eco do hero)
- Constraints: Headline gigante centrada (Tipografia), palavra vazada reprise + glow na base (Efeitos), CTA magnético (Interação)
- Justificativa: a página abre e fecha na mesma nota tipográfica; o poster final concentra a decisão num único gesto

### Conteúdo (exato da copy)
- Kicker: "24 a 26 de julho · Belo Horizonte"
- Título: "Pare de improvisar a *sua carreira.*"
- Texto: "Em três dias, você constrói o que a maioria adia a vida inteira: um negócio de palestrante com posicionamento, preço e plano."
- CTAs em .cta-row centralizada: botão fire grande "Agendar conversa com o Bruno" (Calendly, magnético) + botão contorno grande "Falar no WhatsApp"
- Microcopy: "24 a 26 de julho · Belo Horizonte · Garantia incondicional de 7 dias"

### Layout
- Fundo grafite-950; grain 0.5; brilho de base: radial-gradient(60% 100% at 50% 100%, rgba(237,125,43,0.18), transparent 75%) (idêntico ao hero aprovado)
- Palavra vazada reprise: "APOGEU" (stroke 1px rgba(246,244,241,0.07), clamp(6rem, 16vw, 15rem), no topo da seção, cortada pelo overflow)
- Conteúdo centrado, container máx 820px; padding clamp(6rem, 12vw, 10rem) var(--pad) clamp(4rem, 8vw, 6rem)
- Título serif clamp(2.8rem, 6.8vw, 5.6rem) lh 0.98, "sua carreira." itálico brasa-grad text-clip
- Texto Hanken clamp(1.02rem, 1vw + 0.8rem, 1.15rem) nevoa máx 52ch centrado, margem-top 1.6rem
- CTA .btn--fire grande: padding 1.2rem 3rem, font-size 0.92rem, margem-top 2.4rem
- Microcopy Jost 0.72rem uppercase ls 0.12em rgba(246,244,241,0.55), margem-top 1rem

### Footer (dentro da mesma seção, após divisor)
- Divisor: border-top 1px rgba(246,244,241,0.1), margem-top clamp(4rem, 8vw, 6rem)
- Layout: flex space-between align center, padding 2rem 0 0; em 640px empilha centrado gap 1.25rem
- Esquerda: logo Apogeu branco 120px (/.netlify/images?url=/assets/logo-apogeu-branco.png&w=240&q=80)
- Centro: "Suporte: 31 9 8424-0009 (WhatsApp)" Hanken 0.85rem nevoa, link wa.me
- Direita: "Apogeu do Palestrante © 2026" Jost 0.72rem uppercase ls 0.12em rgba(246,244,241,0.4)

### Animações
- Título: .reveal; CTA .reveal delay 0.15s
- CTA magnético (desktop, opcional): botão desloca até 6px em direção ao cursor dentro de raio 80px, retorno com --ease-spring; desativar em touch e prefers-reduced-motion
- Glow da base: breathing 6s alternate (opacity 0.85 → 1)

### Responsividade
- 640px: CTA full-width; título clamp(2.3rem, 11vw, 2.9rem)

---

## Notas de Implementação (para o /desenvolver)

1. **Assets:** foto do Bruno = /assets/perfil.png (1254x1254, raiz do site), usada no hero (colorida) e na S06 (duotone). Logos já em /assets/. NÃO usar bruno.jpg (400px, baixa resolução).
2. **CTA global:** todos os botões apontam para o checkout da Sympla (link a confirmar com o usuário; usar "#" com comentário TODO até lá). Considerar futuro tracking de clique (fbq InitiateCheckout) no padrão das outras páginas do site.
3. **JS único (script.js):** is-loaded no load; IntersectionObserver do .reveal (já existe); toggles de S02/S10 (um aberto por vez, aria); fallbacks de animation-timeline (detectar CSS.supports("animation-timeline: view()")).
4. **Sem libs externas:** tudo em CSS moderno + vanilla JS, como nas outras páginas do site.
5. **Netlify:** adicionar redirect `/dominando → /dominando/` (301) no netlify.toml na hora do deploy.
6. **Performance:** manter o padrão do encontro (pixel adiado pra idle, fonts com preconnect, imagens via /.netlify/images). Ao final, rodar a skill `optimize` (CSS crítico inline etc.) como etapa separada.
7. **Acessibilidade:** headings em ordem (h1 hero, h2 títulos de seção, h3 itens); aria-expanded nos toggles; alt na foto ("Bruno Bettini"); contraste mínimo AA nos textos muted sobre dark (nevoa #CFCBC4 sobre #141417 passa).
