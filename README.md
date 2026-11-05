# 日语 N5–N1 单词自测 · 2000 词

一个零依赖、纯静态的日语单词自测网页。给出中文或日文题干，选择「熟悉」直接跳过，选择「不熟悉」才展开**词性 / 译文 / 读音**。覆盖初学到 N1，含 535 个副词与接续词。

- 无需构建、无需后端、无需 npm install
- GitHub Pages 开箱即用，本地双击 `index.html` 也能跑
- 复习清单保存在浏览器 localStorage，不上传任何数据

## ✨ 功能

| 功能 | 说明 |
| --- | --- |
| 级别 | 全部 / N5 320 词 · N4 400 词 · N3 440 词 · N2 420 词 · N1 420 词 |
| 词性筛选 | 副词、接续词・连词、动词、い形容词、な形容词、名词・サ变、外来语 |
| 每轮题数 | 20 / 50（默认）/ 100 / 一轮全量，随机抽题 |
| 出题方向 | 中文 / 日文混合、只出日文、只出中文 |
| 答题流程 | 熟悉 → 跳过；不熟悉 → 展开词性 / 译文 / 读音 → 下一个 |
| 复习 | 不熟词自动入清单，可「只练复习清单」，按级别 / 词性范围筛选 |
| 其他 | 进度条、结束页汇总、快捷键、深色模式、移动端适配 |

快捷键：`1` / `←` 熟悉，`2` / `→` 不熟悉，`Enter` 下一个词。

## 🚀 部署到 GitHub Pages

1. 在 GitHub 新建空仓库（建议名 `japanese-vocab-quiz`），把本目录内容上传：

   ```bash
   cd japanese-vocab-quiz
   git init
   git add .
   git commit -m "feat: 日语 N5-N1 2000 词自测"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/japanese-vocab-quiz.git
   git push -u origin main
   ```

2. 仓库 **Settings → Pages → Build and deployment**：Source 选 `Deploy from a branch`，Branch 选 `main` / `(root)`，保存。

3. 约 1–2 分钟后访问 `https://<你的用户名>.github.io/japanese-vocab-quiz/`。

`.nojekyll` 已内置，避免 GitHub Pages 的 Jekyll 处理静态文件。

**本地使用**：直接双击 `index.html`（词库以普通 `<script>` 加载，`file://` 下可用）；若浏览器限制本地文件，起个静态服务器即可：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/
```

## 📁 目录结构

```
japanese-vocab-quiz/
├── index.html                      # 主页面（Pages 入口）
├── data/
│   └── words.js                    # 2000 词词库，唯一数据源
├── scripts/
│   ├── validate.cjs                # 词库完整性校验
│   └── build-standalone.cjs        # 生成离线单文件 dist/standalone.html
├── .github/workflows/
│   └── validate.yml                # CI：push / PR 自动校验词库
├── README.md
├── LICENSE                         # MIT
├── .gitignore
└── .nojekyll
```

## 📝 词库格式与维护

`data/words.js` 中每条一行，5 个字段：

```js
{ level: "N1", jp: "曖昧", kana: "あいまい", pos: "な形容词", zh: "含糊、暧昧不清" },
```

- `level`：`N5` / `N4` / `N3` / `N2` / `N1`
- `pos`：名词、サ变名词、外来语（名词）、动词（五段 / 一段 / カ行变格）、サ变动词（〜する）、い形容词、な形容词、副词、接续词・连词、连体词、代词等（合法值见 `scripts/validate.cjs`）
- `kana` 必须是纯假名；`jp` 与 `zh` 需全库唯一（中文题干靠译文反查，重复会产生歧义）

改完执行校验，CI 也会在 push / PR 时自动跑：

```bash
node scripts/validate.cjs
```

想导出一个可离线分发的单文件：

```bash
node scripts/build-standalone.cjs   # 输出到 dist/standalone.html（dist/ 已忽略）
```

这样词库始终只有一份，不会出现单文件版与网页版不同步。

## ⚠️ 说明

- 级别划分按常用度与难度**参考编排**，并非 JLPT 官方词表（官方不公布固定词表），边界处可能有个别词偏易 / 偏难。
- 约 1200 条读音由假名转换生成并经人工校正表兜底（如「真っ」系列、四字熟语），抽查无误；极个别冷门复合词若发现偏差，直接改 `kana` 字段并提 PR 即可。
- 复习清单存在浏览器 localStorage，换浏览器、换设备、换域名不会同步；清空浏览器数据会一并清除。
- 全站静态、无网络请求、无统计脚本。

## 🤝 贡献

欢迎补词、修读音、修译文：编辑 `data/words.js` → `node scripts/validate.cjs` 通过 → 提交 PR。请勿直接改 `index.html` 里的逻辑来增删词条。

## 📄 许可

[MIT](LICENSE)
