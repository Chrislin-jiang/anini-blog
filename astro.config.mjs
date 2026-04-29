// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          // Split three.js and related 3D libraries into a separate chunk
          manualChunks(id) {
            if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
              return 'vendor-3d';
            }
            if (id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
          },
        },
      },
    },
  },
});