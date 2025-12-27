/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#2E7D32', // Vert nature/santé
          'dark': '#1B5E20', // Vert plus foncé pour le mode sombre
          'light': '#4CAF50', // Vert plus clair
        },
        'secondary': {
          DEFAULT: '#D4AF37', // Or premium
          'dark': '#B8860B', // Or plus foncé
          'light': '#FFD700', // Or plus clair
        },
        'accent': {
          DEFAULT: '#FF6B35', // Orange vibrant
          'dark': '#E55100',
          'light': '#FF8A65',
        },
        'light': '#FFFFFF', // Blanc pureté
        'dark': '#1A1A1A',
        'gray': {
          '50': '#F9FAFB',
          '100': '#F3F4F6',
          '200': '#E5E7EB',
          '300': '#D1D5DB',
          '400': '#9CA3AF',
          '500': '#6B7280',
          '600': '#4B5563',
          '700': '#374151',
          '800': '#1F2937',
          '900': '#111827',
        },
      },
      fontFamily: {
        'sans': ['Poppins', 'Lato', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}