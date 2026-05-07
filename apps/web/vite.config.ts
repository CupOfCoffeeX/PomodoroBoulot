import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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
