# 词云图试炼之旅 (Word Cloud Journey)

这是一个基于 React + Vite 构建的单页前端应用（SPA）。

## 本地运行

1. 确保你已安装了 [Node.js](https://nodejs.org/) (建议版本 v18+)。
2. 在项目根目录，运行以下命令安装依赖：

```bash
npm install
```

3. 启动本地开发服务器：

```bash
npm run dev
```

启动后，控制台会显示本地访问地址（例如 `http://localhost:3000` 或 `http://localhost:5173`），你可以在浏览器中打开它即可体验。

## 生产环境打包部署

如果你想将此应用部署到你的服务器、GitHub Pages、Vercel 或其他托管平台，请运行：

```bash
npm run build
```

该命令会在项目根目录下生成一个 `dist` 文件夹，里面包含了所有已经经过压缩打包的静态文件及资源。
你只需要将 `dist` 文件夹里的内容部署到任意静态文件服务器（如 Nginx, Apache 或静态页面托管平台）即可运行。

## 导出与部署

在这个界面中，你只需点击编辑器右上角的设置按钮 -> 选择 "Export to ZIP" 即可下载完整代码。
下载解压后，按照上方的「本地运行」流程操作即可！
