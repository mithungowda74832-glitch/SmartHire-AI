import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Ensure that if an API key (such as Google AIzaSy...) was mistakenly set as VITE_API_BASE_URL,
  // it is stripped out immediately so it is never exposed to client code.
  const rawBaseUrl = process.env.VITE_API_BASE_URL || '';
  const isInvalidUrl =
    rawBaseUrl.startsWith('AIzaSy') ||
    rawBaseUrl.startsWith('sk-') ||
    (!rawBaseUrl.startsWith('http://') && !rawBaseUrl.startsWith('https://') && rawBaseUrl.length > 0);

  const sanitizedBaseUrl = isInvalidUrl ? '' : rawBaseUrl.replace(/\/+$/, '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(sanitizedBaseUrl),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

