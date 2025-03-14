/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts}",
    "./src/**/**/*.{vue,ts}",
  ],
  darkMode: false, // or 'media' or 'class' 设置暗黑模式
  theme: {
    extend: {},
  },
  plugins: [],
}

