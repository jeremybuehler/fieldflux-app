import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // Only include Replit plugins if we're in a Replit environment
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          // Dynamically import Replit-specific plugins only when needed
          (await import("@replit/vite-plugin-runtime-error-modal")).default(),
          (await import("@replit/vite-plugin-cartographer")).cartographer(),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Raise limit to 1000kB since we've optimized chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // React and core libraries
          vendor: ['react', 'react-dom'],
          // UI libraries (only existing packages)
          ui: [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-hover-card', 
            '@radix-ui/react-label', 
            '@radix-ui/react-menubar', 
            '@radix-ui/react-navigation-menu', 
            '@radix-ui/react-popover', 
            '@radix-ui/react-progress', 
            '@radix-ui/react-radio-group', 
            '@radix-ui/react-scroll-area', 
            '@radix-ui/react-select', 
            '@radix-ui/react-separator', 
            '@radix-ui/react-slider', 
            '@radix-ui/react-slot', 
            '@radix-ui/react-switch', 
            '@radix-ui/react-tabs', 
            '@radix-ui/react-toast', 
            '@radix-ui/react-toggle', 
            '@radix-ui/react-tooltip'
          ],
          // Icons
          icons: ['lucide-react'],
          // Routing and data fetching
          routing: ['wouter', '@tanstack/react-query'],
          // Utilities
          utils: ['class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
