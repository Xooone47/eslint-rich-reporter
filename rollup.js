const {rollup} = require('rollup');
const babel = require('rollup-plugin-babel');
const {nodeResolve} = require('@rollup/plugin-node-resolve');

const babelConfig = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
  ],
  exclude: 'node_modules/**',
  runtimeHelpers: true,
  extensions: ['.js', '.ts'],
};

const main = async () => {
  const plugins = [
    nodeResolve({
      extensions: ['.js', '.ts'],
      modulesOnly: true,
    }),
    babel(babelConfig),
  ];

  const inputOptions = {
    context: __dirname,
    input: 'src/reporter.ts',
    plugins: plugins,
  };

  const bundle = await rollup(inputOptions);
  bundle.write({format: 'cjs', file: 'cjs/reporter.js', sourcemap: false});
};

main();
