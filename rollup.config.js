import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

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
      presets: ['@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-class-properties'],
      babelHelpers: 'bundled',
    }),
    postcss({}),
    resolve(),
    commonjs({ extensions: ['.js', '.jsx'] }),
  ],
};

export default config;
