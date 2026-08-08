/**
 * ============================================================
 *  AI 中转网关 —— Cloudflare Pages Functions 版
 * ============================================================
 *
 *  这是整个产品的"关卡"。前端永远不直接调用 AI —— 所有请求
 *  都必须先经过这里。好处：
 *    1. API key 藏在服务器端，绝不暴露给浏览器
 *    2. 这里是永久的控制点：限流、额度、付费、换供应商，
 *       都只改这一个文件，前端一个字都不用动
 *
 *  当前供应商：DeepSeek（人民币结算，支付宝可充值）
 *
 *  === 想换回 Claude 时，只改下面 PROVIDER 里的三处 ===
 *  成本参考：
 *    DeepSeek  翻译一句 ≈ ¥0.003（约 3 厘）
 *    Claude    翻译一句 ≈ $0.005（约 4 分）
 * ============================================================
 */

/* ------------------------------------------------------------------
 * 供应商配置 —— 换 AI 服务商只需要改这一块
 * ------------------------------------------------------------------ */

const PROVIDER = {
  name: "deepseek",
  url: "https://api.deepseek.com/chat/completions",
  model: "deepseek-chat",
  envKey: "DEEPSEEK_API_KEY",
};

/* 如果哪天换回 Claude，把上面替换成：
 * const PROVIDER = {
 *   name: "anthropic",
 *   url: "https://api.anthropic.com/v1/messages",
 *   model: "claude-sonnet-4-6",
 *   envKey: "ANTHROPIC_API_KEY",
 * };
 * 下面的 callAI 会自动按 name 走对应的请求格式。
 */

/**
 * 调用 AI，并把不同厂商的返回格式统一成前端认识的样子。
 *
 * 前端一直按 Anthropic 的格式解析（data.content[].text），
 * 所以这里负责把 DeepSeek 的 OpenAI 式返回转换过去 ——
 * 这样换供应商时，前端 2000 行代码一个字都不用改。
 */
async function callAI(key, messages, maxTokens) {
  if (PROVIDER.name === "anthropic") {
    const r = await fetch(PROVIDER.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: PROVIDER.model, max_tokens: maxTokens, messages }),
    });
    const data = await r.json();
    return { ok: r.ok, status: r.status, data, error: data?.error?.message };
  }

  // OpenAI 兼容格式（DeepSeek、智谱、通义等都用这套）
  const r = await fetch(PROVIDER.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key,
    },
    body: JSON.stringify({
      model: PROVIDER.model,
      max_tokens: maxTokens,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.3,          // 翻译任务要稳定，不要发挥
      stream: false,
    }),
  });

  const data = await r.json();
  if (!r.ok) {
    return { ok: false, status: r.status, data, error: data?.error?.message || "上游服务出错" };
  }

  // 转换成前端认识的 Anthropic 格式
  const text = data?.choices?.[0]?.message?.content || "";
  return {
    ok: true,
    status: 200,
    data: { content: [{ type: "text", text }] },
  };
}

/* ---------------- 风控阈值 ----------------
 * 真人加句子的节奏：想一句、打字、点生成、等结果 —— 一分钟能做
 * 3-5 句就算很快，而且是断续的。连续匀速的高频请求 = 脚本。
 */
const LIMITS = {
  perMinute: 6,
  perHour: 40,
  perDay: 60,
};

const FREE_DAILY = 20;

/* ---------------- 计数器 ----------------
 * 注意：Workers 实例会被回收，这是"第一道粗筛"，不是精确账本。
 * 接付费之后必须换成 KV 或数据库才能精确记账。
 */
const buckets = new Map();

function hit(ip) {
  const now = Date.now();
  let b = buckets.get(ip);
  if (!b) {
    b = { minute: [], hour: [], day: [] };
    buckets.set(ip, b);
  }
  b.minute = b.minute.filter((t) => now - t < 60 * 1000);
  b.hour = b.hour.filter((t) => now - t < 60 * 60 * 1000);
  b.day = b.day.filter((t) => now - t < 24 * 60 * 60 * 1000);

  if (b.minute.length >= LIMITS.perMinute) return { ok: false, scope: "minute", retryAfter: 60 };
  if (b.hour.length >= LIMITS.perHour) return { ok: false, scope: "hour", retryAfter: 900 };
  if (b.day.length >= LIMITS.perDay) return { ok: false, scope: "day", retryAfter: 3600 };

  b.minute.push(now);
  b.hour.push(now);
  b.day.push(now);

  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (!v.day.length) buckets.delete(k);
      if (buckets.size < 3000) break;
    }
  }
  return { ok: true };
}

