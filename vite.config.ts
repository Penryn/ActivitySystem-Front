import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssImport from "postcss-import"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        // 先运行postcss-import插件，确保能正确解析@import语句
        postcssImport(),
        // 然后应用TailwindCSS
        tailwindcss("./tailwind.config.js"),
        // 最后添加autoprefixer进行兼容性处理
        autoprefixer()
      ]
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://121.43.236.83:8081',  // 代理地址
        changeOrigin: true,  // 是否跨域
        rewrite:(path) => path.replace(/^\/api/,'') // 去掉接口地址中的api字符串
      }
    },
  }
})
