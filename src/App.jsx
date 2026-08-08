import React, { useState, useEffect } from "react";

/* ================================================================== */
/* 多语言配置：每种语言 = 一份独立档案                                  */
/* 要新增语言，只需照着 pt 的结构再写一份，加进 LANGS 即可              */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* 葡萄牙语（巴西）数据                                                 */
/* ------------------------------------------------------------------ */

const RULES = [
  { rule: "词尾的 o 读作「u」", tip: "巴西葡语里，单词结尾的 o 几乎都读成 u", example: "obrigado", zh: "谢谢", sound: "哦布里嘎杜" },
  { rule: "词尾的 e 读作轻轻的「i」", tip: "结尾的 e 读得又轻又短，像 i", example: "noite", zh: "晚上", sound: "诺伊奇" },
  { rule: "词首的 r / rr 读作「h」气音", tip: "像哈气一样，不是卷舌", example: "rua", zh: "街道", sound: "胡阿" },
  { rule: "d 遇到 i 读作「吉」", tip: "di 读成类似「吉」的音，这是巴西口音的标志", example: "dia", zh: "白天", sound: "吉亚" },
  { rule: "t 遇到 i 读作「奇」", tip: "ti、还有词尾的 te 都读「奇」", example: "gente", zh: "人们", sound: "任奇" },
  { rule: "ã / õ 是鼻音", tip: "发音时气从鼻子出来，像感冒时说话", example: "não", zh: "不", sound: "瑙（带鼻音）" },
  { rule: "nh 读作「尼」", tip: "类似拼音的 ni 滑向后面的元音", example: "amanhã", zh: "明天", sound: "阿马尼昂" },
  { rule: "lh 读作「利」", tip: "类似拼音的 li 滑向后面的元音", example: "trabalho", zh: "工作", sound: "特拉巴利优" },
  { rule: "两个元音之间的 s 读「z」", tip: "casa 不读「卡萨」，读「卡扎」", example: "casa", zh: "家 / 房子", sound: "卡扎" },
  { rule: "词尾的 m 变成鼻音", tip: "不闭嘴，只把前面的元音鼻音化", example: "sim", zh: "是", sound: "星（鼻音）" },
];

const PHRASES = [
  {
    group: "打车 · 坐车",
    items: [
      { pt: "Pode dirigir mais devagar, por favor?", zh: "请开慢一点，好吗？", sound: "波吉 吉里日儿 麦斯 吉瓦嘎，波儿法沃" },
      { pt: "Pode dirigir com mais cuidado? Eu fico enjoado.", zh: "请开稳一点，我晕车。（女生把最后一个词说成 enjoada）", sound: "波吉 吉里日儿 空 麦斯 奎达杜？欧 菲库 恩若阿杜" },
      { pt: "Pode abrir a janela? Prefiro vento natural.", zh: "可以开窗吗？我想吹自然风。", sound: "波吉 阿布里 阿 让内拉？普雷菲鲁 文图 纳图拉乌" },
      { pt: "Está um pouco frio. Pode desligar o ar e abrir a janela?", zh: "有点冷，可以关掉空调、开窗吹自然风吗？", sound: "伊斯塔 翁 波库 弗里乌。波吉 吉斯利嘎 乌 阿儿，伊 阿布里 阿 让内拉" },
      { pt: "Pode desligar o ar-condicionado?", zh: "可以关掉空调吗？", sound: "波吉 吉斯利嘎 乌 阿儿 空吉西奥纳杜" },
      { pt: "Pode parar aqui, por favor.", zh: "请在这里停车。", sound: "波吉 帕拉 阿基，波儿法沃" },
      { pt: "Quanto custa?", zh: "多少钱？", sound: "宽图 库斯塔" },
    ],
  },
  {
    group: "住处 · 收快递",
    items: [
      { pt: "Oi! Chegou uma encomenda pra mim. Onde eu pego?", zh: "你好！我有一个快递到了，请问在哪里取？", sound: "哦伊！谢购 乌马 恩科门达 普拉 明。翁吉 欧 佩谷" },
      { pt: "É do apartamento cento e seis.", zh: "是106房间的。", sound: "诶 杜 阿帕尔塔门图 森图 伊 塞斯" },
      { pt: "Chegou alguma encomenda pro cento e seis?", zh: "有106房间的快递到吗？", sound: "谢购 阿乌古马 恩科门达 普鲁 森图 伊 塞斯" },
    ],
  },
  {
    group: "日常 · 礼貌",
    items: [
      { pt: "Oi, tudo bem?", zh: "你好，还好吗？（最常用的打招呼）", sound: "哦伊，图杜 拜恩" },
      { pt: "Bom dia!", zh: "早上好！", sound: "邦 吉亚" },
      { pt: "Boa tarde!", zh: "下午好！", sound: "波阿 塔尔吉" },
      { pt: "Boa noite!", zh: "晚上好 / 晚安！", sound: "波阿 诺伊奇" },
      { pt: "Obrigado!", zh: "谢谢！（男生说这个，女生说 Obrigada）", sound: "哦布里嘎杜" },
      { pt: "Por favor.", zh: "请 / 麻烦了。", sound: "波儿 法沃" },
      { pt: "Com licença.", zh: "借过一下 / 打扰一下。", sound: "空 利森萨" },
      { pt: "Desculpa!", zh: "对不起！", sound: "吉斯库帕" },
      { pt: "Não entendo. Pode falar mais devagar?", zh: "我听不懂，可以说慢一点吗？", sound: "瑙 恩腾杜。波吉 法拉 麦斯 吉瓦嘎" },
      { pt: "Eu não falo português ainda.", zh: "我还不会说葡萄牙语。", sound: "欧 瑙 法卢 波尔图给斯 阿因达" },
    ],
  },
];

const NUMBERS = [
  { n: "0", pt: "zero", sound: "泽鲁" },
  { n: "1", pt: "um", sound: "翁" },
  { n: "2", pt: "dois", sound: "都伊斯" },
  { n: "3", pt: "três", sound: "特雷斯" },
  { n: "4", pt: "quatro", sound: "夸特鲁" },
  { n: "5", pt: "cinco", sound: "星库" },
  { n: "6", pt: "seis", sound: "塞斯" },
  { n: "7", pt: "sete", sound: "塞奇" },
  { n: "8", pt: "oito", sound: "奥伊图" },
  { n: "9", pt: "nove", sound: "诺维" },
  { n: "10", pt: "dez", sound: "戴斯" },
  { n: "11", pt: "onze", sound: "翁泽" },
  { n: "12", pt: "doze", sound: "都泽" },
  { n: "13", pt: "treze", sound: "特雷泽" },
  { n: "14", pt: "quatorze", sound: "夸托儿泽" },
  { n: "15", pt: "quinze", sound: "金泽" },
  { n: "16", pt: "dezesseis", sound: "吉泽塞斯" },
  { n: "17", pt: "dezessete", sound: "吉泽塞奇" },
  { n: "18", pt: "dezoito", sound: "吉佐伊图" },
  { n: "19", pt: "dezenove", sound: "吉泽诺维" },
  { n: "20", pt: "vinte", sound: "温奇" },
  { n: "30", pt: "trinta", sound: "特林塔" },
  { n: "40", pt: "quarenta", sound: "夸伦塔" },
  { n: "50", pt: "cinquenta", sound: "星昆塔" },
  { n: "60", pt: "sessenta", sound: "塞森塔" },
  { n: "70", pt: "setenta", sound: "塞滕塔" },
  { n: "80", pt: "oitenta", sound: "奥伊滕塔" },
  { n: "90", pt: "noventa", sound: "诺文塔" },
  { n: "100", pt: "cem", sound: "桑（鼻音）" },
  { n: "1000", pt: "mil", sound: "米欧" },
];

/* ================================================================== */
/* ★ 用户须知配置（要改文案，只改这里）★                              */
/*                                                                    */
/* 所有需要用户确认的内容都集中在这个对象里，不用翻代码。              */
/*                                                                    */
/* 【重要】version 是"重新征求同意"的开关：                            */
/*   条款只是措辞微调 → 不用动 version，老用户不会被再次打扰           */
/*   条款有实质变化（新增数据用途、改变存储方式等）                    */
/*     → 把 version 改成 "v2"，所有人下次打开会重新看到弹窗并重新勾选  */
/*   这是合规上的关键：实质变更必须重新取得同意。                      */
/* ================================================================== */

const CONSENT = {
  version: "v1",

  title: "开始之前，说清楚三件事",

  // 想加减条目，直接改这个数组即可
  items: [
    { bold: "你的句子存在你自己的设备上。", text: "别人打开这个网页，看不到你加的任何内容。" },
    { bold: "翻译需要联网。", text: "你输入的中文会发送给 AI 翻译服务来生成译文和发音，不会用于其他用途。" },
    { bold: "我们会看匿名的使用情况", text: "（比如哪些功能被用到、翻译成功率），只用来改进这个产品，不会拿去做广告，也不会卖给任何人。" },
  ],

  checkboxLabel: "我已阅读并同意上述说明",
  buttonText: "开始使用",

  // 输入框旁边常驻的那行小字
  inputHint: "🔒 句子保存在你自己的设备上；输入的中文会发给 AI 用于翻译，仅用于产品优化。",

  // 想附一份完整条款时，填上网址就会自动出现链接；留空则不显示
  detailUrl: "",
  detailText: "查看完整说明",
};

/* ================================================================== */
/* 埋点：目前空转（只在控制台打印，不发送任何数据）                    */
/*                                                                    */
/* 部署且数据库就绪后，只需把 SEND 改成 true —— 所有埋点立即生效，     */
/* 不用再改动任何调用点。                                              */
/* ================================================================== */

const SEND = false;              // ← 上线时改成 true，就这一处
const TRACK_ENDPOINT = "/api/track";

let _uid = null;
function getUid() {
  if (_uid) return _uid;
  try {
    let v = localStorage.getItem("uid");
    if (!v) {
      v = "u_" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem("uid", v);
    }
    _uid = v;
  } catch (e) {
    _uid = "u_anon";
  }
  return _uid;
}

let _queue = [];
let _timer = null;

async function flush() {
  if (!SEND || !_queue.length) { _queue = []; return; }
  const batch = _queue;
  _queue = [];
  try {
    await fetch(TRACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
    });
  } catch (e) {
    /* 埋点失败绝不能影响用户使用，直接丢弃 */
  }
}

/**
 * 记录一个事件。
 * @param {string} name  事件名，见 ANALYTICS.md
 * @param {object} props 附加字段（不要放用户输入的句子原文）
 */
function track(name, props = {}) {
  const ev = { name, ts: Date.now(), uid: getUid(), ...props };
  if (!SEND) {
    // 空转模式：只打印，方便现在就能验证埋点位置对不对
    if (typeof console !== "undefined") console.log("[track]", ev);
    return;
  }
  _queue.push(ev);
  if (_queue.length >= 10) { flush(); return; }
  if (_timer) clearTimeout(_timer);
  _timer = setTimeout(flush, 5000);
}

/* ------------------------------------------------------------------ */
/* 存储层：两条通道都写，读时任一命中即可 —— 防止数据丢失              */
/* ------------------------------------------------------------------ */

const store = {
  async get(key) {
    // 通道 A：宿主提供的存储
    try {
      if (typeof window !== "undefined" && window.storage && window.storage.get) {
        const r = await window.storage.get(key);
        if (r && r.value) return r.value;
      }
    } catch (e) { /* 换下一条 */ }
    // 通道 B：浏览器本地存储
    try {
      const v = localStorage.getItem(key);
      if (v) return v;
    } catch (e) { /* 都没有就返回空 */ }
    return null;
  },
  async set(key, value) {
    // 保险：不允许用"空"覆盖已存在的非空数据。
    // 加载失败或时序问题曾导致过数据被清空，这里从根上堵住。
    try {
      if (value === "[]" || value === "{}" || value === "null" || !value) {
        const old = await this.get(key);
        if (old && old !== "[]" && old !== "{}" && old !== "null") {
          const flag = "__allow_empty_" + key;
          if (!window[flag]) return false; // 非用户主动清空 → 拒绝写入
        }
      }
    } catch (e) { /* 检查失败就照常写 */ }
    let ok = false;
    try {
      if (typeof window !== "undefined" && window.storage && window.storage.set) {
        await window.storage.set(key, value);
        ok = true;
      }
    } catch (e) { /* 继续写另一条 */ }
    try {
      localStorage.setItem(key, value);
      ok = true;
    } catch (e) { /* ignore */ }
    return ok;
  },
};

/* ------------------------------------------------------------------ */
/* 新增语言：让 AI 生成这门语言的发音框架                              */
/* ------------------------------------------------------------------ */

async function buildLanguage(userInput) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: 1000,
      messages: [{
        role: "user",
        content:
          `用户想学：「${userInput}」。为这门语言生成入门发音框架，面向中文母语者。\n` +
          "所有解释用中文，谐音用中文近似标注（音在中文里没有对应时，用英语词标注，如 [tʃi] 写成「英语 chee」）。\n" +
          "只返回JSON，不要其他文字：\n" +
          '{"label":"中文语言名","flag":"国旗emoji","ttsLang":"BCP47代码如es-MX","enName":"English name for translation prompts",' +
          '"title":"一句该语言的招呼语作标题","subtitle":"开口说X","logic":"这门语言拼读逻辑的两句话总结",' +
          '"vogais":[{"sym":"字母","how":"怎么发","ex":"例词","zh":"词义","sound":"谐音"}],' +
          '"rules":[{"rule":"规则","tip":"说明","example":"例词","zh":"词义","sound":"谐音"}],' +
          '"silabas":[{"c":"辅音","note":"要点(可省略)","cells":[["音节","谐音","例词","词义"]]}]}\n' +
          "vogais 给全部元音；rules 给 5-8 条最关键的；silabas 给 6-10 个最常用辅音，每个配该语言的元音组合。",
      }],
    }),
  });
  const text = await readAIResponse(response);
  const o = extractJSON(text);
  if (!o || !o.label || !o.ttsLang) throw new Error("生成的内容不完整");
  return {
    code: "u" + Date.now().toString(36),
    label: o.label,
    flag: o.flag || "🌍",
    ttsLang: o.ttsLang,
    enName: o.enName || o.label,
    title: o.title || o.label,
    subtitle: o.subtitle || ("开口说" + o.label),
    tagline: "你自己添加的语言 · 先会读，再会说",
    logic: o.logic || "",
    vogais: o.vogais || [],
    nasais: [], ditongos: [], consoantes: [],
    silabas: o.silabas || [],
    rules: o.rules || [],
    phrases: [],
    numbers: [],
    words: {},
    custom: true,
  };
}

