/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        laptop: "1023px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
}

