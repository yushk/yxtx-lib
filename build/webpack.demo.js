const path = require('path')
const base = require('./webpack.base.js')

module.exports = Object.assign(base, {
  mode: 'production',
  entry: './example/index.js',
  output: {
    filename: '[name].[hash:7].js',
    path: path.resolve(process.cwd(), 'dist')
  }
})
