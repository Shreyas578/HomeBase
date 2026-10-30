/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom Curated Academic & Taste Palette: Beige, Crimson, Forest Green
        beige: {
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#ebe1d1",
          300: "#decbb2",
          400: "#cbb08f",
          500: "#bb9772",
          600: "#ad8361",
          700: "#906a4f",
          800: "#765743",
          900: "#181411", // Deep warm charcoal beige canvas
          950: "#0f0d0b", // Deepest warm obsidian
        },
        crimson: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#e11d48", // Vivid Crimson
          600: "#be123c", // Classic Crimson
          700: "#9f1239", // Deep Crimson
          800: "#881337",
          900: "#4c0519",
        },
        forest: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d", // Deep Forest Green
          800: "#166534", // Dark Forest
          900: "#052e16", // Midnight Forest
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
