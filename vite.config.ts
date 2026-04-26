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
  build: {
    // Round 9 Batch 4 — chunk-splitting for faster homepage load
    // Conservative grouping: framework + radix + supabase + charts + remainder.
    // Falls back to default Rollup behavior if any group's dynamic imports
    // overlap (Rollup will still produce a working bundle).
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Only chunk node_modules — application code stays in its own
          // route-level chunks (already lazy-loaded via React.lazy)
          if (!id.includes('node_modules')) return undefined;

          // React & router — required on every page
          if (id.includes('/react/') || id.includes('/react-dom/') ||
              id.includes('react-router') || id.includes('scheduler')) {
            return 'vendor-react';
          }

          // Radix UI primitives — large but tree-shake well per primitive;
          // still worth grouping into one chunk so they share a network round-trip
          if (id.includes('@radix-ui/')) {
            return 'vendor-radix';
          }

          // Supabase client + auth + realtime — used everywhere, group together
          if (id.includes('@supabase/')) {
            return 'vendor-supabase';
          }

          // Recharts — heavy, only needed on dashboard / analytics pages
          if (id.includes('/recharts/') || id.includes('/d3-')) {
            return 'vendor-charts';
          }

          // ElevenLabs voice client — only needed on voice/chat routes
          if (id.includes('@11labs/') || id.includes('@elevenlabs/')) {
            return 'vendor-voice';
          }

          // Form libs — used by auth + admin
          if (id.includes('react-hook-form') || id.includes('@hookform/') ||
              id.includes('/zod/')) {
            return 'vendor-forms';
          }

          // Default: let Rollup decide. Returning undefined keeps the
          // dependency in the chunk that imports it.
          return undefined;
        },
      },
    },
  },
}));
