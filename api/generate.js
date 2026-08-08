/**
 * ============================================================
 *  AI 中转网关（Serverless Function）
 * ============================================================
 *
 *  这是整个产品的"关卡"。前端永远不直接调用 AI —— 所有请求
 *  都必须先经过这里。这带来两个好处：
 *    1. API key 藏在服务器端，绝不暴露给浏览器。
 *    2. 这里是你永久的控制点：限流、额度、付费、封禁，
 *       将来都只改这一个文件，所有用户立即生效。
 *
 *  当前状态：风控已开启，付费未开启。
 *
 *  成本参考（Claude Sonnet）：
 *    翻译一句 ≈ $0.005（约 4 分钱）
 *    跟读反馈一次 ≈ $0.005
 *    新增一门语言 ≈ $0.02
 *  → 正常用户一个月约 $0.3-0.5；真正的风险来自脚本刷量。
 */

/* ------------------------------------------------------------------ */
/* 风控阈值                                                            */
/*                                                                    */
/* 真人加句子的节奏：想一句、打字、点生成、等结果——一分钟能做 3-5 句  */
/* 就算很快，而且是断续的。连续匀速的高频请求 = 脚本。                 */
/* ------------------------------------------------------------------ */

const LIMITS = {
  perMinute: 6,      // 每分钟：正常人达不到
  perHour: 40,       // 每小时：留足"学习兴致高涨"的余量
  perDay: 60,        // 每天：远超真实使用
};

// 全站每日总量保险，防止大量 IP 同时刷。0 = 不限
const DAILY_TOTAL_CAP = Number(process.env.DAILY_TOTAL_CAP || 2000);

/* ------------------------------------------------------------------ */
/* 计数器（内存版）                                                    */
/*                                                                    */
/* 注意：Serverless 实例会被回收，所以这是"第一道粗筛"，不是精确账本。 */
/* 接付费之后必须换成数据库或 Redis 才能精确记账。                     */
/* ------------------------------------------------------------------ */

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

  // 防止 Map 无限增长
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
function underDailyCap() {
  const today = new Date().toDateString();
  if (today !== dailyStamp) { dailyStamp = today; dailyCount = 0; }
  if (DAILY_TOTAL_CAP > 0 && dailyCount >= DAILY_TOTAL_CAP) return false;
  dailyCount += 1;
  return true;
}

/* ------------------------------------------------------------------ */
/* ★ 付费开关（预留，当前未启用）★                                     */
/*                                                                    */
/* 现在：永远放行，人人可用，只受上面的风控约束。                      */
/*                                                                    */
/* 将来要开付费时，在这里做三件事：                                    */
/*   1. 从请求里拿到用户标识（前端已有匿名 uid，或接入登录）           */
/*   2. 查数据库：这个用户是什么套餐、今天用了几次                     */
/*   3. 超出免费额度就 return { exceeded: true }                       */
/*                                                                    */
/* 前端收到 402 会显示"今日免费额度已用完"，弹窗位置已经留好。         */
/*                                                                    */
/* 建议档位（成本 ≈ $0.005/次）：                                      */
/*   免费    每天 20 次   —— 99% 的人永远碰不到                        */
/*   $0.99   每天 100 次  —— 给同时学两门语言的重度用户                */
/*   $9.9    不限量        —— 实为锚定价，真实客户是机构/课堂          */
/* ------------------------------------------------------------------ */

const FREE_DAILY = 20;

async function checkPaidPlan(/* uid, req */) {
  // TODO(开付费时): 接数据库 + 登录，按 uid 记账
  // const plan = await db.getPlan(uid);
  // const used = await db.getTodayCount(uid);
  // if (plan === "free" && used >= FREE_DAILY) return { plan, exceeded: true };
  return { plan: "free", exceeded: false };
}

/* ------------------------------------------------------------------ */

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "只接受 POST 请求" });

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  /* ---- 第一道：单用户频率 ---- */
  const r = hit(ip);
  if (!r.ok) {
    const msg = {
      minute: "慢一点～ 一分钟内请求太多了，休息一会儿再试。",
      hour: "这一小时的用量已达上限，过一会儿再来吧。",
      day: "今天的用量已达上限，明天会自动恢复。",
    }[r.scope];
    res.setHeader("Retry-After", String(r.retryAfter));
    return res.status(429).json({ error: msg, scope: r.scope });
  }

  /* ---- 第二道：全站每日总量 ---- */
  if (!underDailyCap()) {
    return res.status(429).json({
      error: "今天全站的用量已达上限，明天再来。（这是控制成本用的保险）",
    });
  }

  /* ---- 第三道：付费额度（当前恒放行）---- */
  const plan = await checkPaidPlan();
  if (plan.exceeded) {
    return res.status(402).json({
      error: `今天的 ${FREE_DAILY} 句免费额度用完了。明天会自动恢复，也可以订阅继续使用。`,
      reason: "quota",
    });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "服务器未配置 API key。" });

  try {
    const { messages, max_tokens } = req.body || {};
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: "缺少 messages。" });
    }
    // 防止构造超长请求烧 token。
    // 2000 足够容纳最长的合法请求（新增语言的提示词约 800 字符），
    // 但挡住了把大段文本塞进来烧 token 的行为。
    // 用户输入本身在前端限制为每句 100 字 —— 真实日常用语通常 20-30 字。
    if (JSON.stringify(messages).length > 2000) {
      return res.status(400).json({ error: "请求内容过长。" });
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: Math.min(max_tokens || 1000, 1500),
        messages,
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || "上游服务出错。" });
    }
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "网关处理失败：" + (e?.message || "未知错误") });
  }
}
