// Meta Conversions API (server-side) — Apogeu do Palestrante
// Recebe eventos do browser e reenvia ao Meta com o mesmo event_id (dedup).
// O Access Token fica em variavel de ambiente (META_CAPI_TOKEN), nunca no repo.

const crypto = require("crypto");

const PIXEL_ID = "1028501882025260";
const API_VERSION = "v21.0";

const sha256 = (v) => crypto.createHash("sha256").update(v).digest("hex");
const normEmail = (e) => String(e || "").trim().toLowerCase();
const normPhone = (p) => String(p || "").replace(/\D/g, "");
const normName = (n) => String(n || "").trim().toLowerCase();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const TOKEN = process.env.META_CAPI_TOKEN;
  if (!TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: "META_CAPI_TOKEN nao configurado" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "JSON invalido" }) };
  }

  if (!body.event_name || !body.event_id) {
    return { statusCode: 400, body: JSON.stringify({ error: "event_name e event_id obrigatorios" }) };
  }

  const h = event.headers || {};
  const ip =
    h["x-nf-client-connection-ip"] ||
    (h["x-forwarded-for"] || "").split(",")[0].trim() ||
    undefined;
  const ua = h["user-agent"];

  // user_data: hash SHA-256 no servidor (PII nunca sai em texto puro)
  const user_data = {};
  if (body.em) user_data.em = [sha256(normEmail(body.em))];
  if (body.ph) {
    const ph = normPhone(body.ph);
    if (ph) user_data.ph = [sha256(ph)];
  }
  if (body.fn) user_data.fn = [sha256(normName(body.fn))];
  if (body.fbp) user_data.fbp = body.fbp;
  if (body.fbc) user_data.fbc = body.fbc;
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = ua;

  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        event_source_url: body.event_source_url,
        action_source: "website",
        user_data,
        custom_data: body.custom_data || {},
      },
    ],
  };
  // codigo de teste (Events Manager > Test Events) — opcional
  if (body.test_event_code) payload.test_event_code = body.test_event_code;

  const url =
    "https://graph.facebook.com/" +
    API_VERSION +
    "/" +
    PIXEL_ID +
    "/events?access_token=" +
    encodeURIComponent(TOKEN);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return {
      statusCode: res.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: String(e) }) };
  }
};
