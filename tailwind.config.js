/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color)',
        container: 'var(--container-color)',
        stroke: 'var(--stroke-color)',
        primary: 'var(--primary-color)',
        title: 'var(--title-color)',
        text: 'var(--text-color)',
        subtext: 'var(--text-secondary)',
      },
    }
  },
  plugins: [require('tailwind-scrollbar-hide')],
};

