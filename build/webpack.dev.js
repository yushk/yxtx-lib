const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

var webpackConfig = {
  mode: 'development',
  entry: {
    index: './examples/index.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    open: true,
    hot: true,
    port: 9000
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      main: path.resolve(__dirname, '../src'),
      packages: path.resolve(__dirname, '../packages'),
      examples: path.resolve(__dirname, '../examples'),
      'yxtx-lib': path.resolve(__dirname, '../')
    },
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: /node_modules|utils\/popper\.js|utils\/date\.js/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          },
          {
            loader: path.resolve(__dirname, './md-loader/index.js')
          }
        ]
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'file-loader'
      }
      // {
      //   test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
      //   loader: 'url-loader'
      // }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      favicon: './examples/public/favicon.ico',
      template: './examples/public/index.tpl'
    }),
    new VueLoaderPlugin()
  ],
  output: {
    clean: true,
    publicPath: '/',
    path: path.resolve(process.cwd(), './dist/'),
    filename: '[name].[hash:7].js',
    chunkFilename: '[name].[hash:7].js'
  }
};
if (isProd) {
  webpackConfig.externals = {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'highlight.js': 'hljs'
  };
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:7].css'
    })
  );
  webpackConfig.optimization.minimizer.push(
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: false
    }),
    new OptimizeCSSAssetsPlugin({})
  );
  // https://webpack.js.org/configuration/optimization/#optimizationsplitchunks
  webpackConfig.optimization.splitChunks = {
    cacheGroups: {
      vendor: {
        test: /\/src\//,
        name: 'yxtx-lib',
        chunks: 'all'
      }
    }
  };
  webpackConfig.devtool = false;
}
module.exports = webpackConfig;
