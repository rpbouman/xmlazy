import compiler from '@ampproject/rollup-plugin-closure-compiler';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      name: 'xmlazy',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      compiler({
        formatting: 'PRETTY_PRINT'
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/main.js',
    external: [],
    output: [
      { 
        file: pkg.main, 
        file: 'dist/xmlazy.cjs.min.js', 
        format: 'cjs' 
      },
      { 
        file: pkg.module, 
        file: 'dist/xmlazy.esm.min.js', 
        format: 'es' 
      }
    ],
    plugins: [
      compiler()
    ]
  },
  {
    input: 'src/main.js',
    external: [],
    output: [
      { 
        file: pkg.main, 
        format: 'cjs' 
      },
      { 
        file: pkg.module, 
        format: 'es' 
      }
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/xmlazy.bundle.js',
      format: 'es'
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/xmlazy.bundle.min.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      compiler({
        env: 'BROWSER'
      })
    ]
  }
];
