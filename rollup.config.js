import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import { readFileSync } from 'fs';
import babel from '@rollup/plugin-babel';

const packageJson = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url)).toString()
)

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      name: 'creative-kit-react'
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/*.stories.tsx', '**/*.test.tsx']
    }),
    terser(),
    postcss({ extract: 'styles.css' }), // specify the output CSS file name
    babel({
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'bundled'
    })
  ],
  external: ['react', 'react-dom']
};

export default config;