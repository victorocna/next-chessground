import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'browser',
  target: 'es2022',
  dts: true,
  sourcemap: false,
  clean: true,
  // Keep the dev guard readable at runtime: the browser platform would otherwise inline
  // NODE_ENV and constant-fold `process.env.NODE_ENV !== 'production'` to a literal.
  define: { 'process.env.NODE_ENV': 'process.env.NODE_ENV' },
});
