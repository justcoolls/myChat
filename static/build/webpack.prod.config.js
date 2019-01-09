let webpack = require('webpack');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.config');

module.exports = merge(baseWebpackConfig, {
  // eval-source-map is faster for development
  
  plugins: [
    
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
      }
    })
  ]
})