import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",     // allow external connections
    port: 8080,
    strictPort: true,    // don't auto-change port
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "nonconstructive-appositional-ali.ngrok-free.app"
    ],
    headers: {
      "Access-Control-Allow-Origin": "*",        // fix CORS
      "ngrok-skip-browser-warning": "true"       // bypass ngrok banner
    }
  },
  preview: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "nonconstructive-appositional-ali.ngrok-free.app"
    ],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
