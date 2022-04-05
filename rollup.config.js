import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');
const PROD = !!process.env.CI

export default {
  input: 'src/index.ts',
  context: 'globalThis',
  output: [
    {
      file: packageJson.main,
      format: 'amd',
      amd: {
        id: packageJson.name
      },
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    commonjs({
      exclude: 'node_modules',
      ignoreGlobal: true,
    }),
    PROD && terser({ format: { comments: false } }),
  ],
};