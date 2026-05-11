import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        serif: ["Noto Serif SC", "Songti SC", "SimSun", "serif"],
      },
      boxShadow: {
        seal: "0 18px 60px rgba(80, 20, 20, 0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
