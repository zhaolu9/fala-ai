/**
 * ============================================================
 *  埋点接收端点
 * ============================================================
 *
 *  前端把事件攒成一批发到这里。现在它只做校验和打印——
 *  接上数据库之前，数据不会被保存。
 *
 *  上线步骤：
 *   1. 前端 App.jsx 里把 SEND 改成 true
 *   2. 在下面 TODO 处接入数据库（推荐 Supabase 免费版）
 *
 *  原则：埋点永远不能影响用户使用。所以这里无论出什么错，
 *  都返回 200，绝不让前端感知到失败。
 * ============================================================
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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(200).json({ ok: true });

  try {
    const { events } = req.body || {};
    if (!Array.isArray(events)) return res.status(200).json({ ok: true });

    const clean = events.slice(0, MAX_EVENTS).map(sanitize);

    // TODO(接数据库时): 写入 events 表
    // const { createClient } = await import("@supabase/supabase-js");
    // const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    // await db.from("events").insert(clean);

    console.log("[track]", clean.length, "events", JSON.stringify(clean).slice(0, 500));
    return res.status(200).json({ ok: true, received: clean.length });
  } catch (e) {
    // 埋点失败绝不影响用户
    return res.status(200).json({ ok: true });
  }
}
