/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts}",
    "./src/**/**/*.{vue,ts}",
  ],
  darkMode: 'media', // 更新这里，使用 'media' 而不是 false
  theme: {
    extend: {},
  },
  plugins: [],
}

