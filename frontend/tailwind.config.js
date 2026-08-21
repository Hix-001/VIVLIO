/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#100f0d",
        warm: "#181512",
        surface: "rgba(26, 23, 20, 0.85)",
        surfaceElevated: "rgba(36, 31, 27, 0.92)",
        gold: "#d4af37",
        goldGlow: "rgba(212, 175, 55, 0.25)"
      },
      fontFamily: {
        serifDisplay: ['"Instrument Serif"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        serifBody: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
