import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: "#08090D",
          light: "#F6F8FC",
        },
        glass: {
          substrate: "var(--glass-substrate)",
          card: "var(--glass-card)",
          border: "var(--glass-border)",
          highlight: "var(--glass-highlight)",
        },
        brand: {
          indigo: "#6366F1",
          violet: "#8B5CF6",
          cyan: "#06B6D4",
          rose: "#F43F5E",
          emerald: "#10B981",
          amber: "#F59E0B",
        },
      },
      borderRadius: {
        spatial: "22px",
        "spatial-sm": "14px",
        "spatial-lg": "28px",
        capsule: "9999px",
      },
      boxShadow: {
        "glass-sm": "0 2px 10px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "glass-md": "0 8px 30px 0 rgba(0, 0, 0, 0.18), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        "glass-lg": "0 20px 50px 0 rgba(0, 0, 0, 0.28), inset 0 1px 0 0 rgba(255, 255, 255, 0.16)",
        "glow-indigo": "0 0 24px -2px rgba(99, 102, 241, 0.45)",
        "glow-cyan": "0 0 24px -2px rgba(6, 182, 212, 0.45)",
        "glow-rose": "0 0 24px -2px rgba(244, 63, 94, 0.45)",
      },
      backdropBlur: {
        spatial: "28px",
        deep: "40px",
      },
      animation: {
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
