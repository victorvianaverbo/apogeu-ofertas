/* Apogeu — helper de tracking: dispara Pixel (browser) + CAPI (server)
   com o MESMO event_id para o Meta deduplicar. Carregado por todas as paginas. */
(function () {
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  function cookie(name) {
    var m = document.cookie.match("(?:^|; )" + name + "=([^;]*)");
    return m ? decodeURIComponent(m[1]) : undefined;
  }

  // track(evento, dados_customizados, dados_do_usuario {em, ph, fn})
  window.track = function (eventName, custom, userData) {
    custom = custom || {};
    userData = userData || {};
    var id = uuid();

    // 1) Pixel no navegador (com eventID para dedup)
    if (typeof fbq === "function") fbq("track", eventName, custom, { eventID: id });

    // 2) CAPI no servidor (mesmo event_id)
    try {
      fetch("/.netlify/functions/capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          event_name: eventName,
          event_id: id,
          event_source_url: location.href,
          custom_data: custom,
          em: userData.em,
          ph: userData.ph,
          fn: userData.fn,
          fbp: cookie("_fbp"),
          fbc: cookie("_fbc"),
        }),
      }).catch(function () {});
    } catch (e) {}
  };
})();
