import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://172.16.16.123:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/admin"),
        secure: false, // Set to false for HTTP or self-signed HTTPS
      },
    },
  },
});
