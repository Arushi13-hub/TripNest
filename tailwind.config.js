/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#7C0E44',
          50: '#fdf2f6',
          100: '#fbe6ee',
          200: '#f7cfde',
          300: '#f1abc5',
          400: '#e577a4',
          500: '#d54d83',
          600: '#b82b66',
          700: '#9b1b51',
          800: '#7C0E44',
          900: '#69113c',
          950: '#400420',
        },
        berry: {
          DEFAULT: '#AA5E7A',
          50: '#fbf5f7',
          100: '#f7ebf0',
          200: '#f0d9e3',
          300: '#e4bccd',
          400: '#d296af',
          500: '#be7493',
          600: '#AA5E7A',
          700: '#8e4963',
          800: '#773f54',
          900: '#643848',
        },
        blush: {
          DEFAULT: '#D49A9A',
          50: '#fbf7f7',
          100: '#f7eeef',
          200: '#f0dfdf',
          300: '#e5c7c7',
          400: '#D49A9A',
          500: '#c17e7e',
          600: '#ab6565',
          700: '#8f5151',
          800: '#774545',
          900: '#643d3d',
        },
        champagne: {
          DEFAULT: '#F2DACE',
          50: '#fdfbfa',
          100: '#faf5f2',
          200: '#F2DACE',
          300: '#eac0af',
          400: '#dea18a',
          500: '#d08468',
        },
        plum: {
          DEFAULT: '#3A1224',
          50: '#fdf3f7',
          900: '#3A1224',
        },
        'sand-light': '#FAF3EF',
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        }
      }
    },
  },
  plugins: [],
}
