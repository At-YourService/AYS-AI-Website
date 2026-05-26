import { defineConfig } from 'vite';
import { readdirSync, copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Copies the root scripts/ folder into dist/scripts/ after each build.
// This keeps server-side PHP scripts out of public/ while still deploying them.
function copyScriptsPlugin() {
  return {
    name: 'copy-scripts',
    closeBundle() {
      const src  = join(__dirname, 'scripts');
      const dest = join(__dirname, 'dist', 'scripts');
      mkdirSync(dest, { recursive: true });
      for (const file of readdirSync(src)) {
        copyFileSync(join(src, file), join(dest, file));
        console.log(`[copy-scripts] ${file} → dist/scripts/${file}`);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [copyScriptsPlugin()],

  // Set base path based on deployment target
  // GitHub Pages: /AYS-AI-Website/
  // OVHCloud: /
  // Local tests: /
  base: process.env.VITE_BASE_PATH || '/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for debugging
    sourcemap: true,
    // Optimize build - use esbuild (faster and built-in)
    minify: 'esbuild',
    // Rollup options
    rollupOptions: {
      output: {
        // Hash asset names for cache busting
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  // Server options for local development
  server: {
    port: 5173,
    open: true,
  },

  // Preview server (for testing production build locally)
  preview: {
    port: 4173,
  },
});
