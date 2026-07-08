/* Anamnese da Imersão — Apogeu do Palestrante
   Wizard multi-etapa (1 bloco por etapa) fiel ao formulário original.
   Fluxo: captura nome/telefone/e-mail LOGO NO INÍCIO -> grava no Supabase
   (registro "iniciado") -> ao concluir, faz PATCH do mesmo registro
   com todas as respostas (status "completo"). Estado em localStorage. */
(function () {
  "use strict";

  // --- Supabase (anon key pública, mesma do projeto Apogeu/Avantik) ---
  // Requer a tabela `anamnese_imersao` com RLS: INSERT + UPDATE anônimos.
  const SUPA_URL = "https://ajokzpjguhfxxudteetr.supabase.co";
  const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjQ1NTQsImV4cCI6MjA5MDQwMDU1NH0.TG-ASfMGgNY4BoHsFQx8TQ-4HPVsdbGEu4zJuFAeiNg";
  const TABLE = "anamnese_imersao";
  const KEY = "anamnese-imersao";

  // ======================= ESTRUTURA DAS ETAPAS =======================
  // Cada etapa = uma seção do formulário. Campos declarativos.
  // Tipos: text | tel | email | textarea | radio | checks | consent
  const STEPS = [
    {
      id: "identificacao",
      kicker: "Identificação",
      title: "Vamos começar por você",
      lead: "Preencha seus dados de contato. Assim a equipe consegue falar com você antes da imersão, mesmo que você conclua o restante depois.",
      fields: [
        { type: "text", key: "nome", label: "Nome completo", placeholder: "Seu nome completo", required: true },
        { type: "tel", key: "telefone", label: "Telefone / WhatsApp", placeholder: "(00) 00000-0000", required: true },
        { type: "email", key: "email", label: "E-mail principal", placeholder: "voce@email.com", required: true },
      ],
    },
    {
      id: "confirmacao",
      kicker: "Confirmação inicial",
      title: "Sobre este formulário",
      note: "Este formulário reúne o essencial para preparar sua participação: contratação, identificação, alimentação, logística, conforto, registros de imagem e objetivos profissionais.\n\n📌 A imersão é presencial, prática e intensiva. Responda apenas o necessário para a equipe preparar sua experiência com clareza.",
      fields: [
        { type: "consent", key: "confirmacao_inicial", required: true,
          text: "Li e compreendi que este formulário será usado para preparação da minha participação na imersão." },
      ],
    },
    {
      id: "contratacao",
      kicker: "1 · Produtos da sua contratação",
      title: "Quais entregas fazem parte da sua contratação atual?",
      lead: "Selecione a alternativa que representa sua contratação atual. Essa resposta direciona você para o alinhamento correto.",
      fields: [
        { type: "radio", key: "contratacao", required: true, help: "Em caso de dúvida, marque a última opção.",
          options: [
            "Imersão Presencial",
            "Imersão Presencial + Mentoria Anual em Grupo",
            "Imersão Presencial + Mentoria Anual em Grupo + 01 Sessão Individual Estratégica",
            "Ainda tenho dúvida sobre o que está incluso na minha contratação",
          ] },
      ],
    },
    {
      id: "alinhamento",
      kicker: "Alinhamento da contratação",
      // Etapa condicional — resolvida em runtime por buildAlinhamento(data)
      dynamic: true,
    },
    {
      id: "ident_extra",
      kicker: "2 · Identificação do participante",
      title: "Um pouco mais sobre você",
      lead: "Nome, telefone e e-mail já estão registrados. Estes campos são opcionais e ajudam a equipe a te reconhecer.",
      fields: [
        { type: "text", key: "nome_preferido", label: "Como prefere ser chamado(a)", placeholder: "Ex.: Bruno" },
        { type: "text", key: "cidade_estado", label: "Cidade e estado onde mora", placeholder: "Cidade / UF" },
        { type: "text", key: "profissao", label: "Profissão / área de atuação", placeholder: "Sua profissão" },
        { type: "text", key: "instagram", label: "Instagram ou principal canal profissional", placeholder: "@seuperfil (opcional)" },
      ],
    },
    {
      id: "checklist",
      kicker: "3 · Checklist prático da imersão",
      title: "Como serão os dias",
      note: "🕘 CHEGADA — Credenciamento às 8h45. Sala aberta às 9h. Início às 9h05.\n☕ RECEPTIVO — Haverá um receptivo pela manhã; recomendamos chegar alimentado.\n⏳ JORNADA — Programação prevista das 9h às 20h em cada dia.\n🍽️ ALMOÇO — Liberação prevista para 12h30; você escolhe onde almoçar.\n☕ COFFEE BREAK — Previsto para 15h30.\n👕 CONFORTO — Roupas confortáveis. Sala climatizada; leve um agasalho.\n💦 EQUIPAMENTOS — Leve garrafa de água, notebook, carregadores e material de anotação.\n🏨 DESPESAS — Hospedagem, deslocamento, estacionamento e transporte ficam por conta de cada participante.",
      fields: [
        { type: "consent", key: "checklist_lido", required: true, text: "Li o checklist prático da imersão." },
        { type: "radio", key: "vem_de_outra_cidade", label: "Você virá de outra cidade?",
          options: [
            "Não, moro na cidade ou região próxima",
            "Sim, irei me deslocar de outra cidade",
            "Ainda estou definindo minha logística",
          ] },
        { type: "textarea", key: "info_pratica", label: "Alguma informação prática que a equipe deve saber?",
          help: "Ex.: chegada após viagem, dúvida sobre restaurantes próximos, deslocamento ou estacionamento.",
          placeholder: "Opcional" },
      ],
    },
    {
      id: "alimentacao",
      kicker: "4 · Alimentação",
      title: "Cuidados com a alimentação",
      note: "🍽️ Estas respostas ajudam a equipe a organizar o receptivo da manhã e o coffee break da tarde.\n📌 O preenchimento não garante cardápio individual, mas ajuda a avaliar possibilidades.\n⚠️ Em caso de alergias severas ou restrições rígidas, recomendamos levar seu próprio alimento seguro.",
      fields: [
        { type: "checks", key: "restricoes", required: true, label: "Você possui alguma restrição alimentar ou preferência importante?",
          help: "Marque todas as opções que se aplicam.",
          options: [
            "Não possuo restrições alimentares relevantes",
            "Intolerância à lactose",
            "Restrição a glúten / doença celíaca",
            "Alergia a castanhas ou amendoim",
            "Alergia a frutos do mar",
            "Vegetariano(a)",
            "Vegano(a)",
            "Restrição a açúcar",
            "Restrição a cafeína",
            "Restrição por orientação médica",
            "Outra restrição ou cuidado alimentar",
          ] },
        { type: "radio", key: "controle_rigoroso", required: true,
          label: "Alguma restrição exige controle rigoroso, alimento específico ou cuidado com contaminação cruzada?",
          options: ["Não", "Sim", "Não tenho certeza", "Prefiro conversar individualmente com a equipe"] },
        { type: "textarea", key: "descricao_alimentar", label: "Descreva o cuidado alimentar necessário, caso exista",
          help: "Compartilhe apenas o necessário para orientação do receptivo e do coffee break.", placeholder: "Opcional" },
      ],
    },
    {
      id: "emergencia",
      kicker: "5 · Contato de emergência",
      title: "Um contato de apoio",
      note: "🆘 Como prática de cuidado em eventos presenciais, solicitamos um contato que possa ser acionado caso necessário. Nunca precisamos acionar em edições anteriores, mas mantemos esse registro por precaução.",
      fields: [
        { type: "text", key: "emg_nome", label: "Nome do contato de emergência", placeholder: "Nome completo", required: true },
        { type: "text", key: "emg_relacao", label: "Grau de relação com você", placeholder: "Ex.: cônjuge, familiar, sócio(a)", required: true },
        { type: "tel", key: "emg_telefone", label: "Telefone / WhatsApp do contato", placeholder: "(00) 00000-0000", required: true },
        { type: "radio", key: "emg_autorizacao", required: true, label: "Em caso de necessidade, a equipe pode acionar essa pessoa?",
          options: ["Sim", "Sim, apenas em situação de emergência real", "Prefiro ser consultado(a) antes, se possível"] },
      ],
    },
    {
      id: "saude",
      kicker: "6 · Saúde, conforto e acessibilidade",
      title: "Cuidados práticos",
      note: "🛡️ Esta seção não tem finalidade diagnóstica.\n✅ O objetivo é identificar cuidados práticos que tornem sua participação mais confortável. Não é necessário informar diagnóstico.",
      fields: [
        { type: "radio", key: "condicao_atual", required: true,
          label: "Como você avalia sua condição atual para participar de uma imersão prática, intensa e com momentos de fala ou exposição pontual?",
          options: [
            "Estou bem e me sinto apto(a) a participar",
            "Estou em um momento sensível, mas me sinto apto(a) a participar",
            "Estou muito sensível e preciso de cuidado em algumas atividades",
            "Prefiro conversar individualmente com a equipe antes da imersão",
          ] },
        { type: "radio", key: "acompanhamento", required: true,
          label: "Existe algum acompanhamento médico, psicológico, psiquiátrico ou terapêutico relevante que considere importante informar?",
          help: "Esta pergunta existe apenas para cuidado e adaptação da experiência. Não é necessário informar diagnóstico.",
          options: [
            "Não",
            "Sim, mas não há restrição para participar",
            "Sim, e recomendo que a equipe tenha atenção a alguns pontos",
            "Prefiro conversar individualmente com a equipe",
          ] },
        { type: "radio", key: "medicacao", required: true,
          label: "Você utiliza medicação contínua ou possui orientação profissional que possa exigir atenção durante o evento?",
          help: "Não informe nome de medicamento se não quiser. O foco é apenas saber se existe algum cuidado prático.",
          options: [
            "Não",
            "Sim, mas não preciso de suporte específico",
            "Sim, e preciso que a equipe esteja ciente de algum cuidado",
            "Prefiro conversar individualmente com a equipe",
          ] },
        { type: "textarea", key: "cuidado_saude",
          label: "Existe cuidado com medicação, pressão, glicemia, alergias, crises, sensibilidade sensorial ou outro ponto de saúde?",
          help: "Compartilhe apenas o necessário para cuidado prático durante a imersão.", placeholder: "Opcional" },
        { type: "radio", key: "restricao_atividades", required: true,
          label: "Você tem restrição a atividades com movimento, permanência em pé, escrita, respiração guiada, interação em dupla ou dinâmica em grupo?",
          options: [
            "Não",
            "Sim, prefiro adaptar algumas atividades",
            "Sim, posso precisar apenas observar alguns momentos",
            "Prefiro conversar individualmente com a equipe",
          ] },
        { type: "textarea", key: "qual_cuidado", label: "Qual cuidado a equipe deve considerar, se houver?",
          help: "Ex.: mobilidade, assento específico, sensibilidade a som ou luz, necessidade de pausa, cuidado emocional.",
          placeholder: "Opcional" },
      ],
    },
    {
      id: "perfil",
      kicker: "7 · Perfil profissional",
      title: "Seu momento profissional",
      lead: "Estas respostas ajudam a equipe a entender sua fase atual e tornar a experiência mais aplicável.",
      fields: [
        { type: "radio", key: "momento_atual", required: true, label: "Qual frase descreve melhor seu momento atual?",
          options: [
            "Iniciando minha transição de carreira",
            "Tenho conteúdo, mas ainda não consigo vender com clareza",
            "Já vendo palestras, mentorias ou treinamentos, mas quero estruturar melhor",
            "Estou começando a transformar minha experiência em produto",
            "Já tenho autoridade, mas quero refinar posicionamento e oferta",
            "Quero destravar minha comunicação e exposição",
            { label: "Outro momento profissional", other: true },
          ] },
        { type: "textarea", key: "construir_destravar", required: true,
          label: "O que você quer construir ou destravar nesta imersão?", placeholder: "Escreva com suas palavras" },
        { type: "textarea", key: "principal_desafio", label: "Qual é o principal desafio profissional que te trouxe até aqui?", placeholder: "Opcional" },
        { type: "textarea", key: "expectativa", label: "Existe alguma expectativa específica que você gostaria que a equipe soubesse?", placeholder: "Opcional" },
      ],
    },
    {
      id: "imagem",
      kicker: "8 · Imagem e comunicação",
      title: "Autorizações finais",
      note: "📸 Durante a imersão faremos fotos e vídeos curtos para registros do evento, bastidores, divulgação institucional, comunicação da comunidade e materiais comerciais do Apogeu do Palestrante.",
      submit: true,
      fields: [
        { type: "consent", key: "autoriza_imagem", required: true,
          text: "Autorizo o uso da minha imagem, voz e registros captados durante a imersão em materiais institucionais, comerciais e de divulgação do Apogeu do Palestrante." },
        { type: "consent", key: "confirmacao_final", required: true,
          text: "Confirmo que as respostas refletem meu momento atual e poderão ser usadas pela equipe para preparação da imersão, comunicação relacionada ao evento e ajustes práticos da experiência." },
      ],
    },
  ];
  const TOTAL = STEPS.length; // 11 etapas de conteúdo

  // Etapa condicional de alinhamento (1A/1B/1C/1D)
  function buildAlinhamento(data) {
    const c = data.contratacao;
    if (c === STEPS[2].fields[0].options[1]) {
      return {
        title: "Imersão + Mentoria Anual em Grupo",
        note: "👥 Sua contratação envolve Imersão Presencial e Mentoria Anual em Grupo.\n🔥 A imersão acelera construção, clareza e aplicação prática.\n🧭 A mentoria anual é o espaço de continuidade e evolução ao longo do tempo.\n➕ A 01 Sessão Individual Estratégica não faz parte desta modalidade, salvo se descrita na oferta que você aceitou.",
        fields: [{ type: "consent", key: "alinhamento_check", required: true,
          text: "Confirmo que minha contratação envolve Imersão Presencial + Mentoria Anual em Grupo e que a 01 Sessão Individual Estratégica não faz parte desta modalidade, salvo se estiver descrita na oferta que aceitei." }],
      };
    }
    if (c === STEPS[2].fields[0].options[2]) {
      return {
        title: "Imersão + Mentoria + Sessão Individual",
        note: "👥 Sua contratação envolve Imersão Presencial, Mentoria Anual em Grupo e 01 Sessão Individual Estratégica.\n🔥 A imersão é a experiência prática e intensiva.\n➕ A sessão individual, quando incluída, é uma entrega pontual, com agenda e condução específica.",
        fields: [{ type: "consent", key: "alinhamento_check", required: true,
          text: "Confirmo que minha contratação envolve Imersão Presencial + Mentoria Anual em Grupo + 01 Sessão Individual Estratégica, conforme condição comercial aceita." }],
      };
    }
    if (c === STEPS[2].fields[0].options[3]) {
      return {
        title: "Vamos confirmar sua contratação",
        note: "📌 Tudo certo. Registre sua dúvida para que a equipe possa conferir antes da imersão.",
        fields: [{ type: "textarea", key: "duvida_contratacao", required: true,
          label: "Qual ponto você gostaria de confirmar sobre sua contratação?",
          help: "Ex.: quero confirmar se tenho Mentoria Anual em Grupo, 01 Sessão Individual Estratégica ou apenas Imersão Presencial.",
          placeholder: "Descreva sua dúvida" }],
      };
    }
    // Padrão: Imersão Presencial (opção 0)
    return {
      title: "Imersão Presencial",
      note: "🔥 A imersão é uma entrega própria, prática, presencial e coletiva.\n📌 Ela trabalha posicionamento, produtos, temas, precificação, calendário de ações, prospecção, vendas, comunicação, storytelling e próximos passos.\n👥 A Mentoria Anual em Grupo e a 01 Sessão Individual Estratégica não fazem parte desta modalidade, salvo se descritas na oferta que você aceitou.",
      fields: [{ type: "consent", key: "alinhamento_check", required: true,
        text: "Confirmo que minha contratação atual é Imersão Presencial e que Mentoria Anual em Grupo e 01 Sessão Individual Estratégica não fazem parte desta modalidade, salvo se estiverem descritas na oferta que aceitei." }],
    };
  }

  function resolveStep(i) {
    const s = STEPS[i];
    if (s.dynamic && s.id === "alinhamento") {
      return Object.assign({ id: s.id, kicker: s.kicker }, buildAlinhamento(state.data));
    }
    return s;
  }

  // ======================= ESTADO =======================
  let state = { stage: "intro", step: 0, data: {}, leadId: null };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.stage) state = saved;
  } catch (e) {}
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  // ======================= SUPABASE =======================
  function headers(extra) {
    return Object.assign({
      "apikey": SUPA_KEY,
      "Authorization": "Bearer " + SUPA_KEY,
      "Content-Type": "application/json",
    }, extra || {});
  }

  // Cria o registro parcial (contato) assim que capturamos nome/telefone/e-mail.
  function createLead() {
    const utm = (window.getUTMs && window.getUTMs()) || {};
    const payload = {
      status: "iniciado",
      nome: state.data.nome || null,
      telefone: state.data.telefone || null,
      email: state.data.email || null,
      respostas: Object.assign({ iniciado_em: new Date().toISOString() }, utm),
    };
    return fetch(SUPA_URL + "/rest/v1/" + TABLE, {
      method: "POST",
      headers: headers({ "Prefer": "return=representation" }),
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) {
        if (rows && rows[0] && rows[0].id) { state.leadId = rows[0].id; persist(); }
      })
      .catch(function () {});
  }

  // Conclui: atualiza o registro com todas as respostas (ou insere completo se
  // o INSERT inicial tiver falhado). Retorna sempre uma promise resolvida.
  function finishLead() {
    const utm = (window.getUTMs && window.getUTMs()) || {};
    const d = state.data;
    const respostas = Object.assign({}, d, utm, { concluido_em: new Date().toISOString() });
    delete respostas.nome; delete respostas.telefone; delete respostas.email; delete respostas.contratacao;
    const cols = {
      status: "completo",
      nome: d.nome || null,
      telefone: d.telefone || null,
      email: d.email || null,
      contratacao: d.contratacao || null,
      respostas: respostas,
    };
    if (state.leadId) {
      return fetch(SUPA_URL + "/rest/v1/" + TABLE + "?id=eq." + encodeURIComponent(state.leadId), {
        method: "PATCH",
        headers: headers({ "Prefer": "return=minimal" }),
        body: JSON.stringify(cols),
        keepalive: true,
      }).catch(function () {});
    }
    return fetch(SUPA_URL + "/rest/v1/" + TABLE, {
      method: "POST",
      headers: headers({ "Prefer": "return=minimal" }),
      body: JSON.stringify(cols),
      keepalive: true,
    }).catch(function () {});
  }

  // ======================= RENDER =======================
  const card = document.getElementById("card");
  const introHead = document.getElementById("introHead");
  const esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  function fieldHTML(f, data) {
    const v = data[f.key];
    const help = f.help ? '<p class="help">' + esc(f.help) + "</p>" : "";
    const reqStar = f.required ? ' <span class="req">*</span>' : "";
    const lbl = f.label ? '<span class="lbl">' + esc(f.label) + reqStar + "</span>" : "";

    if (f.type === "consent") {
      const on = v ? " checked" : "";
      return (
        '<div class="consent-block" data-key="' + f.key + '" data-type="consent"' + (f.required ? ' data-required="1"' : "") + ">" +
        '<label class="consent"><input type="checkbox" data-name="' + f.key + '"' + on + ">" +
        '<span class="mark"></span><span class="txt">' + esc(f.text) + "</span></label>" +
        '<p class="err">Marque para continuar.</p></div>'
      );
    }

    if (f.type === "radio" || f.type === "checks") {
      const isRadio = f.type === "radio";
      const cls = isRadio ? "radio" : "check";
      const inputType = isRadio ? "radio" : "checkbox";
      const selected = isRadio ? (v || "") : (Array.isArray(v) ? v : []);
      const opts = f.options.map(function (o, idx) {
        const isOther = typeof o === "object" && o.other;
        const label = isOther ? o.label : o;
        const checked = isRadio ? (selected === label) : (selected.indexOf(label) > -1);
        let html =
          '<label class="opt ' + cls + '"><input type="' + inputType + '" name="' + f.key + '" value="' + esc(label) + '"' +
          (checked ? " checked" : "") + (isOther ? ' data-other="1"' : "") + ">" +
          '<span class="mark"></span><span class="txt">' + esc(label) + "</span></label>";
        if (isOther) {
          const ov = data[f.key + "_outro"] || "";
          html +=
            '<div class="opt-other"><input type="text" data-name="' + f.key + '_outro" placeholder="Qual?" value="' +
            esc(ov) + '"' + (checked ? "" : " disabled") + "></div>";
        }
        return html;
      }).join("");
      return (
        '<div class="field"><div class="opts-block" data-key="' + f.key + '" data-type="' + f.type + '"' +
        (f.required ? ' data-required="1"' : "") + ">" + lbl + help +
        '<div class="opts">' + opts + "</div>" +
        '<p class="err">Selecione ' + (isRadio ? "uma opção." : "ao menos uma opção.") + "</p></div></div>"
      );
    }

    if (f.type === "textarea") {
      return (
        '<div class="field' + '" data-field="' + f.key + '">' + lbl + help +
        '<textarea data-name="' + f.key + '" data-type="textarea"' + (f.required ? ' data-required="1"' : "") +
        ' placeholder="' + esc(f.placeholder || "") + '">' + esc(v || "") + "</textarea>" +
        '<p class="err">Campo obrigatório.</p></div>'
      );
    }

    // text | tel | email
    return (
      '<div class="field" data-field="' + f.key + '">' + lbl + help +
      '<input type="' + f.type + '" data-name="' + f.key + '" data-type="' + f.type + '"' +
      (f.required ? ' data-required="1"' : "") + ' placeholder="' + esc(f.placeholder || "") + '" value="' + esc(v || "") + '"' +
      (f.type === "email" ? ' inputmode="email"' : f.type === "tel" ? ' inputmode="tel"' : "") + ">" +
      '<p class="err">Campo obrigatório.</p></div>'
    );
  }

  function render() {
    persist();
    if (state.stage === "intro") return renderIntro();
    if (state.stage === "success") return renderSuccess();
    return renderStep();
  }

  function renderIntro() {
    if (introHead) introHead.style.display = "";
    const started = Object.keys(state.data).length > 0;
    card.innerHTML =
      '<div class="center-block">' +
      '<p class="sec-kicker">Leva poucos minutos</p>' +
      '<h2 class="sec-title">Tudo pronto para começar?</h2>' +
      '<p class="sec-lead">São 11 etapas rápidas. Você pode responder com calma — o preenchimento fica salvo neste dispositivo se precisar continuar depois.</p>' +
      '<button class="btn btn-primary" id="start">' + (started ? "Continuar preenchimento" : "Começar anamnese") + "</button>" +
      "</div>";
    card.querySelector("#start").addEventListener("click", function () {
      state.stage = "step";
      if (!started) state.step = 0;
      render();
      scrollTop();
    });
  }

  function renderStep() {
    if (introHead) introHead.style.display = "none";
    const i = state.step;
    const s = resolveStep(i);
    const n = i + 1;
    const pct = Math.round((i / TOTAL) * 100);
    const fields = (s.fields || []).map(function (f) { return fieldHTML(f, state.data); }).join("");
    card.innerHTML =
      '<div class="progress"><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<span class="count">Etapa ' + n + " de " + TOTAL + "</span></div>" +
      '<p class="sec-kicker">' + esc(s.kicker) + "</p>" +
      '<h2 class="sec-title">' + esc(s.title) + "</h2>" +
      (s.lead ? '<p class="sec-lead">' + esc(s.lead) + "</p>" : "") +
      (s.note ? '<div class="note">' + esc(s.note) + "</div>" : "") +
      '<div class="fields">' + fields + "</div>" +
      '<div class="nav-row">' +
      '<button class="btn-back" id="back"' + (i === 0 ? " hidden" : "") + ">← Voltar</button>" +
      '<button class="btn btn-primary" id="next">' + (s.submit ? "Enviar anamnese" : "Continuar →") + "</button>" +
      "</div>";

    // toggle do input "outro"
    card.querySelectorAll('input[data-other="1"]').forEach(function (radio) {
      const group = radio.name;
      card.querySelectorAll('input[name="' + group + '"]').forEach(function (r) {
        r.addEventListener("change", function () {
          const other = card.querySelector('.opt-other input[data-name="' + group + '_outro"]');
          if (other) {
            const otherRadio = card.querySelector('input[name="' + group + '"][data-other="1"]');
            other.disabled = !(otherRadio && otherRadio.checked);
            if (!other.disabled) other.focus();
          }
        });
      });
    });

    const back = card.querySelector("#back");
    if (back) back.addEventListener("click", function () {
      collect(s); // salva sem validar
      state.step = i - 1;
      render(); scrollTop();
    });
    card.querySelector("#next").addEventListener("click", function () {
      collect(s);
      if (!validate(s)) return;
      onStepDone(s, i);
    });
  }

  function onStepDone(s, i) {
    // Captura inicial concluída -> grava o contato no Supabase (não bloqueia a UX)
    if (s.id === "identificacao" && !state.leadId) createLead();

    if (s.submit) {
      const btn = card.querySelector("#next");
      if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }
      finishLead().then(function () {
        state.stage = "success";
        render(); scrollTop();
      });
      return;
    }
    state.step = i + 1;
    render(); scrollTop();
  }

  // Lê os valores da etapa atual do DOM para state.data
  function collect(s) {
    (s.fields || []).forEach(function (f) {
      if (f.type === "consent") {
        const el = card.querySelector('input[data-name="' + f.key + '"]');
        state.data[f.key] = !!(el && el.checked);
      } else if (f.type === "radio") {
        const el = card.querySelector('input[name="' + f.key + '"]:checked');
        state.data[f.key] = el ? el.value : "";
        const other = card.querySelector('.opt-other input[data-name="' + f.key + '_outro"]');
        if (other) state.data[f.key + "_outro"] = other.value.trim();
      } else if (f.type === "checks") {
        const els = card.querySelectorAll('input[name="' + f.key + '"]:checked');
        state.data[f.key] = Array.prototype.map.call(els, function (e) { return e.value; });
      } else {
        const el = card.querySelector('[data-name="' + f.key + '"]');
        state.data[f.key] = el ? el.value.trim() : "";
      }
    });
    persist();
  }

  function validate(s) {
    let ok = true, firstBad = null;
    card.querySelectorAll(".invalid").forEach(function (n) { n.classList.remove("invalid"); });
    (s.fields || []).forEach(function (f) {
      if (!f.required) return;
      let good = true;
      if (f.type === "consent") good = !!state.data[f.key];
      else if (f.type === "checks") good = Array.isArray(state.data[f.key]) && state.data[f.key].length > 0;
      else good = !!(state.data[f.key] && String(state.data[f.key]).trim());
      // e-mail simples
      if (good && f.type === "email") good = /.+@.+\..+/.test(state.data[f.key]);
      if (!good) {
        ok = false;
        let node;
        if (f.type === "consent") node = card.querySelector('.consent-block[data-key="' + f.key + '"]');
        else if (f.type === "radio" || f.type === "checks") node = card.querySelector('.opts-block[data-key="' + f.key + '"]');
        else node = card.querySelector('[data-field="' + f.key + '"]');
        if (node) { node.classList.add("invalid"); if (!firstBad) firstBad = node; }
      }
    });
    if (firstBad) firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
    return ok;
  }

  function renderSuccess() {
    if (introHead) introHead.style.display = "none";
    const first = state.data.nome ? state.data.nome.split(" ")[0] : "";
    card.innerHTML =
      '<div class="center-block">' +
      '<div class="badge"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></div>' +
      '<p class="sec-kicker">Anamnese recebida</p>' +
      '<h2 class="sec-title">' + (first ? esc(first) + ", tudo" : "Tudo") + " certo!</h2>" +
      '<p class="sec-lead">Recebemos as suas respostas. A equipe do Apogeu vai usar essas informações para preparar a sua experiência. Nos vemos na imersão.</p>' +
      '<a class="btn btn-primary" href="/">Voltar ao início</a>' +
      '<p class="micro">Precisa ajustar algo? Fale com a equipe pelo WhatsApp (31) 9 8424-0009.</p>' +
      "</div>";
    // limpa o rascunho local após concluir
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  function scrollTop() {
    try {
      const y = card.getBoundingClientRect().top + window.pageYOffset - 24;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    } catch (e) { window.scrollTo(0, 0); }
  }

  render();
})();
