# Copy - Bio (link-in-bio) | Apogeu do Palestrante

> Página de links para a bio do Instagram (@apogeudopalestrante).
> Mobile-first, uma coluna, foco em toque. Tom direto do Bruno. Sem emojis.
> IDENTIDADE VISUAL: 100% Apogeu (marfim/grafite/brasa, Cormorant + Jost + Hanken).
> NÃO usar a identidade da Avantik (roxo/dourado). O link da Avantik é apenas destino externo.
> LOGO: usar o logo do Apogeu do Palestrante (elmo espartano brasa + serif) no topo.
>   Arquivos em /assets: logo-apogeu-branco.png (fundo escuro), logo-apogeu-vertical.png
>   e logo-apogeu-horizontal.png (fundo claro). Servir via Netlify Image CDN.

---

## Header

- **Logo:** logo Apogeu do Palestrante (versão conforme o fundo: branca se hero escuro)
- **Foto:** foto do Bruno (assets/perfil.png), formato redondo, com moldura brasa sutil
- **Nome:** Bruno Bettini
- **Tagline:** Fundador da Avantik · Apogeu do Palestrante
- **Sub-tagline:** Ajudo palestrantes a viverem de palco — com método, mercado e posicionamento.
- **Micro-linha (chamada):** Escolha por onde começar.

---

## Botões (na ordem)

- **Botão 1**
  - Rótulo: Diagnóstico: O Jogo do Palestrante
  - Subtexto: Descubra em que fase do jogo você está. Grátis, 2 minutos.
  - Destino: /diagnostico/
  - Selo (opcional): GRÁTIS

- **Botão 2**
  - Rótulo: Encontro Entre Palestrantes — Belvedere
  - Subtexto: Evento presencial em BH. 08 de julho. Vagas limitadas.
  - Destino: /encontro/
  - Selo (opcional): 08 JUL

- **Botão 3**
  - Rótulo: Desvendando o Mercado de Palestras
  - Subtexto: A aula-mapa de onde está o dinheiro do mercado. R$ 47.
  - Destino: /desvendando/
  - Selo (opcional): R$ 47

- **Botão 4**
  - Rótulo: Ecossistema Apogeu do Palestrante
  - Subtexto: Tudo o que você precisa pra viver de palestras, num lugar só.
  - Destino: / (home do ecossistema)

- **Botão 5**
  - Rótulo: Ecossistema Avantik Palestras
  - Subtexto: O marketplace que te conecta a quem contrata palestrante.
  - Destino: https://avantikpalestras.com.br (abre em nova aba)

---

## Rodapé

- **Assinatura:** Apogeu do Palestrante
- **Instagram:** @apogeudopalestrante
- **Micro (legal/marca):** Uma iniciativa Avantik.

---

## Notas de implementação (para /gerar-design e /desenvolver)

- Destino final da página: pasta `/bio` (redirect 301 `/bio` → `/bio/` no netlify.toml).
- Botões em estilo "card" empilhado: fundo grafite/surface, borda sutil, seta ou brilho brasa no hover.
- Priorizar velocidade e clareza — é a primeira porta vinda do Instagram (tráfego mobile).
- Fundo grafite escuro com brilho brasa (coerente com os heroes das 3 landings) OU marfim claro — definir no /gerar-design.
- Reaproveitar `/shared-capi.js` e `/favicon.svg`. Rastrear clique em cada botão (evento de navegação) é opcional.
