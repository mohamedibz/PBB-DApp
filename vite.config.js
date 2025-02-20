import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      events: 'events',
    },
  },
  server: {
    hot: true, 
    watch: {
      usePolling: true, 
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  
  build: {
    rollupOptions: {
      // Aquí es donde metemos el plugin para producción:
      plugins: [
        rollupNodePolyFill(),
      ],
    },
  },

})
