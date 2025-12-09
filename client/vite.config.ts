import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@assets": path.resolve(
        __dirname,
        "node_modules/@patternfly/react-core/dist/styles/assets/*",
      ),
    },
  },
  plugins: [react(), tailwindcss()],
});
