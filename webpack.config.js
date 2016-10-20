'use strict'

import webpack from 'webpack'

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
    'all': './src/js/all.js',
    'page-a': './src/js/page-a.js',
    'page-b': './src/js/page-b.js'
  },
  output: {
    path: './build/js',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [jsloader]
  },
  devtool: 'source-map'
}

const plugins = [ new webpack.optimize.UglifyJsPlugin({ sourceMap: true }) ]

const config = {
  dev: Object.assign({}, bundles),
  dist: Object.assign({}, bundles, { plugins })
}

export default config
