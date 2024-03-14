/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html'],
  daisyui: {
    themes: ['sunset'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
