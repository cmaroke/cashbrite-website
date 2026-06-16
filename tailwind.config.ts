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
      colors: {
        navy: "#071d2b",
        mint: "#b9ead8",
        sea: "#23856f",
        cream: "#fbf7ec",
        ink: "#102b3a",
      },
      boxShadow: {
        soft: "0 24px 60px rgba(7, 29, 43, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
