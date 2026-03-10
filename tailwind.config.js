/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  // ... (configuración base de shadcn)
  theme: {
    extend: {
      colors: {
        // Dorado para acentos (botones, bordes de selección)
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F1D592',
          dark: '#AA8A22',
        },
        // Carbón para fondos y tarjetas
        charcoal: {
          DEFAULT: '#121212',
          light: '#1E1E1E',
          dark: '#0A0A0A',
        },
      },
    },
  },
}