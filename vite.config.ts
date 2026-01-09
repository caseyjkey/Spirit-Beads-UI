import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: ["100.82.23.47", "spirit-beads.keycasey.com"],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Ensure production mode is set correctly
    'import.meta.env.PROD': mode === 'production',
    'import.meta.env.DEV': mode !== 'production',
    'import.meta.env.MODE': JSON.stringify(mode),
  },
}));
