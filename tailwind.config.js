/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        "carbon-950": "#0a0a0a",
        "carbon-900": "#121212",
        "carbon-800": "#1e1e1e",
        "carbon-700": "#2a2a2a",
        "carbon-600": "#363636",
        brake: "#c41e3a",
        "tire-green": "#2d5a27",
        "fuel-gold": "#d4a84b",
        "racing-blue": "#3b82f6"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Roboto Mono", "monospace"]
      }
    },
  },
  plugins: [],
};
