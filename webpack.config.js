const path = require('path');
// const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = (env) => {
    return {
        entry: {
            'index' : './static/src/apps/index.js',
            'login' : './static/src/apps/login.js',
        },
        mode: env,
        devtool: env === 'development' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
        output: {
            filename: 'js/[name].bundle.js',
            path: path.resolve(__dirname, 'build'),
            chunkFilename: 'js/chunck/[chunkhash:8].chunk.js',
            publicPath: '/'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.css', '.json', '*'],
        },
        // optimization: {
        //     splitChunks: {
        //         cacheGroups: {
        //             commons: {
        //                 chunks: 'all',
        //                 minChunks: 2,
        //                 priority: -20,
        //                 maxInitialRequests: 5,
        //                 minSize: 0,
        //                 name: 'common'
        //             },
        //             module: {
        //                 chunks: 'all',
        //                 minChunks: 2,
        //                 test: /[\\/]node_modules[\\/]/,
        //                 priority: -10,
        //                 name: 'module'
        //             },
        //             antd: {
        //                 chunks: 'all',
        //                 minChunks: 2,
        //                 test: /antd/,
        //                 priority: -5,
        //                 name: 'antd'
        //             },
        //             react: {
        //                 chunks: 'all',
        //                 minChunks: 2,
        //                 test: /react/,
        //                 priority: -5,
        //                 name: 'react'
        //             }
        //         }
        //     }
        // },
        module: {
            rules: [
                {
                    test: /(\.jsx|\.js)$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            // presets: ['env', 'react', 'stage-2'],
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'}
                    ]
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(['build'], {
                root: __dirname,
                verbose: true,
                dry: false
            }),
            new CopyWebpackPlugin([ // 复制插件
                {
                    from: path.join(__dirname,'/static/public'),
                    to:  path.join(__dirname,'build/public')
                }
            ]),
            new HtmlWebpackPlugin({
                chunks: ['index'],
                template: './static/views/index.ejs',
                filename: './views/index.ejs',
            }),
            new HtmlWebpackPlugin({
                chunks: ['login'],
                template: './static/views/login.ejs',
                filename: './views/login.ejs',
            }),
        ],
        performance: {
            hints: env === 'production' ? false : 'warning',
        },
        stats: {
            version: false,
            source: false,
            reasons: false,
            modules: false,
            hash: false,
            timings: false,
            chunkOrigins: false,
            cachedAssets: false,
            moduleTrace: false,
            children: false,
            chunks: false,
        },
    };
};
