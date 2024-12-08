/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: 'media',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        "titleFont": "'Josefin Sans', sans-serif",
      },
      colors: {
        "logo": '#cda151',
        "primary": '#a19d9d',
        "textDark": '#100e10',
        "textLight": '#fcfcfc',
        "light": '#fcfcfc',
        "dark": '#333333',
        "gris": "#424242",
        "secondary": '#4a4a4a',
        "acento": "#3dd1ff"
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