/* ------------------------------------------------------------------ */
/* 搬家：把句子翻译成另一种语言                                        */
/* ------------------------------------------------------------------ */

const SCENES = ["交通出行", "买东西", "吃饭点餐", "住处生活", "看病应急", "打招呼社交", "工作学习", "其他"];

/**
 * 从 AI 回复里挖出 JSON。
 * AI 有时会加 ```json 围栏、有时前面写一句废话、有时返回数组，
 * 之前只做「第一个{到最后一个}」的粗暴切片，稍有意外就整句失败。
 */
function extractJSON(text) {
  if (!text) return null;
  const FENCE = String.fromCharCode(96, 96, 96); // 三个反引号
  let t = String(text).split(FENCE).join("\n");
  t = t.replace(/^\s*json\s*$/gim, "").trim();

  // 先试整体解析
  try {
    const o = JSON.parse(t);
    return Array.isArray(o) ? o[0] : o;
  } catch (e) { /* 继续 */ }

  // 逐个花括号配对，找出第一段完整的 JSON 对象
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== "{") continue;
    let depth = 0, inStr = false, esc = false;
    for (let j = i; j < t.length; j++) {
      const c = t[j];
      if (inStr) {
        if (esc) esc = false;
        else if (c === "\\") esc = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') { inStr = true; continue; }
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          try {
            const o = JSON.parse(t.slice(i, j + 1));
            if (o && typeof o === "object") return o;
          } catch (e) { /* 换下一个起点 */ }
          break;
        }
      }
    }
  }
  return null;
}

/** 统一处理响应，把限流、服务错误、解析失败分清楚 */
async function readAIResponse(response) {
  let data = null;
  try { data = await response.json(); } catch (e) { data = null; }

  if (response.status === 429 || response.status === 402) {
    const err = new Error((data && data.error) || "已达使用上限");
    err.noRetry = true;
    throw err;
  }
  if (!response.ok) {
    throw new Error((data && (data.error?.message || data.error)) || ("服务暂时不可用 (" + response.status + ")"));
  }
  if (data && data.error) {
    throw new Error(data.error.message || data.error || "服务出错");
  }
  return (data?.content || []).map((c) => c.text || "").join("");
}

async function translateTo(zh, langCode, langName) {
  const target = langName
    ? "natural spoken " + langName
    : (langCode === "pt" ? "natural spoken Brazilian Portuguese" : "natural spoken Mexican Spanish");
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: "Translate to " + target + ": " + zh +
          '\nAlso classify into exactly one scene from: ' + SCENES.join("/") +
          '\nReturn only JSON: {"pt":"...","sound":"中文谐音","words":{"word":"中文意思"},"scene":"场景名"}',
      }],
    }),
  });
  const text = await readAIResponse(response);
  const obj = extractJSON(text);
  if (!obj) throw new Error("返回格式看不懂");
  const pt = obj.pt || obj.translation || obj.text;
  if (!pt) throw new Error("返回里没有译文");
  const scene = SCENES.indexOf(obj.scene) !== -1 ? obj.scene : "其他";
  return { pt, zh, sound: obj.sound || "", words: obj.words || {}, scene };
}

/* ------------------------------------------------------------------ */
/* 语音                                                                */
/* ------------------------------------------------------------------ */

const WORDS = {
  pode: "可以……吗（礼貌请求的开头，超高频）",
  dirigir: "开车",
  mais: "更 / 再",
  devagar: "慢",
  por: "por favor 连起来 = 请",
  favor: "por favor 连起来 = 请",
  com: "带着 / 和",
  cuidado: "小心",
  eu: "我",
  fico: "我变得（ficar 的变位）",
  enjoado: "晕车的、想吐的（女生说 enjoada）",
  abrir: "打开",
  a: "定冠词，相当于英语的 the（阴性）",
  o: "定冠词，相当于英语的 the（阳性）",
  janela: "窗户",
  prefiro: "我更喜欢（preferir 的变位）",
  vento: "风",
  natural: "自然的",
  chegou: "到了（chegar 的过去式，超高频）",
  uma: "一个（阴性）",
  encomenda: "包裹、快递",
  pra: "给（para 的口语缩写）",
  mim: "我（用在介词后面）",
  onde: "哪里",
  pego: "我取、我拿（pegar 的变位）",
  é: "是（ser 的变位）",
  do: "的（de + o 的缩合）",
  apartamento: "公寓、房间",
  cento: "一百（组合数字时用）",
  seis: "六",
  alguma: "某个、有没有（阴性）",
  pro: "给（para o 的口语缩写）",
  está: "是 / 处于（estar 的变位，指临时状态）",
  um: "一个（也是数字1）",
  pouco: "一点点",
  frio: "冷",
  e: "和、然后",
  ar: "空气；o ar 是空调的口语简称",
  desligar: "关掉（电器）",
  "ar-condicionado": "空调",
  parar: "停下",
  aqui: "这里",
  quanto: "多少",
  custa: "价钱是……（custar 的变位）",
  oi: "嗨（最随意的打招呼）",
  tudo: "一切、全部",
  bem: "好；tudo bem = 一切都好",
  bom: "好的（阳性）",
  dia: "白天、日子",
  boa: "好的（阴性）",
  tarde: "下午",
  noite: "晚上、夜",
  obrigado: "谢谢（男生用；女生说 obrigada）",
  licença: "许可；com licença = 借过/打扰了",
  desculpa: "对不起",
  não: "不、没有",
  entendo: "我懂（entender 的变位）",
  falar: "说、讲",
  falo: "我说（falar 的变位）",
  português: "葡萄牙语",
  ainda: "还、尚未",
};

