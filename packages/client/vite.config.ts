import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  // build: {
  //   outDir: "../../dist/client",
  //   emptyOutDir: true,
  // },
  plugins: [react()],
});
