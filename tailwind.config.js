/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./map.js", "/public/userInput.html"],
  theme: {
    extend: {
      colors: {
        jennie: '#ec4899',
        jisoo: '#3d2645',
        roseanne: '#000000',
        lisa: '#f0eff4',
      },
    },
  },
  plugins: [],
};