let dailyCount = 0;
let dailyStamp = new Date().toDateString();
function underDailyCap(cap) {
  const today = new Date().toDateString();
  if (today !== dailyStamp) { dailyStamp = today; dailyCount = 0; }
  if (cap > 0 && dailyCount >= cap) return false;
  dailyCount += 1;
  return true;
}

/* ---------------- ★ 付费开关（预留，当前未启用）★ ----------------
 *
 * 现在：永远放行，人人可用，只受上面的风控约束。
 *
 * 将来要开付费时，在这里做三件事：
 *   1. 从请求里拿到用户标识（前端已有匿名 uid，或接入登录）
 *   2. 查数据库/KV：这个用户什么套餐、今天用了几次
 *   3. 超出免费额度就 return { exceeded: true }
 *
 * 前端收到 402 会显示"今日免费额度已用完"，弹窗位置已经留好。
 *
 * 建议档位（成本 ≈ $0.005/次）：
 *   免费    每天 20 次   —— 99% 的人永远碰不到
 *   $0.99   每天 100 次  —— 给同时学两门语言的重度用户
 *   $9.9    不限量        —— 实为锚定价，真实客户是机构/课堂
 */
async function checkPaidPlan(/* uid, env */) {
  // TODO(开付费时): 接 KV 或数据库，按 uid 记账
  return { plan: "free", exceeded: false };
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...CORS, ...extra },
  });

/* Cloudflare 的写法：按 HTTP 方法导出函数 */

export const onRequestOptions = () => new Response(null, { status: 200, headers: CORS });

export const onRequestPost = async ({ request, env }) => {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";

  /* ---- 第一道：单用户频率 ---- */
  const r = hit(ip);
  if (!r.ok) {
    const msg = {
      minute: "慢一点～ 一分钟内请求太多了，休息一会儿再试。",
      hour: "这一小时的用量已达上限，过一会儿再来吧。",
      day: "今天的用量已达上限，明天会自动恢复。",
    }[r.scope];
    return json({ error: msg, scope: r.scope }, 429, { "Retry-After": String(r.retryAfter) });
  }

  /* ---- 第二道：全站每日总量 ---- */
  const cap = Number(env.DAILY_TOTAL_CAP || 2000);
  if (!underDailyCap(cap)) {
    return json({ error: "今天全站的用量已达上限，明天再来。（这是控制成本用的保险）" }, 429);
  }

  /* ---- 第三道：付费额度（当前恒放行）---- */
  const plan = await checkPaidPlan();
  if (plan.exceeded) {
    return json({
      error: `今天的 ${FREE_DAILY} 句免费额度用完了。明天会自动恢复，也可以订阅继续使用。`,
      reason: "quota",
    }, 402);
  }

  const key = env[PROVIDER.envKey];
  if (!key) {
    return json({ error: `服务器未配置 API key（需要环境变量 ${PROVIDER.envKey}）。` }, 500);
  }

  try {
    const body = await request.json();
    const { messages, max_tokens } = body || {};
    if (!Array.isArray(messages) || !messages.length) {
      return json({ error: "缺少 messages。" }, 400);
    }
    // 防止构造超长请求烧 token。
    // 2000 足够容纳最长的合法请求（新增语言的提示词约 800 字符）。
    // 用户输入本身在前端限制为每句 100 字。
    if (JSON.stringify(messages).length > 2000) {
      return json({ error: "请求内容过长。" }, 400);
    }

    const result = await callAI(key, messages, Math.min(max_tokens || 1000, 1500));
    if (!result.ok) {
      return json({ error: result.error || "上游服务出错。" }, result.status || 500);
    }
    return json(result.data);
  } catch (e) {
    return json({ error: "网关处理失败：" + (e?.message || "未知错误") }, 500);
  }
};
