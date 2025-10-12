const { merge } = require('webpack-merge');

const common = require('./webpack.backend.common');

module.exports = merge(common, {
  mode: 'development'})