/* Dominando o Mercado de Palestras — interações da página */

var SUPPORTS_VIEW_TIMELINE = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()"));
var REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Hero sem animação de entrada; animações ambientes só após o load */
window.addEventListener("load", function () {
  document.documentElement.classList.add("is-loaded");
});

/* Reveal on scroll com stagger por ordem entre irmãos */
(function () {
  var els = document.querySelectorAll(".reveal, .reveal-clip, .reveal-mask, .reveal-line");
  if (!("IntersectionObserver" in window) || !els.length) {
    els.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var siblings = Array.prototype.filter.call(els, function (s) {
        return s.parentElement === el.parentElement;
      });
      var idx = siblings.indexOf(el);
      el.style.setProperty("--d", (idx > 0 ? idx * 0.09 : 0) + "s");
      el.classList.add("is-in");
      io.unobserve(el);
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
  els.forEach(function (el) { io.observe(el); });
})();

/* Losangos da timeline: marcam .is-in no próprio item */
(function () {
  var itens = document.querySelectorAll(".tl");
  if (!("IntersectionObserver" in window) || !itens.length) {
    itens.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  itens.forEach(function (el) { io.observe(el); });
})();

/* Acordeões (S02 entregas + S10 FAQ): um aberto por vez no grupo */
document.querySelectorAll("[data-acc]").forEach(function (group) {
  group.addEventListener("click", function (e) {
    var btn = e.target.closest(".acc__toggle");
    if (!btn || !group.contains(btn)) return;
    var item = btn.closest(".acc__item");
    var estavaAberto = item.classList.contains("is-open");
    group.querySelectorAll(".acc__item.is-open").forEach(function (aberto) {
      aberto.classList.remove("is-open");
      var t = aberto.querySelector(".acc__toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
    if (!estavaAberto) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

/* Fallbacks para navegadores sem animation-timeline: view() */
if (!SUPPORTS_VIEW_TIMELINE && !REDUCED_MOTION) {
  /* Linha de progresso do cronograma cresce com o scroll */
  (function () {
    var tl = document.querySelector(".crono__timeline");
    var bar = document.querySelector(".crono__progress");
    if (!tl || !bar) return;
    var ticking = false;
    function atualiza() {
      ticking = false;
      var r = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = r.height + vh * 0.6;
      var feito = Math.min(Math.max(vh - r.top, 0), total);
      bar.style.transform = "scaleY(" + (feito / total).toFixed(4) + ")";
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(atualiza); }
    }, { passive: true });
    atualiza();
  })();

  /* Frases da S04 acendem uma a uma */
  (function () {
    var frases = document.querySelectorAll(".frase");
    if (!("IntersectionObserver" in window) || !frases.length) {
      frases.forEach(function (f) { f.classList.add("is-lit"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var f = entry.target;
        var idx = Array.prototype.indexOf.call(frases, f);
        f.style.transitionDelay = (idx * 0.12) + "s";
        f.classList.add("is-lit");
        io.unobserve(f);
      });
    }, { threshold: 0.6 });
    frases.forEach(function (f) { io.observe(f); });
  })();
}

/* Captura de lead: modal nome+WhatsApp antes do Calendly/WhatsApp,
   grava no Supabase (REST, com timeout, nunca bloqueia o redirecionamento) */
(function () {
  var SUPA_URL = "https://ajokzpjguhfxxudteetr.supabase.co";
  var SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb2t6cGpndWhmeHh1ZHRlZXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjQ1NTQsImV4cCI6MjA5MDQwMDU1NH0.TG-ASfMGgNY4BoHsFQx8TQ-4HPVsdbGEu4zJuFAeiNg";
  var TABELA = "dominando-o-mercado-de-palestras";

  var modal = document.getElementById("leadModal");
  var form = document.getElementById("leadForm");
  if (!modal || !form) return;
  var nota = document.getElementById("leadNota");
  var inputNome = document.getElementById("leadNome");
  var inputFone = document.getElementById("leadFone");
  var botao = document.getElementById("leadEnviar");
  var destinoUrl = "";
  var destinoTipo = "";

  document.querySelectorAll(".cta-row a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      destinoUrl = link.href;
      destinoTipo = destinoUrl.indexOf("calendly.com") > -1 ? "calendly" : "whatsapp";
      nota.textContent = destinoTipo === "calendly"
        ? "Você segue direto pro agendamento com o Bruno."
        : "Você segue direto pro WhatsApp.";
      abrir();
    });
  });

  function abrir() {
    modal.hidden = false;
    document.body.classList.add("modal-open");
    setTimeout(function () { inputNome.focus(); }, 60);
  }
  function fechar() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  modal.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", fechar);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) fechar();
  });

  function salvarLead(nome, telefone) {
    var utm = (window.getUTMs && window.getUTMs()) || {};
    var payload = Object.assign({
      nome: nome,
      telefone: telefone,
      destino: destinoTipo,
      origem: "dominando-o-mercado-de-palestras",
    }, utm);
    var ctrl = ("AbortController" in window) ? new AbortController() : null;
    if (ctrl) setTimeout(function () { ctrl.abort(); }, 1800);
    return fetch(SUPA_URL + "/rest/v1/" + TABELA, {
      method: "POST",
      headers: {
        "apikey": SUPA_KEY,
        "Authorization": "Bearer " + SUPA_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(payload),
      keepalive: true,
      signal: ctrl ? ctrl.signal : undefined,
    }).catch(function () {});
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var nome = inputNome.value.trim();
    var telefone = inputFone.value.trim();
    if (!nome || !telefone) return;
    botao.disabled = true;
    botao.textContent = "Enviando...";
    if (typeof window.track === "function") {
      window.track("Lead", { content_name: TABELA, destino: destinoTipo }, {
        fn: nome,
        ph: telefone.replace(/\D/g, ""),
      });
    }
    salvarLead(nome, telefone).then(function () {
      botao.disabled = false;
      botao.textContent = "Continuar";
      fechar();
      var win = window.open(destinoUrl, "_blank", "noopener");
      if (!win) window.location.href = destinoUrl;
    });
  });
})();

/* CTA final magnético (só desktop com mouse, sem reduced motion) */
(function () {
  if (REDUCED_MOTION || !window.matchMedia("(hover: hover)").matches) return;
  var btn = document.getElementById("cta-final");
  if (!btn) return;
  var RAIO = 80;
  var MAX = 6;
  var alvoX = 0, alvoY = 0, atualX = 0, atualY = 0, animando = false;
  function anima() {
    atualX += (alvoX - atualX) * 0.18;
    atualY += (alvoY - atualY) * 0.18;
    if (Math.abs(alvoX - atualX) < 0.1 && Math.abs(alvoY - atualY) < 0.1) {
      atualX = alvoX; atualY = alvoY; animando = false;
    }
    btn.style.transform = (atualX || atualY)
      ? "translate(" + atualX.toFixed(2) + "px, " + atualY.toFixed(2) + "px)"
      : "";
    if (animando) requestAnimationFrame(anima);
  }
  window.addEventListener("mousemove", function (ev) {
    var r = btn.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;
    var dx = ev.clientX - cx;
    var dy = ev.clientY - cy;
    var alcance = RAIO + Math.max(r.width, r.height) / 2;
    var d = Math.hypot(dx, dy);
    if (d < alcance) {
      alvoX = Math.max(-MAX, Math.min(MAX, (dx / alcance) * MAX * 1.6));
      alvoY = Math.max(-MAX, Math.min(MAX, (dy / alcance) * MAX * 1.6));
    } else {
      alvoX = 0; alvoY = 0;
    }
    if (!animando) { animando = true; requestAnimationFrame(anima); }
  }, { passive: true });
})();
