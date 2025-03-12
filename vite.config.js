import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "public", // This should point to where your index.html is
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