function PtSentence({ text, words, baseWords = {}, ttsLang = "pt-BR" }) {
  const [act, setAct] = useState(null);
  const dict = words ? { ...baseWords, ...words } : baseWords;
  const parts = text.split(" ");
  return (
    <span onClick={() => setAct(null)}>
      {parts.map((raw, idx) => {
        const key = raw.toLowerCase().replace(/[?!.,¿¡]/g, "");
        const info = dict[key];
        const on = act === idx;
        return (
          <React.Fragment key={idx}>
            <span
              className={`w ${info ? "has" : ""} ${on ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setAct(on ? null : idx);
                if (!on) speak(key, 0.7, ttsLang);
              }}
            >
              {raw}
              {on && (
                <span className="bubble">
                  <span className="bw">{key}</span>　{info || "点一下再听一遍这个词"}
                </span>
              )}
            </span>
            {idx < parts.length - 1 ? " " : ""}
          </React.Fragment>
        );
      })}
    </span>
  );
}

function speak(text, rate = 0.9, ttsLang = "pt-BR", where = "") {
  try {
    track("play_audio", { rate: rate < 0.7 ? "slow" : "normal", lang: ttsLang, where });
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = ttsLang;
    u.rate = rate;
    const pref = ttsLang.slice(0, 2).toLowerCase();
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(pref));
    if (match) u.voice = match;
    window.speechSynthesis.speak(u);
  } catch (e) {
    /* 设备不支持时静默失败 */
  }
}

/* ------------------------------------------------------------------ */
/* 样式                                                                */
/* ------------------------------------------------------------------ */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&display=swap');

:root {
  --areia: #F6F2E8;
  --tinta: #17150F;
  --mata: #0E6B4A;
  --mata-escura: #0A4F37;
  --ipe: #F2B33D;
  --branco: #FFFFFF;
  --cinza: #6E6A5E;
}
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
body { background: var(--areia); }
.app {
  min-height: 100vh;
  background: var(--areia);
  color: var(--tinta);
  font-family: -apple-system, "PingFang SC", "Noto Sans SC", "Segoe UI", sans-serif;
  padding-bottom: 90px;
  max-width: 560px;
  margin: 0 auto;
}
.hero { background: var(--tinta); color: var(--areia); padding: 18px 20px 0; }
.lang-switch { display: flex; gap: 8px; margin-bottom: 16px; }
.lang-btn {
  border: 2px solid #4A473D; background: transparent; color: #C9C4B4;
  border-radius: 999px; padding: 6px 14px; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all .15s;
}
.lang-btn.on { background: var(--ipe); color: var(--tinta); border-color: var(--ipe); }
.lang-btn.add { font-size: 16px; padding: 6px 12px; }
.lang-switch { flex-wrap: wrap; }
.lang-add { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.lang-add input {
  flex: 1 1 180px; border: 2px solid #4A473D; background: #24211A; color: var(--areia);
  border-radius: 10px; padding: 9px 12px; font-size: 14px;
}
.lang-add input::placeholder { color: #8A8578; }
.lang-err { flex: 1 1 100%; font-size: 12px; color: var(--ipe); line-height: 1.5; }
.hero h1 {
  font-family: "Bricolage Grotesque", sans-serif;
  font-weight: 800; font-size: 40px; line-height: 1; letter-spacing: -0.5px;
}
.hero h1 span { color: var(--ipe); }
.hero p { margin-top: 8px; font-size: 14px; color: #C9C4B4; }
.wave { display: block; width: 100%; margin-top: 18px; }

.tabs {
  position: sticky; top: 0; z-index: 10;
  display: flex; gap: 6px; padding: 10px 12px;
  background: var(--areia); border-bottom: 2px solid var(--tinta);
  overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }
.tab {
  flex: 0 0 auto; border: 2px solid var(--tinta); background: var(--branco);
  border-radius: 999px; padding: 9px 16px; font-size: 14px; font-weight: 600;
  color: var(--tinta); cursor: pointer; transition: all .15s; white-space: nowrap;
}
.tab:focus-visible { outline: 3px solid var(--ipe); }
.tab.on { background: var(--mata); color: #fff; border-color: var(--mata); }

.page { padding: 16px 14px; }
.note {
  background: var(--branco); border: 2px dashed var(--mata);
  border-radius: 14px; padding: 12px 14px; font-size: 13.5px;
  color: var(--tinta); margin-bottom: 14px; line-height: 1.55;
}
.group-title {
  font-family: "Bricolage Grotesque", sans-serif;
  font-weight: 700; font-size: 18px; margin: 18px 2px 10px;
}
.card {
  background: var(--branco); border: 2px solid var(--tinta);
  border-radius: 16px; padding: 14px; margin-bottom: 12px;
  box-shadow: 4px 4px 0 rgba(23,21,15,.12);
}
.pt { font-family: "Bricolage Grotesque", sans-serif; font-weight: 700; font-size: 19px; line-height: 1.3; }
.zh { margin-top: 6px; font-size: 14.5px; color: var(--cinza); line-height: 1.5; }
.sound {
  display: inline-block; margin-top: 9px; background: var(--ipe);
  border-radius: 8px; padding: 4px 10px; font-size: 14px; font-weight: 600;
}
.row { display: flex; gap: 8px; margin-top: 12px; }
.btn {
  border: 2px solid var(--tinta); background: var(--mata); color: #fff;
  border-radius: 10px; padding: 8px 14px; font-size: 14px; font-weight: 700;
  cursor: pointer;
}
.btn:active { transform: translate(1px,1px); }
.btn.ghost { background: var(--branco); color: var(--tinta); }
.rule-name { font-weight: 700; font-size: 16px; }
.rule-tip { margin-top: 4px; font-size: 13.5px; color: var(--cinza); line-height: 1.5; }
.rule-ex {
  margin-top: 10px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  background: var(--areia); border-radius: 10px; padding: 8px 10px;
}
.rule-ex b { font-family: "Bricolage Grotesque", sans-serif; font-size: 17px; }
/* 词义和谐音是给例词注的，另起一行贴在例词底下，不跟按钮抢位置 */
.rule-sound { flex: 1 1 100%; font-size: 12.5px; color: var(--cinza); }
.play-mini {
  border: 2px solid var(--tinta); background: var(--ipe); border-radius: 8px;
  padding: 4px 10px; font-size: 13px; font-weight: 700; cursor: pointer;
  margin-left: auto; white-space: nowrap;
}
.num-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.num {
  background: var(--branco); border: 2px solid var(--tinta); border-radius: 14px;
  padding: 12px 6px; text-align: center; cursor: pointer;
  box-shadow: 3px 3px 0 rgba(23,21,15,.12);
}
.num:active { transform: translate(1px,1px); box-shadow: none; }
.num .digit { font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: 22px; }
.num .word { font-size: 14px; font-weight: 700; margin-top: 2px; }
.num .cn { font-size: 12px; color: var(--cinza); margin-top: 3px; }

.quiz-q { font-size: 15px; color: var(--cinza); }
.quiz-zh { font-family: "Bricolage Grotesque", sans-serif; font-size: 22px; font-weight: 700; margin-top: 6px; line-height: 1.35; }
.opt {
  display: block; width: 100%; text-align: left; margin-top: 10px;
  border: 2px solid var(--tinta); background: var(--branco); border-radius: 12px;
  padding: 12px 14px; font-size: 16px; font-weight: 600; cursor: pointer;
}
.opt.right { background: var(--mata); color: #fff; border-color: var(--mata); }
.opt.wrong { background: #E4572E; color: #fff; border-color: #E4572E; }
.score { font-size: 14px; font-weight: 700; color: var(--mata-escura); }
.toggle-line { display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-bottom: 10px; }
.sil-row {
  background: var(--branco); border: 2px solid var(--tinta); border-radius: 12px;
  padding: 10px 12px; margin-bottom: 8px; box-shadow: 3px 3px 0 rgba(23,21,15,.1);
}
.sil-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.sil-head b { font-family: "Bricolage Grotesque", sans-serif; font-size: 20px; }
.sil-note { font-size: 12px; color: var(--mata); font-weight: 600; }
.sil-cells { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.sil {
  border: 2px solid var(--tinta); background: var(--areia); border-radius: 9px;
  padding: 7px 2px; cursor: pointer; display: flex; flex-direction: column; gap: 2px;
}
.sil:active { transform: translate(1px,1px); }
.sil.hot { background: var(--ipe); }
.sil-t { font-family: "Bricolage Grotesque", sans-serif; font-weight: 700; font-size: 15px; }
.sil-s { font-size: 11px; color: var(--cinza); }
.sil.hot .sil-s { color: var(--tinta); font-weight: 600; }
.sil.sel { outline: 3px solid var(--mata); outline-offset: -3px; }
.sil-detail {
  margin-top: 10px; background: var(--areia); border-radius: 10px; padding: 10px 12px;
  border-left: 4px solid var(--mata);
}
.sil-word { font-size: 13.5px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.sil-word b { font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; }
.sil-mean { font-size: 12.5px; color: var(--cinza); }
.sil-sent { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #C9C4B4; }
.sil-sent-pt { font-family: "Bricolage Grotesque", sans-serif; font-weight: 700; font-size: 16px; line-height: 1.35; }
.sil-sent-zh { margin-top: 5px; font-size: 13px; color: var(--cinza); }
.tag.done { background: var(--mata); color: #fff; max-width: none; }
.tag {
  font-size: 11px; color: var(--cinza); background: var(--areia);
  border-radius: 999px; padding: 3px 9px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; max-width: 96px; flex: 0 1 auto;
}
.practice-box {
  background: var(--tinta); border-radius: 16px; padding: 12px; margin-bottom: 16px;
}
.practice-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.practice-title { color: var(--ipe); font-weight: 800; font-size: 15px; font-family: "Bricolage Grotesque", sans-serif; }
.practice-head .btn.ghost { background: transparent; color: #C9C4B4; border-color: #4A473D; }
.practice-empty { color: #C9C4B4; font-size: 12.5px; line-height: 1.55; padding: 2px 2px 4px; }
.practice-card { margin-bottom: 8px; box-shadow: 3px 3px 0 rgba(242,179,61,.35); }
.practice-card:last-child { margin-bottom: 0; }
.ord-num.hot { background: var(--ipe); color: var(--tinta); }
.btn.grad { background: var(--ipe); color: var(--tinta); }

/* 场景切换：与顶部 tab 同一套视觉语言，有块感 */
.scene-bar {
  display: flex; gap: 7px; overflow-x: auto; padding: 2px 0 10px;
  scrollbar-width: none; -webkit-overflow-scrolling: touch;
}
.scene-bar::-webkit-scrollbar { display: none; }
.scene {
  flex: 0 0 auto; display: inline-flex; align-items: center; gap: 6px;
  border: 2px solid var(--tinta); background: var(--branco); color: var(--tinta);
  border-radius: 12px; padding: 8px 12px; font-size: 13.5px; font-weight: 700;
  cursor: pointer; white-space: nowrap; box-shadow: 3px 3px 0 rgba(23,21,15,.14);
  transition: all .12s;
}
.scene:active { transform: translate(2px,2px); box-shadow: none; }
.scene.on { background: var(--mata); color: #fff; border-color: var(--mata); box-shadow: 3px 3px 0 rgba(14,107,74,.3); }
.scene-n {
  font-size: 11px; font-weight: 800; background: var(--areia); color: var(--tinta);
  border-radius: 999px; padding: 1px 7px; min-width: 20px; text-align: center;
}
.scene.on .scene-n { background: rgba(255,255,255,.9); }
.consent-mask {
  position: fixed; inset: 0; background: rgba(23,21,15,.88); z-index: 999;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.consent-box {
  background: var(--areia); border: 3px solid var(--tinta); border-radius: 18px;
  padding: 20px; max-width: 420px; width: 100%; max-height: 86vh; overflow-y: auto;
  box-shadow: 6px 6px 0 var(--ipe);
}
.consent-title {
  font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 12px;
}
.consent-list { margin: 0 0 12px; padding-left: 18px; }
.consent-list li { font-size: 13.5px; line-height: 1.65; margin-bottom: 9px; }
.consent-tip {
  background: var(--branco); border-left: 4px solid var(--ipe); border-radius: 8px;
  padding: 9px 11px; font-size: 12.5px; color: var(--cinza); line-height: 1.55; margin-bottom: 14px;
}
.consent-link {
  display: inline-block; margin-bottom: 12px; font-size: 13px;
  color: var(--mata); font-weight: 700;
}
.consent-check {
  display: flex; align-items: flex-start; gap: 9px; margin-bottom: 14px;
  font-size: 13.5px; line-height: 1.5; cursor: pointer;
}
.consent-check input {
  width: 20px; height: 20px; margin: 0; flex: 0 0 auto; accent-color: var(--mata); cursor: pointer;
}
.consent-ok { width: 100%; padding: 12px; font-size: 15px; }
.consent-ok:disabled { opacity: .4; cursor: not-allowed; }
.counter { font-size: 11.5px; color: var(--cinza); margin-top: 6px; text-align: right; }
.privacy-hint {
  margin-top: 10px; font-size: 11.5px; color: var(--cinza); line-height: 1.55;
}
/* 在练区横向滑动 */
.prac-strip {
  display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory;
  padding-bottom: 4px; scrollbar-width: none; -webkit-overflow-scrolling: touch;
}
.prac-strip::-webkit-scrollbar { display: none; }
.practice-card {
  flex: 0 0 86%; scroll-snap-align: start; margin-bottom: 0;
  box-shadow: 3px 3px 0 rgba(242,179,61,.35);
}
.prac-hint { text-align: center; font-size: 11px; color: #8A8578; margin-top: 8px; }

/* 拖动手柄 */
/* 只有手柄禁止浏览器手势，卡片其余部分保持正常滚动 —— 
   之前整张卡都设了 touch-action:none，结果把页面滚动也吃掉了 */
.drag {
  font-size: 12.5px; font-weight: 700; color: var(--tinta);
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 12px; margin: -3px 0; border-radius: 10px;
  background: var(--areia); border: 2px solid var(--tinta);
  cursor: grab; flex: 0 0 auto;
  touch-action: none;
  user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
}
.drag:active { cursor: grabbing; background: var(--ipe); }

.card.sorting { padding-top: 12px; }
/* 让位动画：被拖走后其他卡片平滑移动，看得出会落在哪 */
.card.editable { transition: transform .18s cubic-bezier(.2,.8,.3,1); }
.card.dragging {
  outline: 3px solid var(--mata);
  box-shadow: 0 12px 28px rgba(23,21,15,.3);
  position: relative; opacity: .97;
  transition: none;              /* 被拖的那张要跟手，不能有过渡 */
}
.card.sorting .pt { font-size: 16px; pointer-events: none; }
.card.sorting .row, .card.sorting .sound { display: none; }
.card.sorting .zh { pointer-events: none; }

.tool-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.tool-row .btn.ghost.on { background: var(--mata); color: #fff; border-color: var(--mata); }
.sort-tip { font-size: 11.5px; color: var(--cinza); }

.lang-pick { width: 100%; margin-bottom: 8px; justify-content: center; }
.tag.ok { background: #E4EFE9; color: var(--mata); max-width: none; }

.movehouse {
  margin-top: 22px; background: var(--branco); border: 2px dashed var(--tinta);
  border-radius: 16px; padding: 16px;
}
.mh-title { font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: 17px; }
.mh-text { font-size: 13px; color: var(--cinza); line-height: 1.6; margin: 8px 0 12px; }
.mh-note { font-size: 11.5px; color: var(--cinza); margin-top: 8px; }
.card.editable { position: relative; }
.corner {
  position: absolute; top: 10px; right: 10px; display: flex; gap: 6px; z-index: 2;
}
.icon-btn {
  width: 30px; height: 30px; border: 2px solid var(--tinta); background: var(--branco);
  border-radius: 8px; font-size: 13px; line-height: 1; cursor: pointer; padding: 0;
  display: inline-flex; align-items: center; justify-content: center;
}
.icon-btn.on { background: var(--ipe); }
.icon-btn.del { color: #B23A20; }
.ord-row {
  display: flex; align-items: center; gap: 5px; margin-bottom: 10px;
  flex-wrap: nowrap; padding-right: 78px; min-height: 30px;
}
.ord-num {
  flex: 0 0 auto;
}
.ord-num {
  font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: 15px;
  background: var(--tinta); color: var(--areia); border-radius: 999px;
  min-width: 26px; height: 26px; display: inline-flex; align-items: center;
  justify-content: center; margin-right: 4px;
}
.ord {
  border: 2px solid var(--tinta); background: var(--branco); border-radius: 8px;
  width: 30px; height: 30px; font-size: 14px; font-weight: 700; cursor: pointer;
  flex: 0 0 auto; padding: 0;
}
.ord:disabled { opacity: .3; cursor: default; }
.btn.mini { padding: 5px 10px; font-size: 12.5px; flex: 0 0 auto; }
.ta {
  width: 100%; border: 2px solid var(--tinta); border-radius: 10px;
  padding: 10px 12px; font-size: 15px; background: var(--areia);
  font-family: inherit; resize: vertical;
}
.srow {
  background: var(--branco); border: 2px solid var(--tinta); border-radius: 12px;
  padding: 10px 12px; margin-bottom: 8px;
  display: grid; grid-template-columns: auto 1fr auto; gap: 3px 10px; align-items: center;
  box-shadow: 3px 3px 0 rgba(23,21,15,.1);
}
.ssym { font-family: "Bricolage Grotesque", sans-serif; font-size: 17px; }
.show { font-size: 13px; color: var(--cinza); line-height: 1.4; }
/* 谐音标的是右边那个例词，所以跟着例词走，右对齐 */
.sright { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
.sex { font-size: 12px; color: var(--cinza); text-align: right; white-space: nowrap; }
.w { position: relative; display: inline; border-radius: 4px; cursor: pointer; }
.w.has { border-bottom: 2px dotted var(--mata); }
.w.active { background: var(--ipe); }
.bubble {
  position: absolute; bottom: calc(100% + 9px); left: 50%; transform: translateX(-50%);
  background: var(--tinta); color: var(--areia); border-radius: 10px;
  padding: 8px 12px; font-size: 13px; line-height: 1.5; font-weight: 400;
  width: max-content; max-width: 230px; z-index: 30; white-space: normal;
  font-family: -apple-system, "PingFang SC", "Noto Sans SC", sans-serif;
  box-shadow: 3px 3px 0 rgba(23,21,15,.25);
}
.bubble::after {
  content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
  border: 7px solid transparent; border-top-color: var(--tinta);
}
.bubble .bw { color: var(--ipe); font-weight: 800; }
.mic-wrap { text-align: center; margin: 18px 0 6px; }
.mic {
  width: 92px; height: 92px; border-radius: 50%;
  border: 3px solid var(--tinta); background: var(--ipe);
  font-size: 36px; cursor: pointer;
  box-shadow: 4px 4px 0 rgba(23,21,15,.2);
}
.mic:active { transform: translate(2px,2px); box-shadow: none; }
.mic.listening { background: #E4572E; animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
.mic-hint { margin-top: 10px; font-size: 13.5px; color: var(--cinza); }
.heard {
  margin-top: 14px; background: var(--areia); border-radius: 10px;
  padding: 10px 12px; font-size: 15px;
}
.heard b { font-family: "Bricolage Grotesque", sans-serif; }
.fb { border-color: var(--mata); }
.nota {
  display: inline-block; background: var(--mata); color: #fff;
  border-radius: 999px; padding: 4px 14px; font-weight: 800; font-size: 16px;
}
.elogio { font-family: "Bricolage Grotesque", sans-serif; font-weight: 700; font-size: 20px; margin-top: 10px; }
.manual-row { display: flex; gap: 8px; margin-top: 14px; }
.manual-row input {
  flex: 1; border: 2px solid var(--tinta); border-radius: 10px;
  padding: 9px 12px; font-size: 15px; background: var(--branco);
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
`;

/* ------------------------------------------------------------------ */
/* 组件                                                                */
/* ------------------------------------------------------------------ */

function PhraseCard({ item, showSound, L }) {
  return (
    <div className="card">
      <div className="pt"><PtSentence text={item.pt} words={item.words} baseWords={L.words} ttsLang={L.ttsLang} /></div>
      <div className="zh">{item.zh}</div>
      {showSound && <div className="sound">{item.sound}</div>}
      <div className="row">
        <button className="btn" onClick={() => speak(item.pt, 0.9, L.ttsLang)}>▶ 播放</button>
        <button className="btn ghost" onClick={() => speak(item.pt, 0.6, L.ttsLang)}>🐢 慢速</button>
      </div>
    </div>
  );
}

const VOGAIS = [
  { sym: "a", how: "张嘴的「啊」", ex: "casa", zh: "房子", sound: "卡扎" },
  { sym: "é 开音", how: "嘴张大的「哎」（带´号或按规则）", ex: "pé", zh: "脚", sound: "拍（张大嘴）" },
  { sym: "ê 闭音", how: "嘴收拢的「诶」", ex: "você", zh: "你", sound: "沃塞" },
  { sym: "i", how: "「衣」", ex: "aqui", zh: "这里", sound: "阿基" },
  { sym: "ó 开音", how: "嘴张大的「奥」", ex: "avó", zh: "奶奶／外婆", sound: "阿沃（张嘴）" },
  { sym: "ô 闭音", how: "嘴收圆的「欧」", ex: "avô", zh: "爷爷／外公", sound: "阿沃（收圆）" },
  { sym: "u", how: "「乌」", ex: "tudo", zh: "一切", sound: "图杜" },
];

const NASAIS = [
  { sym: "ã", how: "「昂」但嘴不闭，气从鼻子走", ex: "maçã", zh: "苹果", sound: "玛桑" },
  { sym: "ão", how: "「昂」滑向「乌」", ex: "não", zh: "不", sound: "瑙" },
  { sym: "ãe", how: "「昂」滑向「伊」", ex: "mãe", zh: "妈妈", sound: "迈（鼻音）" },
  { sym: "õe", how: "「翁」滑向「伊」", ex: "limões", zh: "柠檬（复数）", sound: "利莫因斯" },
  { sym: "em / en", how: "「英」", ex: "bem", zh: "好", sound: "拜英" },
  { sym: "im / in", how: "「因」", ex: "sim", zh: "是", sound: "星" },
  { sym: "om / on", how: "「翁」", ex: "bom", zh: "好的", sound: "邦" },
  { sym: "um / un", how: "「翁」嘴更圆", ex: "um", zh: "一", sound: "翁" },
];

const DITONGOS = [
  { sym: "ai", how: "「爱」", ex: "pai", zh: "爸爸", sound: "帕伊" },
  { sym: "ei", how: "「诶伊」", ex: "dinheiro", zh: "钱", sound: "吉涅鲁" },
  { sym: "oi", how: "「哦伊」", ex: "oi", zh: "嗨", sound: "哦伊" },
  { sym: "au", how: "「凹」", ex: "tchau", zh: "拜拜", sound: "恰乌" },
  { sym: "eu", how: "「诶乌」快速连读", ex: "eu", zh: "我", sound: "欧" },
  { sym: "ou", how: "读成闭口的「欧」", ex: "vou", zh: "我去", sound: "沃" },
];

const CONSOANTES = [
  { sym: "c + a/o/u", how: "读「k」", ex: "casa", zh: "房子", sound: "卡扎" },
  { sym: "c + e/i", how: "读「s」", ex: "cinco", zh: "五", sound: "星库" },
  { sym: "ç", how: "永远读「s」", ex: "licença", zh: "许可", sound: "利森萨" },
  { sym: "g + a/o/u", how: "读「g」", ex: "obrigado", zh: "谢谢", sound: "哦布里嘎杜" },
  { sym: "g + e/i", how: "读轻轻的「日」", ex: "gente", zh: "人们", sound: "任奇" },
  { sym: "j", how: "永远读轻轻的「日」", ex: "janela", zh: "窗户", sound: "让内拉" },
  { sym: "h", how: "不发音（直接跳过）", ex: "hora", zh: "小时", sound: "奥拉" },
  { sym: "ch", how: "读「什」", ex: "chá", zh: "茶", sound: "沙" },
  { sym: "qu", how: "读「k」", ex: "quanto", zh: "多少", sound: "宽图" },
  { sym: "x", how: "多变：词首常读「什」，有时读「ks」", ex: "táxi", zh: "出租车", sound: "塔克西" },
];

/* 音节组合表：辅音 × 元音 —— 这是"见词能读"真正的落地层 */
/* star: true 表示这个组合有巴西口音的特殊变形                          */
const SILABAS = [
  { c: "b", cells: [["ba","巴","bom","好"],["be","贝","bebida","饮料"],["bi","比","bicicleta","自行车"],["bo","波","bola","球"],["bu","布","buscar","去拿"]] },
  { c: "c", cells: [["ca","卡","casa","房子"],["ce","塞","cento","一百"],["ci","西","cinco","五"],["co","科","com","和"],["cu","库","cuidado","小心"]], note: "c 遇 e/i 变「s」音" },
  { c: "d", cells: [["da","达","dar","给"],["de","jee","pode","可以"],["di","jee","dia","白天"],["do","杜","obrigado","谢谢"],["du","杜","dúvida","疑问"]], star: true, note: "de / di = 英语 jee [dʒi]，不是「德」" },
  { c: "f", cells: [["fa","法","favor","请"],["fe","费","fechar","关上"],["fi","菲","fico","我变得"],["fo","佛","fora","外面"],["fu","福","futuro","未来"]] },
  { c: "g", cells: [["ga","嘎","obrigado","谢谢"],["ge","热","gelo","冰"],["gi","日","girar","转"],["go","果","gostar","喜欢"],["gu","古","água","水"]], note: "g 遇 e/i 变轻「日」音" },
  { c: "j", cells: [["ja","让","janela","窗户"],["je","热","jeito","方式"],["ji","日","jipe","吉普车"],["jo","若","jogo","游戏"],["ju","如","junto","一起"]], note: "j 永远是轻「日」音" },
  { c: "l", cells: [["la","拉","lado","旁边"],["le","累","leve","轻的"],["li","利","licença","许可"],["lo","罗","longe","远"],["lu","卢","lugar","地方"]] },
  { c: "m", cells: [["ma","马","manhã","早上"],["me","梅","medo","害怕"],["mi","米","mim","我"],["mo","莫","momento","一会儿"],["mu","木","muito","很"]] },
  { c: "n", cells: [["na","那","nada","没什么"],["ne","内","janela","窗户"],["ni","尼","dinheiro","钱"],["no","诺","noite","晚上"],["nu","努","número","号码"]] },
  { c: "p", cells: [["pa","帕","parar","停"],["pe","佩","pegar","拿"],["pi","皮","pior","更糟"],["po","波","pode","可以"],["pu","普","pouco","一点"]] },
  { c: "r", cells: [["ra","哈","rua","街道"],["re","黑","respirar","呼吸"],["ri","希","rio","河"],["ro","火","roupa","衣服"],["ru","胡","rua","街"]], star: true, note: "词首 r 是喉咙的「h」气音，不卷舌" },
  { c: "s", cells: [["sa","萨","sair","出去"],["se","塞","seis","六"],["si","西","sim","是"],["so","索","sol","太阳"],["su","苏","subir","上去"]] },
  { c: "t", cells: [["ta","塔","tarde","下午"],["te","chee","noite","晚上"],["ti","chee","time","队"],["to","图","tudo","一切"],["tu","图","tudo","一切"]], star: true, note: "te / ti = 英语 chee [tʃi]，不是硬邦邦的「奇」" },
  { c: "v", cells: [["va","瓦","vamos","我们走"],["ve","维","vento","风"],["vi","维","vinte","二十"],["vo","沃","você","你"],["vu","乌","vulto","身影"]] },
  { c: "z", cells: [["za","扎","cabeza","头"],["ze","泽","zero","零"],["zi","兹","vizinho","邻居"],["zo","佐","zona","区域"],["zu","祖","azul","蓝色"]] },
];

const ES_SILABAS = [
  { c: "b", cells: [["ba","巴","bajar","放下"],["be","贝","beber","喝"],["bi","比","bien","好"],["bo","波","boca","嘴"],["bu","布","buscar","找"]] },
  { c: "c", cells: [["ca","卡","casa","房子"],["ce","塞","cero","零"],["ci","西","cinco","五"],["co","科","con","和"],["cu","库","cuatro","四"]], note: "c 遇 e/i 变「s」音" },
  { c: "d", cells: [["da","达","dar","给"],["de","德","despacio","慢"],["di","迪","día","白天"],["do","多","dos","二"],["du","杜","duda","疑问"]], note: "西语的 d 不变形" },
  { c: "g", cells: [["ga","嘎","pagar","付钱"],["ge","赫","gente","人们"],["gi","希","gigante","巨大"],["go","果","amigo","朋友"],["gu","古","agua","水"]], note: "g 遇 e/i 变喉音「h」" },
  { c: "j", cells: [["ja","哈","trabajar","工作"],["je","赫","jefe","老板"],["ji","希","jinete","骑手"],["jo","霍","hijo","儿子"],["ju","胡","jugo","果汁"]], star: true, note: "j 永远是喉咙的「h」气音" },
  { c: "l", cells: [["la","拉","la","定冠词"],["le","累","leche","牛奶"],["li","利","libro","书"],["lo","罗","loco","疯的"],["lu","卢","lugar","地方"]] },
  { c: "m", cells: [["ma","马","mañana","明天"],["me","梅","mesa","桌子"],["mi","米","mi","我的"],["mo","莫","momento","一会儿"],["mu","木","mucho","很多"]] },
  { c: "n", cells: [["na","那","nada","没什么"],["ne","内","ventana","窗户"],["ni","尼","niño","小孩"],["no","诺","no","不"],["nu","努","número","号码"]] },
  { c: "ñ", cells: [["ña","尼亚","mañana","明天"],["ñe","尼耶","señor","先生"],["ñi","尼","niño","小孩"],["ño","尼奥","año","年"],["ñu","纽","ñu","角马"]], star: true, note: "ñ = 拼音的 ni 滑向后面" },
  { c: "p", cells: [["pa","帕","para","为了"],["pe","佩","pero","但是"],["pi","皮","piso","楼层"],["po","波","poco","一点"],["pu","普","puede","可以"]] },
  { c: "r", cells: [["ra","拉","gracias","谢谢"],["re","雷","prefiero","我更喜欢"],["ri","里","rico","好吃"],["ro","罗","otro","另一个"],["ru","鲁","ruta","路线"]], note: "西语 r 是弹舌" },
  { c: "s", cells: [["sa","萨","sábado","周六"],["se","塞","seis","六"],["si","西","sí","是"],["so","索","solo","只"],["su","苏","su","他的"]] },
  { c: "t", cells: [["ta","塔","ventana","窗户"],["te","特","tener","有"],["ti","蒂","tiempo","时间"],["to","托","todo","全部"],["tu","图","tu","你的"]] },
  { c: "v", cells: [["va","巴","ventana","窗户"],["ve","贝","ver","看"],["vi","比","vivir","住"],["vo","波","voy","我去"],["vu","布","vuelta","一圈"]], star: true, note: "v 读得跟 b 几乎一样" },
];

/* ================================================================== */
/* 西班牙语（墨西哥）数据 —— 预留空位                                   */
/* 等到了墨西哥、在真实场景里卡壳时，一句一句往这里填                    */
/* ================================================================== */

const ES_RULES = [
  { rule: "ñ 读作「尼」", tip: "类似拼音 ni 滑向后面的元音", example: "mañana", zh: "明天", sound: "马尼亚纳" },
  { rule: "词首/词中的 j 读作「h」气音", tip: "像哈气，不是英语的 j", example: "jugo", zh: "果汁", sound: "胡够" },
  { rule: "ll 读作「伊」", tip: "墨西哥口音里 ll 读成 y 的音", example: "calle", zh: "街道", sound: "卡耶" },
  { rule: "h 完全不发音", tip: "看到 h 直接跳过", example: "hola", zh: "你好", sound: "奥拉" },
  { rule: "元音永远只有5个纯音", tip: "a e i o u 发音固定、干脆，不含糊", example: "gracias", zh: "谢谢", sound: "格拉西亚斯" },
];

const ES_VOGAIS = [
  { sym: "a", how: "干脆的「啊」", ex: "casa", zh: "房子", sound: "卡萨" },
  { sym: "e", how: "「诶」", ex: "café", zh: "咖啡", sound: "卡费" },
  { sym: "i", how: "「衣」", ex: "sí", zh: "是", sound: "西" },
  { sym: "o", how: "「喔」", ex: "no", zh: "不", sound: "诺" },
  { sym: "u", how: "「乌」", ex: "tú", zh: "你", sound: "图" },
];

const ES_PHRASES = [
  {
    group: "打车 · 坐车",
    items: [
      { pt: "¿Puede manejar más despacio, por favor?", zh: "可以开慢一点吗？", sound: "普埃德 马内哈尔 马斯 德斯帕西奥，波尔法沃尔" },
      { pt: "¿Puede bajar la ventana? Prefiero aire natural.", zh: "可以开窗吗？我想吹自然风。", sound: "普埃德 巴哈尔 拉 本塔纳？普雷菲埃罗 埃雷 纳图拉尔" },
      { pt: "¿Puede apagar el aire acondicionado?", zh: "可以关空调吗？", sound: "普埃德 阿帕加尔 埃尔 埃雷 阿孔迪西奥纳多" },
    ],
  },
];

const ES_NUMBERS = [
  { n: "0", pt: "cero", sound: "赛罗" },
  { n: "1", pt: "uno", sound: "乌诺" },
  { n: "2", pt: "dos", sound: "多斯" },
  { n: "3", pt: "tres", sound: "特雷斯" },
  { n: "4", pt: "cuatro", sound: "夸特罗" },
  { n: "5", pt: "cinco", sound: "辛科" },
  { n: "6", pt: "seis", sound: "塞斯" },
  { n: "7", pt: "siete", sound: "西埃特" },
  { n: "8", pt: "ocho", sound: "奥乔" },
  { n: "9", pt: "nueve", sound: "努埃维" },
  { n: "10", pt: "diez", sound: "迪埃斯" },
];

const ES_WORDS = {
  puede: "可以……吗（礼貌请求开头）",
  manejar: "开车（墨西哥用词）",
  "más": "更",
  despacio: "慢慢地",
  por: "por favor = 请",
  favor: "por favor = 请",
  bajar: "放下、降下（开窗说 bajar la ventana）",
  la: "定冠词 the（阴性）",
  ventana: "窗户",
  prefiero: "我更喜欢",
  aire: "空气；el aire = 空调的简称",
  natural: "自然的",
  apagar: "关掉（电器）",
  el: "定冠词 the（阳性）",
};

/* ================================================================== */
/* 语言总表：切换语言 = 切换整份档案                                    */
/* ================================================================== */

const LANGS = {
  pt: {
    code: "pt",
    label: "葡萄牙语",
    flag: "🇧🇷",
    ttsLang: "pt-BR",
    title: "Fala aí!",
    subtitle: "开口说葡语",
    tagline: "专为在巴西生活设计 · 先会读，再会说 · 点任意句子听发音",
    rules: RULES,
    vogais: VOGAIS,
    nasais: NASAIS,
    ditongos: DITONGOS,
    consoantes: CONSOANTES,
    silabas: SILABAS,
    phrases: PHRASES,
    numbers: NUMBERS,
    words: WORDS,
    logic:
      "葡语是“见词能读”的语言——拼写和读音几乎一一对应。整套语音系统只有五层：① 5个元音字母→7个口元音；② 鼻音元音；③ 双元音；④ 特殊辅音；⑤ 巴西口音变形规则。",
  },
  es: {
    code: "es",
    label: "西班牙语",
    flag: "🇲🇽",
    ttsLang: "es-MX",
    title: "¡Órale!",
    subtitle: "开口说西语",
    tagline: "专为在墨西哥生活设计 · 先会读，再会说 · 内容持续补充中",
    rules: ES_RULES,
    vogais: ES_VOGAIS,
    nasais: [],
    ditongos: [],
    consoantes: [],
    silabas: ES_SILABAS,
    phrases: ES_PHRASES,
    numbers: ES_NUMBERS,
    words: ES_WORDS,
    logic:
      "西语比葡语更“见词能读”——5个元音永远只发5个固定纯音，没有开闭之分，没有鼻化。掌握几条辅音规则（ñ、j、ll、h不发音）基本就能读出任何词。",
  },
};

function SoundRow({ s, ttsLang, L }) {
  const [show, setShow] = useState(false);
  const sentence = L
    ? L.phrases.flatMap((g) => g.items).find(
        (it) => it.pt.toLowerCase().indexOf(s.ex.toLowerCase()) !== -1
      )
    : null;
  return (
    <div className="srow">
      <b className="ssym">{s.sym}</b>
      <span className="show">{s.how}</span>
      <div className="sright">
        <button className="play-mini" onClick={() => { speak(s.ex, 0.7, ttsLang); setShow(!show); }}>▶ {s.ex}</button>
        <span className="sex">{s.zh} · {s.sound}</span>
      </div>
      {show && sentence && (
        <div className="sil-detail" style={{ gridColumn: "1 / -1" }}>
          <div className="sil-sent-pt">
            <PtSentence text={sentence.pt} words={sentence.words} baseWords={L.words} ttsLang={ttsLang} />
          </div>
          <div className="sil-sent-zh">{sentence.zh}</div>
          <div className="row">
            <button className="btn" onClick={() => speak(sentence.pt, 0.85, ttsLang)}>▶ 整句</button>
            <button className="btn ghost" onClick={() => speak(sentence.pt, 0.55, ttsLang)}>🐢 慢速</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SyllableRow({ row, L, open, setOpen }) {
  const allSentences = L.phrases.flatMap((g) => g.items);
  return (
    <div className="sil-row">
      <div className="sil-head">
        <b>{row.c}</b>
        {row.note && <span className="sil-note">{row.note}</span>}
      </div>
      <div className="sil-cells">
        {row.cells.map((cell) => {
          const [syl, sound, word] = cell;
          const tricky = row.star && (syl.endsWith("e") || syl.endsWith("i"));
          const id = row.c + syl;
          return (
            <button
              key={syl}
              className={`sil ${tricky ? "hot" : ""} ${open === id ? "sel" : ""}`}
              onClick={() => {
                track("pronunciation_expand", { syllable: syl });
                setOpen(open === id ? null : id);
                speak(word, 0.65, L.ttsLang);
              }}
            >
              <span className="sil-t">{syl}</span>
              <span className="sil-s">{sound}</span>
            </button>
          );
        })}
      </div>

      {row.cells.map((cell) => {
        const [syl, sound, word, meaning] = cell;
        const id = row.c + syl;
        if (open !== id) return null;
        // 从真实句子里找一个包含这个词的，让音有上下文
        const inSentence = allSentences.find((it) =>
          it.pt.toLowerCase().indexOf(word.toLowerCase()) !== -1
        );
        return (
          <div className="sil-detail" key={"d" + syl}>
            <div className="sil-word">
              <b>{syl}</b> 读作 {sound} —— 出现在
              <button className="play-mini" onClick={() => speak(word, 0.6, L.ttsLang)}>▶ {word}</button>
              <span className="sil-mean">{meaning}</span>
            </div>
            {inSentence ? (
              <div className="sil-sent">
                <div className="sil-sent-pt">
                  <PtSentence text={inSentence.pt} words={inSentence.words} baseWords={L.words} ttsLang={L.ttsLang} />
                </div>
                <div className="sil-sent-zh">{inSentence.zh}</div>
                <div className="row">
                  <button className="btn" onClick={() => speak(inSentence.pt, 0.85, L.ttsLang)}>▶ 整句</button>
                  <button className="btn ghost" onClick={() => speak(inSentence.pt, 0.55, L.ttsLang)}>🐢 慢速</button>
                </div>
              </div>
            ) : (
              <div className="sil-sent-zh">先记住这个词，之后遇到句子时会自然认出这个音。</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PronunciationPage({ L }) {
  const [openSyl, setOpenSyl] = useState(null);
  const layers = [
    { title: "元音", note: "每个元音字母对应固定的音，记住嘴型即可。", data: L.vogais },
    { title: "鼻音", note: "元音鼻化——气从鼻子出来，嘴不闭上。", data: L.nasais },
    { title: "双元音", note: "两个元音滑着连读。", data: L.ditongos },
    { title: "特殊辅音（没列出的 ≈ 拼音读法）", note: "", data: L.consoantes },
  ].filter((layer) => layer.data && layer.data.length);

  return (
    <div className="page">
      <div className="note">
        <b>底层逻辑：</b>{L.logic}
      </div>

      {layers.map((layer, i) => (
        <div key={layer.title}>
          <div className="group-title">第{i + 1}层 · {layer.title}</div>
          {layer.note && <div className="note">{layer.note}</div>}
          {layer.data.map((s) => <SoundRow key={s.sym} s={s} ttsLang={L.ttsLang} L={L} />)}
        </div>
      ))}

      {L.silabas && L.silabas.length > 0 && (
        <>
          <div className="group-title">第{layers.length + 1}层 · 拼读表：辅音 × 元音</div>
          <div className="note">
            这一层把前面所有规则落到地上。任何词都是这些音节拼起来的——<b>pode</b> = po + de，<b>noite</b> = noi + te。
            <span style={{ color: "var(--mata)", fontWeight: 700 }}>黄色格子</span>是巴西口音会变形、最容易读错的地方。
            <b>点任意格子</b>：会念出这个音所在的真实单词，并展开它在句子里的样子——单独练音是记不住的，放回词和句子里才记得住。
          </div>
          {L.silabas.map((row) => (
            <SyllableRow key={row.c} row={row} L={L} open={openSyl} setOpen={setOpenSyl} />
          ))}
        </>
      )}

      {L.rules && L.rules.length > 0 && (
        <>
          <div className="group-title">第{layers.length + 2}层 · 口音变形规则</div>
          <div className="note">前面几层是"字典读法"，这一层是当地人嘴里的真实读法——也是你听起来"像本地人"的关键。</div>
          {L.rules.map((r, i) => (
            <div className="card" key={i}>
              <div className="rule-name">{i + 1}. {r.rule}</div>
              <div className="rule-tip">{r.tip}</div>
              <div className="rule-ex">
                <b>{r.example}</b>
                <button className="play-mini" onClick={() => speak(r.example, 0.75, L.ttsLang)}>▶ 听</button>
                <span className="rule-sound">{r.zh} · {r.sound}</span>
              </div>
              {(() => {
                const st = L.phrases.flatMap((g) => g.items).find(
                  (it) => it.pt.toLowerCase().indexOf(r.example.toLowerCase()) !== -1
                );
                if (!st) return null;
                return (
                  <div className="sil-detail">
                    <div className="sil-sent-pt">
                      <PtSentence text={st.pt} words={st.words} baseWords={L.words} ttsLang={L.ttsLang} />
                    </div>
                    <div className="sil-sent-zh">{st.zh}</div>
                    <div className="row">
                      <button className="btn" onClick={() => speak(st.pt, 0.85, L.ttsLang)}>▶ 整句</button>
                      <button className="btn ghost" onClick={() => speak(st.pt, 0.55, L.ttsLang)}>🐢 慢速</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function PhrasesPage({ showSound, setShowSound, L, custom, order, hidden, edits, practicing, setOrder, setHidden, setEdits, setPracticing, moveToLang, allLangs }) {
  const [moving, setMoving] = useState("");

  // 搬家：用应用内面板选目标语言。
  // 原来用浏览器的 prompt()，但它在手机和嵌套页面里常被静默屏蔽——
  // 用户点了没反应，看起来就像功能坏了。
  const [movePanel, setMovePanel] = useState(null); // null | "practice" | "all"
  const [moveResult, setMoveResult] = useState("");
  const moveOptions = Object.values(allLangs).filter((x) => x.code !== L.code);

  const doMove = async (target) => {
    const list = movePanel === "practice" ? practiceItems : visible;
    setMoving(movePanel);
    setMovePanel(null);
    setMoveResult("");
    const n = await moveToLang(
      list.map((it) => it.zh),
      target.code,
      movePanel === "practice"
    );
    setMoving("");
    setMoveResult(
      n > 0
        ? `✓ 成功带过去 ${n} 句。切到 ${target.flag} ${target.label} 就能看到。`
        : `没有搬成功。可能是翻译服务暂时不可用，或这些句子之前已经搬过了。`
    );
  };
  const [editing, setEditing] = useState(null);
  const [dPt, setDPt] = useState("");
  const [dZh, setDZh] = useState("");
  const [dSound, setDSound] = useState("");
  const [scene, setScene] = useState("全部");
  const [foldPractice, setFoldPractice] = useState(false);

  const MAX_PRACTICE = 8;

  const raw = [
    ...custom.map((it) => ({ ...it, tag: it.scene || "我加的" })),
    ...L.phrases.flatMap((g) => g.items.map((it) => ({ ...it, tag: g.group }))),
  ];
  const all = raw.map((it) => {
    const e = edits[it.pt];
    return e ? { ...it, id: it.pt, pt: e.pt, zh: e.zh, sound: e.sound, edited: true } : { ...it, id: it.pt };
  });
  const visible = all.filter((it) => hidden.indexOf(it.id) === -1);

  const practiceItems = practicing
    .map((id) => visible.find((it) => it.id === id))
    .filter(Boolean);

  const scenes = ["全部", ...Array.from(new Set(visible.map((it) => it.tag)))];

  // 自己加的句子若还没排过序，默认浮到最前面——
  // 否则一旦调过顺序，新加的句子会被甩到列表最底部，看起来像"没加进去"。
  const isMine = (it) => custom.some((c) => c.pt === it.id);
  const rank = (id) => {
    const i = order.indexOf(id);
    if (i !== -1) return i;
    return -1;
  };
  const rest = visible
    .filter((it) => practicing.indexOf(it.id) === -1)
    .filter((it) => scene === "全部" || it.tag === scene)
    .sort((a, b) => {
      const ra = rank(a.id), rb = rank(b.id);
      const oa = ra !== -1, ob = rb !== -1;
      // 排过序的按其顺序；没排过的里，自己加的优先
      if (oa && ob) return ra - rb;
      if (oa !== ob) {
        if (oa) return isMine(b) ? 1 : -1;
        return isMine(a) ? -1 : 1;
      }
      if (isMine(a) !== isMine(b)) return isMine(a) ? -1 : 1;
      return visible.indexOf(a) - visible.indexOf(b);
    });

  const [sortMode, setSortMode] = useState(false);
  const [dragId, setDragId] = useState(null);

  // 把当前可见顺序写回全局 order
  const commitOrder = (ids) => {
    const others = order.filter((x) => ids.indexOf(x) === -1);
    setOrder([...ids, ...others]);
  };

  /**
   * 拖动排序。
   * 关键点：
   *  1) setPointerCapture —— 手指移出手柄后依然收到事件，否则一动就断
   *  2) touchAction: none —— 否则浏览器把这个手势当成页面滚动，直接吃掉
   *  3) 用各卡片的中线判断插入位置，而不是 elementFromPoint（拖动时那下面
   *     常常是被拖起来的卡片自己，判断会失效）
   */
  const [dropAt, setDropAt] = useState(-1);
  const [dragDy, setDragDy] = useState(0);   // 被拖卡片跟随手指的位移
  const [dragFrom, setDragFrom] = useState(-1);
  const [cardH, setCardH] = useState(0);

  /**
   * 其他卡片给被拖的卡片让位。
   * 被拖走的位置空出来，途经的卡片整体上移或下移一个卡片高度，
   * 这样能看出松手后会落在哪 —— 就是 iOS 列表排序的那种手感。
   */
  const shiftFor = (idx) => {
    if (dragFrom === -1 || dropAt === -1 || !cardH) return 0;
    if (idx > dragFrom && idx <= dropAt) return -cardH;   // 往下拖：中间的上移
    if (idx < dragFrom && idx >= dropAt) return cardH;    // 往上拖：中间的下移
    return 0;
  };

  /**
   * 拖动排序。
   *
   * 关键教训：拖动过程中【绝不能】重排卡片。
   * 之前每移动一点就调用 setOrder，React 把卡片在 DOM 里搬走，
   * 手指的"抓握"（pointer capture）当场失效 —— 表现就是"按住有反馈但拖不动"。
   *
   * 现在改成：拖动时只画一条插入位置的指示线（不动任何卡片），
   * 松手那一刻才真正提交顺序。
   */
  const onDragStart = (e, id) => {
    if (!sortMode) return;
    e.preventDefault();
    e.stopPropagation();

    const handle = e.currentTarget;
    try { handle.setPointerCapture(e.pointerId); } catch (err) { /* 老浏览器忽略 */ }

    const ids = rest.map((x) => x.id);
    const from = ids.indexOf(id);
    const startY = e.clientY;
    const cardEl = handle.closest("[data-pid]");
    const h = cardEl ? cardEl.getBoundingClientRect().height + 12 : 0;
    setCardH(h);
    setDragId(id);
    setDragFrom(from);
    setDropAt(from);
    setDragDy(0);

    let landing = from;

    const onMove = (ev) => {
      const y = ev.clientY;
      setDragDy(y - startY);   // 让卡片跟着手指走，给出明确的"我正在被拖"的反馈
      const cards = Array.from(document.querySelectorAll("[data-pid]"));
      let target = cards.length - 1;
      for (let i = 0; i < cards.length; i++) {
        const r = cards[i].getBoundingClientRect();
        if (y < r.top + r.height / 2) { target = i; break; }
      }
      landing = target;
      setDropAt(target);

      // 靠近屏幕上下边缘时自动滚动，方便拖到很远的位置
      if (y < 90) window.scrollBy(0, -12);
      else if (y > window.innerHeight - 90) window.scrollBy(0, 12);
    };

    const onUp = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
      setDragId(null);
      setDropAt(-1);
      setDragDy(0);
      setDragFrom(-1);
      if (landing !== from && landing >= 0) {
        const next = [...ids];
        next.splice(landing, 0, next.splice(from, 1)[0]);
        commitOrder(next);
      }
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };



  const startPractice = (id) => {
    if (practicing.indexOf(id) !== -1) return;
    if (practicing.length >= MAX_PRACTICE) {
      setMoveResult(`「在练」最多放 ${MAX_PRACTICE} 句，已经满了。把练熟的点「🎓 出师了」腾个位置——同时练一两句才是最快的。`);
      return;
    }
    track("practice_add", { source: "phrases" });
    setPracticing([...practicing, id]);
  };
  const graduate = (id) => {
    track("practice_graduate");
    setPracticing(practicing.filter((x) => x !== id));
  };
  const movePractice = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= practicing.length) return;
    const next = [...practicing];
    [next[idx], next[j]] = [next[j], next[idx]];
    setPracticing(next);
  };

  const del = (id) => {
    track("phrase_delete");
    setHidden([...hidden, id]);
    setOrder(order.filter((x) => x !== id));
    setPracticing(practicing.filter((x) => x !== id));
  };

  const startEdit = (it) => {
    setEditing(it.id); setDPt(it.pt); setDZh(it.zh); setDSound(it.sound || "");
  };
  const saveEdit = (id) => {
    track("phrase_edit");
    setEdits({ ...edits, [id]: { pt: dPt.trim(), zh: dZh.trim(), sound: dSound.trim() } });
    setEditing(null);
  };
  const resetEdit = (id) => {
    const next = { ...edits }; delete next[id]; setEdits(next); setEditing(null);
  };

  const EditForm = ({ it }) => (
    <div>
      <div className="manual-row"><input value={dPt} onChange={(e) => setDPt(e.target.value)} placeholder={L.label + "句子"} /></div>
      <div className="manual-row"><input value={dZh} onChange={(e) => setDZh(e.target.value)} placeholder="中文意思" /></div>
      <div className="manual-row"><input value={dSound} onChange={(e) => setDSound(e.target.value)} placeholder="中文谐音（可留空）" /></div>
      <div className="row">
        <button className="btn" onClick={() => saveEdit(it.id)}>保存</button>
        <button className="btn ghost" onClick={() => speak(dPt, 0.8, L.ttsLang)}>▶ 试听</button>
        <button className="btn ghost" onClick={() => setEditing(null)}>取消</button>
        {edits[it.id] && <button className="btn ghost" onClick={() => resetEdit(it.id)}>还原</button>}
      </div>
    </div>
  );

  return (
    <div className="page">
      {movePanel && (
        <div className="consent-mask" onClick={() => setMovePanel(null)}>
          <div className="consent-box" onClick={(e) => e.stopPropagation()}>
            <div className="consent-title">带到哪门语言？</div>
            <div className="mh-text" style={{ margin: "0 0 14px" }}>
              把{movePanel === "practice" ? `在练的 ${practiceItems.length}` : `全部 ${visible.length}`} 句的
              <b>中文意思</b>拿过去重新翻译。句子多时会花一两分钟。
            </div>
            {moveOptions.length === 0 ? (
              <div className="mh-note">还没有别的语言。先用顶部的「＋」加一门。</div>
            ) : (
              moveOptions.map((o) => (
                <button key={o.code} className="btn lang-pick" onClick={() => doMove(o)}>
                  {o.flag} {o.label}
                </button>
              ))
            )}
            <button className="btn ghost lang-pick" onClick={() => setMovePanel(null)}>取消</button>
          </div>
        </div>
      )}

      {moveResult && (
        <div className="note" onClick={() => setMoveResult("")} style={{ cursor: "pointer" }}>
          {moveResult}
        </div>
      )}

      {/* ===== 在练区 ===== */}
      <div className="practice-box">
        <div className="practice-head">
          <span className="practice-title">🔥 在练（{practiceItems.length}/{MAX_PRACTICE}）</span>
          <div style={{ display: "flex", gap: 6 }}>
            {practiceItems.length > 0 && (
              <button
                className="btn mini grad"
                disabled={!!moving}
                onClick={() => { setMoveResult(""); setMovePanel("practice"); }}
              >
                {moving === "practice" ? "搬运中…" : "→ 带到别的语言"}
              </button>
            )}
            <button className="btn ghost mini" onClick={() => setFoldPractice(!foldPractice)}>
              {foldPractice ? "展开" : "收起"}
            </button>
          </div>
        </div>

        {!foldPractice && practiceItems.length === 0 && (
          <div className="practice-empty">还没有在练的句子——在下面挑一句点「🔥 开始练」，或在「添加句子」里加一句。一次一两句最有效。</div>
        )}

        {!foldPractice && practiceItems.length > 0 && (
        <div className="prac-strip">
        {practiceItems.map((it, idx) => (
          <div className="card practice-card" key={it.id}>
            <div className="ord-row">
              <span className="ord-num hot">{idx + 1}</span>
              <button className="ord" onClick={() => movePractice(idx, -1)} disabled={idx === 0} aria-label="上移">↑</button>
              <button className="ord" onClick={() => movePractice(idx, 1)} disabled={idx === practiceItems.length - 1} aria-label="下移">↓</button>
              <button className="btn mini grad" onClick={() => graduate(it.id)}>🎓 出师了</button>
            </div>
            <div className="pt"><PtSentence text={it.pt} words={it.words} baseWords={L.words} ttsLang={L.ttsLang} /></div>
            <div className="zh">{it.zh}</div>
            {it.sound && <div className="sound">{it.sound}</div>}
            <div className="row">
              <button className="btn" onClick={() => speak(it.pt, 0.9, L.ttsLang)}>▶ 播放</button>
              <button className="btn ghost" onClick={() => speak(it.pt, 0.6, L.ttsLang)}>🐢 慢速</button>
            </div>
          </div>
        ))}
        </div>
        )}
        {!foldPractice && practiceItems.length > 1 && (
          <div className="prac-hint">← 左右滑动看其他在练的句子 →</div>
        )}
      </div>

      {/* ===== 场景：属于导航，紧跟主 Tab ===== */}
      <div className="scene-bar">
        {scenes.map((sc) => {
          const n = sc === "全部"
            ? visible.filter((it) => practicing.indexOf(it.id) === -1).length
            : visible.filter((it) => it.tag === sc && practicing.indexOf(it.id) === -1).length;
          return (
            <button
              key={sc}
              className={`scene ${scene === sc ? "on" : ""}`}
              onClick={() => { track("scene_filter", { scene: sc }); setScene(sc); }}
            >
              <span className="scene-name">{sc}</span>
              <span className="scene-n">{n}</span>
            </button>
          );
        })}
      </div>

      {/* ===== 操作行：对当前这批句子做什么，层级低于导航 ===== */}
      <div className="tool-row">
        <button
          className={`btn ghost mini ${sortMode ? "on" : ""}`}
          onClick={() => setSortMode(!sortMode)}
        >
          {sortMode ? "✓ 完成" : "⇅ 调整顺序"}
        </button>
        {sortMode && <span className="sort-tip">按住卡片上下拖动</span>}
        <button
          className="btn ghost mini"
          style={{ marginLeft: "auto" }}
          onClick={() => setShowSound(!showSound)}
        >
          {showSound ? "隐藏谐音" : "显示谐音"}
        </button>
      </div>

      {hidden.length > 0 && !sortMode && (
        <div className="toggle-line">
          <button className="btn ghost mini" onClick={() => setHidden([])}>
            恢复删除的 {hidden.length} 句
          </button>
        </div>
      )}

      {scene !== "全部" && (
        <div className="note">
          正在只看「{scene}」。新加的句子如果归到了别的场景，点上面的「全部」就能看到。
        </div>
      )}

      {rest.map((it, idx) => (
        <div
          className={`card editable ${dragId === it.id ? "dragging" : ""} ${sortMode ? "sorting" : ""} ${dropAt === idx && dragId && dragId !== it.id ? "drop-here" : ""}`}
          key={it.id}
          data-pid={it.id}
          style={
            dragId === it.id
              ? { transform: `translateY(${dragDy}px)`, zIndex: 50 }
              : dragId
              ? { transform: `translateY(${shiftFor(idx)}px)` }
              : undefined
          }
        >
          <div className="corner" style={{ display: sortMode ? "none" : "flex" }}>
            <button
              className={`icon-btn ${editing === it.id ? "on" : ""}`}
              onClick={() => (editing === it.id ? setEditing(null) : startEdit(it))}
              aria-label="编辑" title="编辑这句"
            >✎</button>
            <button className="icon-btn del" onClick={() => del(it.id)} aria-label="删除" title="删除这句">✕</button>
          </div>
          <div className="ord-row">
            {sortMode ? (
              <span
                className="drag"
                onPointerDown={(e) => onDragStart(e, it.id)}
              >☰ 按住这里拖动</span>
            ) : (
              <button className="btn ghost mini" onClick={() => startPractice(it.id)}>🔥 开始练</button>
            )}
            <span className="tag">{it.edited ? "已改" : it.tag}</span>
          </div>

          {editing === it.id ? <EditForm it={it} /> : (
            <div>
              <div className="pt"><PtSentence text={it.pt} words={it.words} baseWords={L.words} ttsLang={L.ttsLang} /></div>
              <div className="zh">{it.zh}</div>
              {showSound && it.sound && <div className="sound">{it.sound}</div>}
              <div className="row">
                <button className="btn" onClick={() => speak(it.pt, 0.9, L.ttsLang)}>▶ 播放</button>
                <button className="btn ghost" onClick={() => speak(it.pt, 0.6, L.ttsLang)}>🐢 慢速</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {!rest.length && !practiceItems.length && (
        <div className="note">句子都被删光了——点上面「恢复删除的」找回来。</div>
      )}

      {/* ===== 一键搬家：把整份清单带到另一种语言 ===== */}
      <div className="movehouse">
        <div className="mh-title">📦 一键搬家</div>
        <div className="mh-text">
          换个国家、换门语言，句子不用重来。把这里全部 {visible.length} 句的<b>中文意思</b>拿到另一种语言重新翻译一遍——
          你攒的是「你要说什么」，不是某一门语言的说法。
        </div>
        <button
          className="btn"
          disabled={!!moving || !visible.length}
          onClick={() => { setMoveResult(""); setMovePanel("all"); }}
        >
          {moving === "all" ? "搬家中，请稍候…" : "📦 全部带到另一种语言"}
        </button>
        <div className="mh-note">没翻成功的句子，可以到「添加句子」里手动补。</div>
      </div>
    </div>
  );
}

function NumbersPage({ L }) {
  if (!L.numbers || !L.numbers.length) {
    return (
      <div className="page">
        <div className="note">这门语言还没有数字表。可以在「添加句子」里把要用的数字当句子加进来（比如「106房间」），一样能听、能练。</div>
      </div>
    );
  }
  return (
    <div className="page">
      <div className="note">
        点任意数字听发音。{L.code === "pt" ? "组合规则：中间加 e（读「伊」），如 21 = vinte e um。" : "组合规则：中间加 y（读「伊」），如 21 = veintiuno。"}
      </div>
      <div className="num-grid">
        {L.numbers.map((x) => (
          <button className="num" key={x.n} onClick={() => speak(x.pt, 0.8, L.ttsLang)}>
            <div className="digit">{x.n}</div>
            <div className="word">{x.pt}</div>
            <div className="cn">{x.sound}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function buildQuiz(L, extra = []) {
  const pool = [
    ...L.phrases.flatMap((g) => g.items.map((it) => ({ q: it.zh, a: it.pt }))),
    ...extra.map((it) => ({ q: it.zh, a: it.pt })),
    ...L.numbers.filter((x) => Number(x.n) <= 20).map((x) => ({ q: `数字 ${x.n}`, a: x.pt })),
  ];
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
  return shuffled.map((item) => {
    const wrong = pool.filter((p) => p.a !== item.a).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...wrong.map((w) => w.a), item.a].sort(() => Math.random() - 0.5);
    return { ...item, options };
  });
}

function QuizPage({ extra = [], L }) {
  const [quiz, setQuiz] = useState(() => buildQuiz(L, extra));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const done = idx >= quiz.length;

  const restart = () => { setQuiz(buildQuiz(L, extra)); setIdx(0); setPicked(null); setScore(0); };

  if (done) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center", padding: 28 }}>
          <div className="quiz-zh">得分 {score} / {quiz.length}</div>
          <div className="zh" style={{ marginTop: 8 }}>
            {score === quiz.length ? "全对，太棒了！" : score >= quiz.length - 2 ? "非常好！" : "继续练，多听多读就熟了。"}
          </div>
          <div className="row" style={{ justifyContent: "center" }}>
            <button className="btn" onClick={restart}>再来一轮</button>
          </div>
        </div>
      </div>
    );
  }

  const cur = quiz[idx];
  const answer = (opt) => {
    if (picked !== null) return;
    setPicked(opt);
    speak(cur.a, 0.85, L.ttsLang);
    if (opt === cur.a) setScore((s) => s + 1);
    setTimeout(() => { setPicked(null); setIdx((i) => i + 1); }, 1400);
  };

  return (
    <div className="page">
      <div className="card">
        <div className="quiz-q">第 {idx + 1} / {quiz.length} 题 · <span className="score">得分 {score}</span></div>
        <div className="quiz-zh">「{cur.q}」用{L.label}怎么说？</div>
        {cur.options.map((opt) => {
          let cls = "opt";
          if (picked !== null) {
            if (opt === cur.a) cls += " right";
            else if (opt === picked) cls += " wrong";
          }
          return (
            <button key={opt} className={cls} onClick={() => answer(opt)}>{opt}</button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 跟读老师：听你说，给你反馈                                          */
/* ------------------------------------------------------------------ */

function localScore(target, spoken) {
  const norm = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  const ta = norm(target);
  const tb = new Set(norm(spoken));
  if (!ta.length) return 0;
  return Math.round((ta.filter((w) => tb.has(w)).length / ta.length) * 100);
}

function TutorPage({ extra = [], L, order = [], hidden = [], edits = {}, practicing = [] }) {
  const raw = [...extra, ...L.phrases.flatMap((g) => g.items)];
  const all = raw.map((it) => {
    const e = edits[it.pt];
    return e ? { ...it, id: it.pt, pt: e.pt, zh: e.zh, sound: e.sound } : { ...it, id: it.pt };
  });
  const visible = all.filter((it) => hidden.indexOf(it.id) === -1);
  const rank = (id) => {
    const i = order.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const inPractice = practicing.map((id) => visible.find((it) => it.id === id)).filter(Boolean);
  const others = visible.filter((it) => practicing.indexOf(it.id) === -1).sort((a, b) => {
    const ra = rank(a.id), rb = rank(b.id);
    if (ra !== rb) return ra - rb;
    return visible.indexOf(a) - visible.indexOf(b);
  });
  // 在练的句子永远排最前面
  const items = inPractice.length ? inPractice.concat(others) : others;
  const [i, setI] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | listening | thinking
  const [heard, setHeard] = useState("");
  const [fb, setFb] = useState(null);
  const [err, setErr] = useState("");
  const [manual, setManual] = useState("");
  const [lastMethod, setLastMethod] = useState("mic");
  const target = items[i % items.length];
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const reset = () => { setHeard(""); setFb(null); setErr(""); setManual(""); setStatus("idle"); };
  const next = () => { setI((x) => (x + 1) % items.length); reset(); };

  const evaluate = async (spoken) => {
    setHeard(spoken);
    setStatus("thinking");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1000,
          messages: [{
            role: "user",
            content:
              `你是一位非常温柔耐心的${L.label}老师，教一位零基础的中文母语学生，风格像妈妈教宝宝说话：永远先真诚地夸，再给一个最重要的改进点，绝不打击。\n\n` +
              `学生要说的目标句：「${target.pt}」（意思：${target.zh}）\n` +
              `语音识别听到学生说的是：「${spoken}」\n\n` +
              "注意：语音识别对初学者会有误差。如果识别结果和目标句接近，说明学生的发音已经能被当地人听懂，要大力表扬；如果差得远，温柔地指出最可能出问题的那个音。\n\n" +
              '只返回JSON，不要任何其他文字、不要markdown代码块：\n' +
              '{"nota": 0到100的整数, "elogio_pt": "一句宝宝级简单的目标语言鼓励", "feedback_zh": "中文具体反馈：哪里说得好、哪个音要注意、怎么改，2-3句", "dica_pt": "值得单独跟读的一个重点词或短语"}',
          }],
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || "API错误");
      const text = (data.content || []).map((c) => c.text || "").join("");
      const s0 = text.indexOf("{");
      const s1 = text.lastIndexOf("}");
      if (s0 === -1 || s1 === -1) throw new Error("格式异常");
      const parsed = JSON.parse(text.slice(s0, s1 + 1));
      track("tutor_attempt", { success: true, score: parsed.nota, input_method: lastMethod });
      setFb(parsed);
      setStatus("idle");
      if (parsed.elogio_pt) speak(parsed.elogio_pt, 0.95, L.ttsLang);
    } catch (e) {
      const nota = localScore(target.pt, spoken);
      track("tutor_attempt", { success: false, score: nota, input_method: lastMethod });
      setFb({
        nota,
        elogio_pt: nota >= 60 ? "👏" : "💪",
        feedback_zh: nota >= 60
          ? "整体已经很接近了！再点🐢慢速听两遍，注意模仿句尾的语调。"
          : "别灰心，先用🐢慢速一个词一个词跟读，熟了再整句连起来。",
        dica_pt: target.pt.split(" ").slice(0, 2).join(" "),
      });
      setStatus("idle");
    }
  };

  const KEYBOARD_TIP = `小技巧：这个环境里麦克风被限制时，可以点下面的输入框，用手机键盘自带的 🎤 听写（把键盘听写语言切到${L.label}），说完提交，我照样给你反馈。`;

  const listen = () => {
    if (!SR) {
      setErr("这台设备的浏览器不支持网页语音识别。" + KEYBOARD_TIP);
      return;
    }
    try {
      const rec = new SR();
      rec.lang = L.ttsLang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      setErr(""); setFb(null); setHeard("");
      setStatus("listening");
      let gotResult = false;
      const guard = setTimeout(() => { try { rec.stop(); } catch (x) {} }, 10000);
      rec.onresult = (ev) => {
        gotResult = true;
        setLastMethod("mic");
        clearTimeout(guard);
        evaluate(ev.results[0][0].transcript);
      };
      rec.onerror = (ev) => {
        clearTimeout(guard);
        setStatus("idle");
        const code = ev && ev.error;
        if (code === "not-allowed" || code === "service-not-allowed") {
          setErr("麦克风权限被拒绝或被这个环境屏蔽了。" + KEYBOARD_TIP);
        } else if (code === "no-speech") {
          setErr("没有听到声音——点麦克风后请立刻大声说，中间别停顿太久。");
        } else if (code === "audio-capture") {
          setErr("找不到可用的麦克风。" + KEYBOARD_TIP);
        } else {
          setErr("识别出了点问题（" + (code || "未知") + "）。再试一次，或者：" + KEYBOARD_TIP);
        }
      };
      rec.onend = () => {
        clearTimeout(guard);
        setStatus((s) => {
          if (s === "listening" && !gotResult) {
            setErr((e2) => e2 || "结束了但没听到内容——点麦克风后马上开口试试。" + KEYBOARD_TIP);
            return "idle";
          }
          return s === "listening" ? "idle" : s;
        });
      };
      rec.start();
    } catch (e) {
      setStatus("idle");
      setErr("启动麦克风失败。" + KEYBOARD_TIP);
    }
  };

  return (
    <div className="page">
      <div className="note">
        像妈妈教宝宝一样：先听我读 → 你跟着说 → 我告诉你哪里棒、哪里再调整。能被语音识别听懂，就说明当地人也能听懂你。
      </div>

      <div className="card">
        <div className="pt"><PtSentence text={target.pt} words={target.words} baseWords={L.words} ttsLang={L.ttsLang} /></div>
        <div className="zh">{target.zh}</div>
        <div className="sound">{target.sound}</div>
        <div className="row">
          <button className="btn" onClick={() => speak(target.pt, 0.9, L.ttsLang)}>▶ 听示范</button>
          <button className="btn ghost" onClick={() => speak(target.pt, 0.6, L.ttsLang)}>🐢 慢速</button>
          <button className="btn ghost" onClick={next}>换一句</button>
        </div>

        <div className="mic-wrap">
          <button
            className={`mic ${status === "listening" ? "listening" : ""}`}
            onClick={listen}
            disabled={status === "thinking"}
            aria-label="按下开始说"
          >
            {status === "listening" ? "👂" : "🎤"}
          </button>
          <div className="mic-hint">
            {status === "listening" && "我在听，请说……"}
            {status === "thinking" && "让我想想你说得怎么样……"}
            {status === "idle" && "点麦克风，然后大声说出上面这句"}
          </div>
        </div>

        {heard && (
          <div className="heard">我听到你说：<b>{heard}</b></div>
        )}
        {err && <div className="heard">{err}</div>}

        <div className="manual-row">
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="也可以手动输入你说的内容"
          />
          <button className="btn ghost" onClick={() => { if (manual.trim()) { setLastMethod("typed"); evaluate(manual.trim()); } }}>提交</button>
        </div>
      </div>

      {fb && (
        <div className="card fb">
          <span className="nota">{fb.nota} 分</span>
          <div className="elogio">{fb.elogio_pt}</div>
          <div className="zh" style={{ marginTop: 8 }}>{fb.feedback_zh}</div>
          {fb.dica_pt && (
            <div className="rule-ex" style={{ marginTop: 12 }}>
              <b>{fb.dica_pt}</b>
              <span style={{ fontSize: 13, color: "var(--cinza)" }}>重点跟读这个</span>
              <button className="play-mini" onClick={() => speak(fb.dica_pt, 0.65, L.ttsLang)}>▶ 听</button>
            </div>
          )}
          <div className="row">
            <button className="btn" onClick={listen}>🎤 再说一次</button>
            <button className="btn ghost" onClick={next}>下一句</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 我的句子：任何人输入中文，自动生成葡语学习卡片                      */
/* ------------------------------------------------------------------ */

function CustomPage({ custom, setCustom, L, practicing, setPracticing }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [log, setLog] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [mPt, setMPt] = useState("");
  const [mZh, setMZh] = useState("");
  const [mSound, setMSound] = useState("");

  const persist = async (list) => {
    setCustom(list);
    try {
      await store.set("custom-phrases-" + L.code, JSON.stringify(list));
    } catch (e) { /* 存储失败不影响本次使用 */ }
  };

  const targetName = L.enName || (L.code === "pt" ? "natural spoken Brazilian Portuguese" : "natural spoken Mexican Spanish");

  // 一次只翻一句，请求体尽量小，最大化成功率
  /**
   * 翻译一句。
   * simple=true 时用极简提示词（不要谐音/单词/场景），
   * 因为要求越少，AI 越不容易返回格式不对的东西 —— 前几次失败后就降级到这个模式，
   * 保证至少能拿到译文，而不是整句作废。
   */
  const translateOne = async (line, simple = false) => {
    const prompt = simple
      ? "Translate this Chinese sentence to " + targetName + ": " + line +
        '\nReturn ONLY this JSON, nothing else: {"pt":"译文"}'
      : "Translate to " + targetName + ": " + line +
        "\nAlso classify into exactly one scene from: " + SCENES.join("/") +
        '\nReturn ONLY JSON, no explanation, no markdown: {"pt":"...","sound":"中文谐音","words":{"word":"中文意思"},"scene":"场景名"}';

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const text = await readAIResponse(response);
    const obj = extractJSON(text);
    if (!obj) throw new Error("返回格式看不懂");

    const pt = obj.pt || obj.translation || obj.text || obj.pt_br || obj.es || obj.target;
    if (!pt) throw new Error("返回里没有译文");

    const scene = SCENES.indexOf(obj.scene) !== -1 ? obj.scene : "其他";
    return {
      pt: String(pt).trim(),
      zh: line,
      sound: obj.sound || obj.pinyin || "",
      words: obj.words && typeof obj.words === "object" ? obj.words : {},
      scene,
    };
  };

  const MAX_LEN = 100;  // 单句上限：真实日常用语通常在 20-30 字，100 留足余量
  const MAX_LINES = 10; // 每批上限

  const add = async () => {
    let lines = input.split("\n").map((s) => s.trim()).filter(Boolean);
    const tooLong = lines.filter((l) => l.length > MAX_LEN);
    if (tooLong.length) {
      setErr(`有 ${tooLong.length} 句超过 ${MAX_LEN} 字了。日常用语通常很短，太长的句子拆成两句更好记、也更好说。`);
      return;
    }
    if (lines.length > MAX_LINES) {
      setErr(`一次最多加 ${MAX_LINES} 句。慢慢来——一次加太多，反而一句都记不住。`);
      lines = lines.slice(0, MAX_LINES);
      return;
    }
    if (!lines.length || busy) return;
    setBusy(true); setErr(""); setLog("");
    track("phrase_add_attempt", { count: lines.length });

    const got = [];
    const failed = [];
    const MAX_TRY = 5;
    for (const line of lines) {
      let ok = false;
      for (let t = 0; t < MAX_TRY && !ok; t++) {
        try {
          const simple = t >= 1; // 第一次失败后就降级：只要译文，成功率高得多
          setLog(
            `正在翻译「${line}」…（第 ${t + 1}/${MAX_TRY} 次${simple ? "，简化模式" : ""}）`
          );
          const t0 = Date.now();
          const one = await translateOne(line, simple);
          got.push(one);
          ok = true;
          track("phrase_add_result", {
            success: true, retries: t, duration_ms: Date.now() - t0, scene: one.scene,
          });
        } catch (e) {
          if (e.noRetry) {
            track("phrase_add_result", { success: false, retries: t, error_msg: "rate_limited" });
            failed.push(`${line} → ${e.message}`);
            break;
          }
          if (t === MAX_TRY - 1) {
            track("phrase_add_result", {
              success: false, retries: t, error_msg: String(e.message || e).slice(0, 120),
            });
            failed.push(`${line} → ${e.message}`);
          } else {
            // 指数退避：1s, 2s, 4s, 8s —— 服务端抽风时给它喘息时间
            const wait = 1000 * Math.pow(2, t);
            setLog(`「${line}」第 ${t + 1} 次没成功，${wait / 1000} 秒后重试…`);
            await new Promise((r) => setTimeout(r, wait));
          }
        }
      }
      // 成功后也稍等一下，避免连续请求触发限流
      if (ok && lines.length > 1) await new Promise((r) => setTimeout(r, 600));
    }

    if (got.length) await persist([...custom, ...got]);
    setInput(failed.length ? failed.map((f) => f.split(" → ")[0]).join("\n") : "");
    setLog("");
    if (failed.length) {
      const reason = failed[0].split(" → ")[1] || "";
      const limited = /上限|太多|额度|慢一点/.test(reason);
      setErr(
        limited
          ? reason + " 用下面的「✎ 手动添加」可以继续录入，不受限制。"
          : `有 ${failed.length} 句没成功（${reason}）。用下面的「✎ 手动添加」可以稳定录入。`
      );
      setManualMode(true);
    }
    setBusy(false);
  };

  const addManual = async () => {
    if (!mPt.trim() || !mZh.trim()) return;
    track("phrase_manual_add");
    await persist([...custom, { pt: mPt.trim(), zh: mZh.trim(), sound: mSound.trim(), words: {}, scene: "其他" }]);
    setMPt(""); setMZh(""); setMSound("");
  };

  const remove = (idx) => persist(custom.filter((_, i) => i !== idx));

  // 加入「在练」——那里是每天真正要练的一两句
  const MAX_PRACTICE = 3;
  const inPractice = (pt) => practicing.indexOf(pt) !== -1;
  const addToPractice = (pt) => {
    if (inPractice(pt)) return;
    if (practicing.length >= MAX_PRACTICE) {
      setErr(`「在练」最多放 ${MAX_PRACTICE} 句。先去「常用句」把练熟的那句点「🎓 出师了」，再加新的。`);
      return;
    }
    track("practice_add", { source: "custom" });
    setPracticing([...practicing, pt]);
  };

  return (
    <div className="page">
      <div className="note">
        输入<b>你自己</b>最常用的中文句子（一行一句），点按钮自动翻成{L.label}口语、配好谐音和单词气泡。加进来的句子会自动出现在「常用句」里，那边可以排顺序、改内容；也会进入「跟读」和「测验」，按语言分开、永久保存在你自己的设备上。
      </div>

      <div className="card">
        <textarea
          className="ta"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"例如：\n这个能便宜一点吗？\n我对花生过敏\n请帮我叫一辆车"}
        />
        <div className="counter">
          {input.split("\n").filter((x) => x.trim()).length} 句 · 单句上限 {MAX_LEN} 字
        </div>
        <div className="row">
          <button className="btn" onClick={add} disabled={busy}>
            {busy ? "翻译中……" : "＋ 生成" + L.label + "卡片"}
          </button>
          <button className="btn ghost" onClick={() => setManualMode(!manualMode)}>
            {manualMode ? "收起手动添加" : "✎ 手动添加"}
          </button>
        </div>
        {log && <div className="heard">{log}</div>}
        {err && <div className="heard">{err}</div>}
        <div className="privacy-hint">{CONSENT.inputHint}</div>
      </div>

      {manualMode && (
        <div className="card">
          <div className="rule-name">手动添加（永远可用）</div>
          <div className="rule-tip">把Claude翻好的句子填进来，一样能播放、跟读、测验。</div>
          <div className="manual-row"><input value={mPt} onChange={(e) => setMPt(e.target.value)} placeholder={L.label + "句子"} /></div>
          <div className="manual-row"><input value={mZh} onChange={(e) => setMZh(e.target.value)} placeholder="中文意思" /></div>
          <div className="manual-row"><input value={mSound} onChange={(e) => setMSound(e.target.value)} placeholder="中文谐音（可留空）" /></div>
          <div className="row"><button className="btn" onClick={addManual}>保存这一句</button></div>
        </div>
      )}

      {custom.length > 0 && (
        <div className="note">句子加好就自动进了「常用句」对应的场景里，不用再操作。如果想这几天重点练某一句，再点「🔥 加入在练」把它顶到最上面。</div>
      )}

      {custom.map((it, idx) => (
        <div className="card editable" key={idx}>
          <div className="corner">
            <button className="icon-btn del" onClick={() => remove(idx)} aria-label="删除" title="删除这句">✕</button>
          </div>
          <div className="ord-row">
            <span className="tag ok">✓ 已在常用句{it.scene ? "·" + it.scene : ""}</span>
            {inPractice(it.pt) ? (
              <span className="tag done">🔥 在练</span>
            ) : (
              <button className="btn ghost mini" onClick={() => addToPractice(it.pt)}>
                🔥 加入在练
              </button>
            )}
          </div>
          <div className="pt"><PtSentence text={it.pt} words={it.words} baseWords={L.words} ttsLang={L.ttsLang} /></div>
          <div className="zh">{it.zh}</div>
          {it.sound && <div className="sound">{it.sound}</div>}
          <div className="row">
            <button className="btn" onClick={() => speak(it.pt, 0.9, L.ttsLang)}>▶ 播放</button>
            <button className="btn ghost" onClick={() => speak(it.pt, 0.6, L.ttsLang)}>🐢 慢速</button>
          </div>
        </div>
      ))}
      {!custom.length && (
        <div className="note">还没有自己的句子——在上面输入几句试试。</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 主应用                                                              */
/* ------------------------------------------------------------------ */

export default function App() {
  const [langCode, setLangCode] = useState("pt");
  const [tab, setTab] = useState("rules");
  const [showSound, setShowSound] = useState(true);
  const [custom, setCustom] = useState([]);
  const [order, setOrderRaw] = useState([]);
  const [hidden, setHiddenRaw] = useState([]);
  const [edits, setEditsRaw] = useState({});
  const [practicing, setPracticingRaw] = useState([]);
  const [userLangs, setUserLangs] = useState([]);
  const [consent, setConsent] = useState(null); // null=未知, true=已同意
  const [agreed, setAgreed] = useState(false);
  const [addingLang, setAddingLang] = useState(false);
  const [langInput, setLangInput] = useState("");
  const [langBusy, setLangBusy] = useState(false);
  const [langErr, setLangErr] = useState("");

  const allLangs = { ...LANGS };
  userLangs.forEach((l) => { allLangs[l.code] = l; });
  const L = allLangs[langCode] || LANGS.pt;

  const save = async (key, val) => {
    try {
      await store.set(key + "-" + langCode, JSON.stringify(val));
    } catch (e) { /* 存储失败不影响本次使用 */ }
  };
  const setOrder = (v) => { setOrderRaw(v); save("order", v); };
  const setHidden = (v) => { setHiddenRaw(v); save("hidden", v); };
  const setEdits = (v) => { setEditsRaw(v); save("edits", v); };
  const setPracticing = (v) => { setPracticingRaw(v); save("practicing", v); };

  const addLanguage = async () => {
    const q = langInput.trim();
    if (!q || langBusy) return;
    setLangBusy(true); setLangErr("");
    try {
      const t0 = Date.now();
      const lang = await buildLanguage(q);
      track("lang_create", { input_raw: q, success: true, duration_ms: Date.now() - t0 });
      const next = [...userLangs, lang];
      setUserLangs(next);
      await store.set("user-langs", JSON.stringify(next));
      setLangInput(""); setAddingLang(false);
      setLangCode(lang.code);
    } catch (e) {
      track("lang_create", { input_raw: q, success: false, error_msg: String(e.message || e).slice(0, 120) });
      setLangErr("生成失败：" + (e.message || "未知错误") + "。稍等几秒再试一次。");
    }
    setLangBusy(false);
  };

  const [pendingDelete, setPendingDelete] = useState(null);

  const removeLanguage = async (code) => {
    const next = userLangs.filter((l) => l.code !== code);
    setPendingDelete(null);
    setUserLangs(next);
    await store.set("user-langs", JSON.stringify(next));
    if (langCode === code) setLangCode("pt");
  };

  /**
   * 搬家：把一批中文意思翻译成目标语言，写进那个语言的存档。
   * 目标语言当前没被加载，所以直接读写它的存储，切过去就能看到。
   */
  const moveToLang = async (zhList, targetCode, alsoPractice) => {
    const tl = allLangs[targetCode];
    const targetName = tl && tl.enName ? tl.enName : null;
    const key = "custom-phrases-" + targetCode;
    let existing = [];
    try {
      const raw = await store.get(key);
      if (raw) existing = JSON.parse(raw);
    } catch (e) { /* 没有存档是正常的 */ }

    const have = new Set(existing.map((x) => x.zh));
    const got = [];
    for (const zh of zhList) {
      if (have.has(zh)) continue; // 已经搬过就跳过，避免重复
      let ok = false;
      for (let t = 0; t < 3 && !ok; t++) {
        try {
          got.push(await translateTo(zh, targetCode, targetName));
          ok = true;
        } catch (e) {
          if (t < 2) await new Promise((r) => setTimeout(r, 1200 * (t + 1)));
        }
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    const merged = [...existing, ...got];
    await store.set(key, JSON.stringify(merged));
    track("move_to_lang", {
      target_lang: targetCode,
      mode: alsoPractice ? "practice" : "all",
      count: zhList.length,
      success_count: got.length,
    });

    if (alsoPractice && got.length) {
      let pr = [];
      try {
        const raw = await store.get("practicing-" + targetCode);
        if (raw) pr = JSON.parse(raw);
      } catch (e) { /* ignore */ }
      const add = got.map((x) => x.pt).filter((x) => pr.indexOf(x) === -1);
      await store.set("practicing-" + targetCode, JSON.stringify([...pr, ...add].slice(0, 3)));
    }
    return got.length;
  };

  // 切换语言时，加载该语言下用户自己保存的句子
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await store.get("user-langs");
        if (raw && alive) setUserLangs(JSON.parse(raw));
      } catch (e) { /* ignore */ }
      try {
        const c = await store.get("consent-" + CONSENT.version);
        if (alive) setConsent(c === "yes");
      } catch (e) { if (alive) setConsent(false); }
      const load = async (key, setter, empty) => {
        let val = empty;
        try {
          const raw = await store.get(key + "-" + langCode);
          if (raw) val = JSON.parse(raw);
        } catch (e) { /* 没有存档时是正常的 */ }
        if (alive) setter(val);
      };
      await load("custom-phrases", setCustom, []);
      await load("order", setOrderRaw, []);
      await load("hidden", setHiddenRaw, []);
      await load("edits", setEditsRaw, {});
      await load("practicing", setPracticingRaw, []);
    })();
    return () => { alive = false; };
  }, [langCode]);

  const tabs = [
    { id: "rules", label: "发音" },
    { id: "phrases", label: "常用句" },
    { id: "custom", label: "添加句子" },
    { id: "numbers", label: "数字" },
    { id: "tutor", label: "跟读" },
    { id: "quiz", label: "测验" },
  ];

  useEffect(() => {
    let first = false;
    try { first = !localStorage.getItem("uid"); } catch (e) { /* ignore */ }
    track("app_open", { is_first: first });
  }, []);

  const acceptConsent = async () => {
    if (!agreed) return;
    await store.set("consent-" + CONSENT.version, "yes");
    setConsent(true);
    track("consent_accept", { version: CONSENT.version });
  };

  return (
    <div className="app">
      <style>{css}</style>

      {consent === false && (
        <div className="consent-mask">
          <div className="consent-box">
            <div className="consent-title">{CONSENT.title}</div>
            <ul className="consent-list">
              {CONSENT.items.map((it, i) => (
                <li key={i}><b>{it.bold}</b>{it.text}</li>
              ))}
            </ul>
            {CONSENT.detailUrl && (
              <a className="consent-link" href={CONSENT.detailUrl} target="_blank" rel="noreferrer">
                {CONSENT.detailText} →
              </a>
            )}
            <label className="consent-check">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>{CONSENT.checkboxLabel}</span>
            </label>
            <button className="btn consent-ok" onClick={acceptConsent} disabled={!agreed}>
              {CONSENT.buttonText}
            </button>
          </div>
        </div>
      )}

      <header className="hero">
        <div className="lang-switch">
          {Object.values(allLangs).map((lang) => (
            <button
              key={lang.code}
              className={`lang-btn ${langCode === lang.code ? "on" : ""}`}
              onClick={() => { track("lang_switch", { from: langCode, to: lang.code }); setLangCode(lang.code); }}
              onDoubleClick={() => lang.custom && setPendingDelete(lang.code)}
              title={lang.custom ? "双击可删除这门语言" : ""}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
          <button className="lang-btn add" onClick={() => setAddingLang(!addingLang)}>
            {addingLang ? "×" : "＋"}
          </button>
        </div>

        {pendingDelete && (
          <div className="lang-add">
            <span className="lang-err" style={{ flex: "1 1 100%" }}>
              删除「{(allLangs[pendingDelete] || {}).label}」？里面加的句子会一起消失。
            </span>
            <button className="btn" onClick={() => removeLanguage(pendingDelete)}>确认删除</button>
            <button className="btn ghost" onClick={() => setPendingDelete(null)}>取消</button>
          </div>
        )}

        {addingLang && (
          <div className="lang-add">
            <input
              value={langInput}
              onChange={(e) => setLangInput(e.target.value)}
              placeholder="想学什么语言？如：意大利语、法语、粤语、日语"
            />
            <button className="btn" onClick={addLanguage} disabled={langBusy}>
              {langBusy ? "生成中…" : "生成"}
            </button>
            {langErr && <div className="lang-err">{langErr}</div>}
            {langBusy && <div className="lang-err">正在为这门语言生成发音框架，大约十几秒。</div>}
          </div>
        )}
        <h1>{L.title}<span> {L.subtitle}</span></h1>
        <p>{L.tagline}</p>
        <svg className="wave" viewBox="0 0 560 36" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,36 L0,18 Q35,0 70,18 T140,18 T210,18 T280,18 T350,18 T420,18 T490,18 T560,18 L560,36 Z" fill="#F6F2E8" />
          <path d="M0,22 Q35,4 70,22 T140,22 T210,22 T280,22 T350,22 T420,22 T490,22 T560,22" stroke="#F2B33D" strokeWidth="3" fill="none" />
        </svg>
      </header>

      <nav className="tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "rules" && <PronunciationPage L={L} />}
      {tab === "phrases" && <PhrasesPage showSound={showSound} setShowSound={setShowSound} L={L} custom={custom} order={order} hidden={hidden} edits={edits} practicing={practicing} setOrder={setOrder} setHidden={setHidden} setEdits={setEdits} setPracticing={setPracticing} moveToLang={moveToLang} allLangs={allLangs} />}
      {tab === "custom" && <CustomPage custom={custom} setCustom={setCustom} L={L} practicing={practicing} setPracticing={setPracticing} />}
      {tab === "numbers" && <NumbersPage L={L} />}
      {tab === "tutor" && <TutorPage extra={custom} L={L} order={order} hidden={hidden} edits={edits} practicing={practicing} />}
      {tab === "quiz" && <QuizPage extra={custom} L={L} />}
    </div>
  );
}
