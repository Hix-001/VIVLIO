/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f5f2eb",
        surface: "rgba(255, 255, 255, 0.75)",
        surfaceElevated: "rgba(255, 255, 255, 0.88)",
        gold: "#c59b27",
        goldLight: "#dfb846",
        goldMuted: "rgba(197, 155, 39, 0.15)",
      },
      fontFamily: {
        // Apple's "New York" luxury serif typeface stack
        serif: [
          '-apple-system-ui-serif',
          '"New York"',
          'ui-serif',
          'Charter',
          '"Source Serif 4"',
          '"Iowan Old Style"',
          '"Apple Garamond"',
          'Baskerville',
          'Georgia',
          'serif',
        ],
        // Apple's "San Francisco" modern clean UI typeface stack
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          'system-ui',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          '"JetBrains Mono"',
          'ui-monospace',
          'Menlo',
          'monospace',
        ],
      },
      boxShadow: {
        'glass': '0 20px 48px -12px rgba(0, 0, 0, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)',
        'glass-hover': '0 28px 64px -12px rgba(0, 0, 0, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 1)',
        'glass-pill': '0 4px 18px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
      },
    },
  },
  plugins: [],
}
