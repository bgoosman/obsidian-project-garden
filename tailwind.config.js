/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  // important: ".project-garden",
  theme: {
    extend: {},
  },
  // corePlugins: {
  //   preflight: false,
  // }, 
  plugins: [require('daisyui')],
}
