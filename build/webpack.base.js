const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false // 不将注释提取到单独的文件中
      })
    ]
  }
};
