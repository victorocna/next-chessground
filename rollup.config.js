import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

// Main build configuration for JS/ES modules
const config = {
  input: 'index.js',
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named', sourcemap: false },
    { file: pkg.module, format: 'es', exports: 'named', sourcemap: false },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    external(),
    babel({
      presets: [['@babel/preset-react', { runtime: 'automatic' }]],
      plugins: ['@babel/plugin-proposal-class-properties'],
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    postcss({}),
    resolve({
      moduleDirectories: ['node_modules'],
      preferBuiltins: false,
    }),
    commonjs({
      extensions: ['.js', '.jsx'],
      // Ensure lodash is not converted to CommonJS to preserve tree-shaking
      exclude: ['node_modules/lodash-es/**'],
    }),
    url({
      fileName: '[name][extname]',
      include: ['**/*.ogg'],
      limit: 100000,
    }),
    terser(),
  ],
};

export default config;
