# Lau · 个人站与博客

AI Agent / LLM 应用工程师的个人展示站：项目、开源贡献、工作经历与博客，托管于 GitHub Pages。

在线地址：<https://lau0708.github.io/>

## 结构

- `index.html` — 首页：项目、开源贡献（bytedance/deer-flow 3 个 PR）、工作经历、博客
- `posts/` — 博客文章
- `style.css` / `script.js` — 样式与主题切换（亮 / 暗跟随系统，可手动切换）

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://127.0.0.1:8000
```

## 更新发布

直接改文件后提交并 push 到 `main` 分支即可，GitHub Pages 会自动重新构建发布。

```bash
git add -A && git commit -m "update site" && git push origin main
```
