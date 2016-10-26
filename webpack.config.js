'use strict'

import webpack from 'webpack'
import { version } from './package.json'

const jsloader = {
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'babel-loader',
  query: {
    presets: ['es2015']
  }
}

const bundles = {
  entry: {
    [`_index-${version}`]: './src/js/_index.js',
    'sitefinity-cms': './src/js/sitefinity-cms.js',
    'basic-tests': './src/js/basic-tests.js'
  },
  output: {
    path: './build/js',
    filename: '[name].min.js'
  },
  module: {
    loaders: [jsloader]
  },
  devtool: 'source-map'
}

const plugins = [ new webpack.optimize.UglifyJsPlugin({ sourceMap: true }) ]

const config = {
  version: version,
  dev: Object.assign({}, bundles),
  dist: Object.assign({}, bundles, { plugins })
}

export default config
