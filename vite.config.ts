import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';
import importMetaEnv from '@import-meta-env/unplugin';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    eslint(),
    importMetaEnv.vite({
      env: '.env',
      example: '.env.example'
    })
  ],
  build: {
    target: 'esnext',
    outDir: 'build',
    rollupOptions: {
      output: {
        chunkFileNames: `[name].[hash].js`
      }
    }
  },
  define: {
    'process.env': process.env
  }
});
