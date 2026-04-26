import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Round 10 hotfix: manualChunks (added in Round 9 Batch 4) was causing
  // a Temporal Dead Zone error in production — "Cannot access 'S' before
  // initialization" — because some Radix internals depend on each other
  // in ways that break when split into separate chunks. Reverted to
  // Rollup's default chunking which keeps mutually-dependent modules in
  // the same chunk. Bundle goes back to ~750 KB (one main + per-route
  // lazy chunks via React.lazy). Performance regression is acceptable;
  // a working site is non-negotiable.
  build: {
    chunkSizeWarningLimit: 800,
  },
}));
