# 二维码生成器

## 项目简介

这是一个基于 React 和 Ant Design 的二维码生成器 web 应用。用户可以自定义各种参数来生成二维码,并且可以复制或下载生成的二维码图片。

## 功能特点

- 自定义二维码内容
- 调整二维码大小(预设或自定义)
- 自定义前景色和背景色
- 设置纠错级别
- 添加边距
- 嵌入自定义图片
- 复制生成的二维码到剪贴板
- 下载生成的二维码图片

## 技术栈

- React
- TypeScript
- Ant Design
- qrcode.react

## 安装

1. 克隆仓库:

   ```bash
   git clone https://github.com/your-username/qr-code-generator.git
   ```

2. 进入项目目录:

   ```bash
   cd qr-code-generator
   ```

3. 安装依赖:
   ```bash
   npm install
   ```

## 使用方法

1. 启动开发服务器:

   ```bash
   npm run dev
   ```

2. 在浏览器中打开 `http://localhost:8000`

3. 使用表单自定义二维码参数

4. 点击"复制图片"或"导出图片"按钮来使用生成的二维码

## 部署

要构建生产版本,运行:

```bash
npm run build
```

构建后的文件将位于 `dist` 目录中。
