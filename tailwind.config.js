/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#001524', // Color principal
        secondary: '#15616D', // Color secundario
        accent: '#FFD700', // Color de acento (opcional)
        background: '#F0F0F0', // Color de fondo (opcional)
        text: '#333333', // Color de texto (opcional)
      },
    },
  },
  plugins: [],
}

