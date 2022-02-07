const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './example/index.js',
  },
  devtool: 'inline-source-map',
 devServer: {
   static: './dist',
   open:true,
   port:9000,
 },
  plugins: [
    new HtmlWebpackPlugin({
      title: '',
      template:'./example/public/index.tpl'
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
};