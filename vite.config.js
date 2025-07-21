import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://13.62.4.52:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
