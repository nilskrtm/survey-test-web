import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr(), eslint()],
  build: {
    target: 'esnext',
    outDir: 'build'
  },
  define: {
    'process.env': process.env
  }
});
