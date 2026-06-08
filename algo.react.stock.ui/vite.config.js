import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // Proxy requests to the API endpoint
      "/api": {
        target: "https://localhost:7033", // Your backend API URL
        //target: "https://api.algosystems.com.au", // Your backend API URL
        changeOrigin: true, // Change origin to the target
        secure: false, // Set to false if your backend uses self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, ""), // Optionally remove `/api` prefix if needed
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@features": path.resolve(__dirname, "src/features"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
