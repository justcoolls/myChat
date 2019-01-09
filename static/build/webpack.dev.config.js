let webpack = require('webpack');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.config');

module.exports = merge(baseWebpackConfig, {

  devtool: 'source-map',
  plugins: [
    
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
  ]
});



