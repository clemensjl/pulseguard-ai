import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        apple: {
          bg: "#000000",
          card: "#0c0c0e",
          cardHover: "#141417",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.16)",
          subtext: "#86868b",
          text: "#f5f5f7",
          blue: "#2997ff",
          blueHover: "#0077ed",
          green: "#30d158",
          amber: "#ffd60a",
          red: "#ff453a",
          purple: "#bf5af2",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
        tight: "-0.015em",
      },
      boxShadow: {
        "apple-card": "0 0 0 1px rgba(255,255,255,0.08), 0 20px 40px -15px rgba(0,0,0,0.7)",
        "apple-card-hover": "0 0 0 1px rgba(255,255,255,0.16), 0 30px 60px -20px rgba(0,0,0,0.8)",
        "apple-glass": "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 20px 40px rgba(0,0,0,0.5)",
        "apple-button": "inset 0 1px 0 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
