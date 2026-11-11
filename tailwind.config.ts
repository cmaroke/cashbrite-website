import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Existing alpha utilities must resolve consistently during the visual rollout.
      opacity: { 8: "0.08", 12: "0.12", 14: "0.14", 15: "0.15", 18: "0.18", 22: "0.22", 28: "0.28", 35: "0.35", 45: "0.45", 55: "0.55", 62: "0.62", 65: "0.65", 68: "0.68", 70: "0.70", 72: "0.72", 74: "0.74", 75: "0.75", 76: "0.76", 78: "0.78", 80: "0.80", 85: "0.85", 92: "0.92" },
      spacing: {
        18: "4.5rem",
        "section-mobile": "3rem",
        "section-desktop": "4rem",
        "heading-copy": "1rem",
        "content-action": "1.5rem",
        "panel-mobile": "1.25rem",
        "panel-desktop": "1.5rem",
      },
      maxWidth: {
        site: "80rem",
        reading: "48rem",
        workflow: "64rem",
        report: "72rem",
      },
      colors: {
        // Legacy names keep existing layouts working during the staged rollout.
        navy: "#0F2A3A",
        mint: "#C7F36B",
        sea: "#3D604F", // Accessible text tone derived from sage.
        cream: "#F7F4EC",
        ink: "#0F2A3A",
        sage: "#54806B",
        lime: "#C7F36B",
        mist: "#E8EAE6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-manrope)", "sans-serif"],
        editorial: ["var(--font-editorial)", "serif"],
      },
      boxShadow: {
        soft: "0 24px 60px rgba(7, 29, 43, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
