import { DefinePlugin, optimize } from 'webpack'
import HTMLWebpackPlugin from 'html-webpack-plugin';

const entry = {
  css: './styles/app.styl',
  vendor: [
    'bluebird',
    'cytoscape',
    'cytoscape-dagre',
    'dagre',
    'fast-csv',
    'immutable',
    'localforage',
    'lodash.debounce',
    'react',
    'react-dom',
    'react-redux',
    'redux',
    'redux-actions',
    'redux-immutablejs',
    'redux-promise'
  ],
  app: './app/app.js'
};
const commons = ['vendor'];
if (process.env.NODE_ENV === 'development') {
  entry.dev = [
    'redux-devtools',
    'redux-devtools-dock-monitor',
    'redux-devtools-log-monitor'
  ];
  commons.push('dev');
}

export default {
  // context: `${process.cwd()}/app`,
  entry,
  output: {
    path: './build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.jsx$/, loaders: ['react-hot', 'babel']},
      { test: /\.json$/, loader: 'json' },
      { test: /^((?!graph).)*\.styl$/, loaders: ['style', 'css', 'stylus'] },
      { test: /graph\.styl$/, loaders: ['css?-minimize', 'stylus'] }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
    }),
    new optimize.CommonsChunkPlugin({names: commons}),
    new HTMLWebpackPlugin({title: 'EMMA Toolkit'})
  ],
  devServer: {
    contentBase: './build'
  },
  node: {
    fs: 'empty'
  }
};
