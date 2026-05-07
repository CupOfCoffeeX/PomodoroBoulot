import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Bare package imports (e.g. "zustand", "react") inside desktop source files
// are resolved starting from apps/desktop/, where node_modules doesn't exist on
// Vercel. Re-route them as if they were imported from apps/web/src so Rollup
// finds them in apps/web/node_modules.
function resolveDesktopDeps(): Plugin {
  const webSrcProxy = path.resolve(__dirname, 'src/App.tsx');
  return {
    name: 'resolve-desktop-deps',
    async resolveId(id, importer, options) {
      if (!importer?.includes('/desktop/')) return null;
      if (id.startsWith('.') || id.startsWith('/') || id.startsWith('\0')) return null;
      return this.resolve(id, webSrcProxy, { ...options, skipSelf: true });
    },
  };
}

export default defineConfig({
  plugins: [resolveDesktopDeps(), react()],
  resolve: {
    alias: [
      // Tauri stubs — must come before the generic @ alias
      {
        find: '@tauri-apps/api/window',
        replacement: path.resolve(__dirname, 'src/stubs/tauri-window.ts'),
      },
      {
        find: '@tauri-apps/plugin-notification',
        replacement: path.resolve(__dirname, 'src/stubs/tauri-notification.ts'),
      },
      // All shared desktop source
      {
        find: '@',
        replacement: path.resolve(__dirname, '../desktop/src'),
      },
    ],
  },
  server: {
    port: 5173,
  },
  preview: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    strictPort: false,
  },
});
