# Fala aí! 部署三步走

从"一个文件"变成"一个谁都能打开的网址"。全程不用写代码，都是注册账号和点按钮，大约 20 分钟。

需要准备：一台电脑（手机很难完成上传步骤）、`fala-ai-project.zip` 解压后的文件夹。

---

## 第 1 步 · 把代码放上 GitHub（约 8 分钟）

GitHub 是存放代码的地方，Vercel 会从这里读取你的项目。

1. 打开 **github.com**，点右上角 `Sign up` 注册（免费）。用邮箱注册，验证一下就好。

2. 登录后，点右上角的 **`+`** → 选 **`New repository`**。

3. 填写：
   - **Repository name**：`fala-ai`
   - **Public / Private**：选 **Public**（免费版 Vercel 需要）
   - 其他都不用动
   - 点绿色的 **`Create repository`**

4. 进入新建的空仓库页面，找到中间那句 **`uploading an existing file`**（是个蓝色链接），点它。

5. 把解压后 `fala-ai` 文件夹里的**所有内容**拖进上传框。
   > ⚠️ 注意：拖的是文件夹**里面**的东西（`src`、`api`、`package.json` 等），不是 `fala-ai` 文件夹本身。

6. 等文件都显示出来后，点页面底部绿色的 **`Commit changes`**。

✅ **完成标志**：仓库页面能看到 `src`、`api`、`package.json`、`index.html` 这些文件。

---

## 第 2 步 · 申请 AI 的钥匙（约 5 分钟）

这把钥匙让你的网站能调用 AI 做翻译。**它会藏在服务器上，用户看不到。**

1. 打开 **console.anthropic.com**，注册并登录。

2. 左侧菜单找到 **`API Keys`** → 点 **`Create Key`** → 起个名字（比如 `fala-ai`）→ 创建。

3. **立刻把这串 key 复制下来存到备忘录**（形如 `sk-ant-api03-xxxxx`）。
   > ⚠️ 这个页面关掉后就再也看不到完整的 key 了，只能重新生成。

4. **【重要，别跳过】** 去左侧的 **`Billing`** 页面：
   - 绑定支付方式（调用 AI 是要花钱的）
   - 找到 **`Set budget`** 或用量上限，**先设成 10 美金/月**

   这是你的安全阀。万一链接被大量使用或被恶意刷，最多花这么多就自动停，不会失控。

✅ **完成标志**：手里有一串 `sk-ant-` 开头的 key，且已设好每月上限。

---

## 第 3 步 · 用 Vercel 部署（约 5 分钟）

Vercel 负责把代码变成一个真实的网址，免费。

1. 打开 **vercel.com** → 点 `Sign Up` → 选 **`Continue with GitHub`**（用 GitHub 账号登录，会自动关联）。

2. 进入后点 **`Add New...`** → **`Project`**。

3. 在列表里找到 `fala-ai` 仓库 → 点右边的 **`Import`**。

4. **关键一步**：在配置页面找到 **`Environment Variables`**（环境变量），展开它，填入：
   - **Key**（名称）：`ANTHROPIC_API_KEY`
   - **Value**（值）：粘贴第 2 步复制的那串 key
   - 点 **`Add`**

   > 可选：再加一条 `DAILY_TOTAL_CAP` = `500`，给自己上一道每日总调用量的保险。

5. 其他设置**都不用改**（Framework 会自动识别成 Vite），直接点 **`Deploy`**。

6. 等 1-2 分钟，看到 🎉 恭喜页面，点 **`Continue to Dashboard`**，就能看到你的网址了，形如：
   `https://fala-ai-xxxx.vercel.app`

✅ **完成标志**：手机上打开这个网址，能正常使用，且在「添加句子」里输入中文能成功翻译出来。

---

## 完成之后

- **这个网址就是你的**，可以发给任何人、贴进公众号和小红书。
- **想换个好记的名字**：Vercel 项目 → `Settings` → `Domains`，可以改成 `fala-ai.vercel.app` 这类（如果没被占用）。
- **以后想改内容**：把新文件传到 GitHub 仓库，Vercel 会自动重新部署，不用再操作。

---

## 遇到问题怎么办

| 现象 | 原因 / 解决 |
|---|---|
| 部署失败，红色 Error | 多半是文件没传全。回 GitHub 检查 `package.json`、`index.html`、`src/`、`api/` 是否都在 |
| 网页打开是白屏 | 等一分钟刷新；仍不行就把 Vercel 的报错信息发给 Claude |
| 翻译提示"服务器未配置 API key" | 环境变量名写错了。必须**一字不差**是 `ANTHROPIC_API_KEY`，改完要重新 Deploy 一次 |
| 翻译一直失败 | 去 Anthropic 后台看 Billing 是否已绑定支付方式、是否已到上限 |
| 有声音但读得不对 | 手机缺少该语言的语音包，去系统设置里下载「葡萄牙语（巴西）」 |

---

## 上线后可以立刻做的两件事

1. **自己先完整用一遍**：加一句、加入在练、跟读一次、跨语言搬一次家。确认都正常再发出去。
2. **想开数据统计时**：把 `src/App.jsx` 里的 `const SEND = false;` 改成 `true`，重新上传即可。埋点已经全部就位（详见 `ANALYTICS.md`）。
