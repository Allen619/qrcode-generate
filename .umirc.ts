import { defineConfig } from "@umijs/max";

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: "二维码生成器", // 这里是 layout 配置
  },
  routes: [
    {
      path: "/",
      name: "首页",
      component: "./Home", // 指向 Home 组件
    },
  ],

  npmClient: "pnpm",
  tailwindcss: {},
});
