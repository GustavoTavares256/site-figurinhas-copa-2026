/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#07111f",
        pitch: "#06111f",
        glass: "rgba(255,255,255,0.08)",
        gold: "#ffd500",
        electric: "#00b4ff",
        emerald: "#00c875"
      },
      boxShadow: {
        premium: "0 28px 90px rgba(0,0,0,.38)",
        glow: "0 18px 48px rgba(0,180,255,.22)"
      }
    }
  },
  plugins: []
};
