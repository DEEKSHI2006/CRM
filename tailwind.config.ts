import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(125, 211, 252, 0.12), 0 20px 80px rgba(15, 23, 42, 0.6)"
      },
      colors: {
        surface: {
          950: "#08111f",
          900: "#0b1729",
          850: "#102036",
          800: "#162846"
        }
      }
    }
  },
  plugins: []
};

export default config;