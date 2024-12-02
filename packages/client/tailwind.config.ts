import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  important: "#root",
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
