/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.pug'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
