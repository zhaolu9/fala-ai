/**
 * 埋点接收端点 —— Cloudflare Pages Functions 版
 *
 * 前端把事件攒成一批发到这里。现在只做校验和打印，
 * 接上数据库之前，数据不会被保存。
 *
 * 上线步骤：
 *  1. 前端 src/App.jsx 里把 SEND 改成 true
 *  2. 在下面 TODO 处接入 KV 或数据库
 *
 * 原则：埋点永远不能影响用户使用，所以无论出什么错都返回 200。
 */

const MAX_EVENTS = 50;

// 不允许上报的字段（防止误把用户输入的句子原文传上来）
const BLOCKED_KEYS = ["pt", "zh", "sentence", "text", "content", "spoken"];

function sanitize(ev) {
  const out = {};
  for (const k of Object.keys(ev || {})) {
    if (BLOCKED_KEYS.indexOf(k) !== -1) continue;
    const v = ev[k];
    if (typeof v === "string") out[k] = v.slice(0, 200);
    else if (typeof v === "number" || typeof v === "boolean") out[k] = v;
  }
  return out;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestOptions = () => new Response(null, { status: 200, headers: CORS });

export const onRequestPost = async ({ request, env }) => {
  try {
    const { events } = (await request.json()) || {};
    if (!Array.isArray(events)) {
      return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json", ...CORS } });
    }

    const clean = events.slice(0, MAX_EVENTS).map(sanitize);

    // TODO(接数据库时): 写入 KV 或 D1
    // await env.EVENTS.put("ev:" + Date.now(), JSON.stringify(clean));

    console.log("[track]", clean.length, "events", JSON.stringify(clean).slice(0, 500));
    return new Response(JSON.stringify({ ok: true, received: clean.length }), {
      headers: { "Content-Type": "application/json", ...CORS },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...CORS },
    });
  }
};
