const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    return {
        entry: {
            index: './static/src/apps/index.js',
            login: './static/src/apps/login.js',
        },
        mode: env,
        devtool: env === 'development' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
        output: {
            filename: 'js/[name]-[chunkhash:8].bundle.js',
            path: path.resolve(__dirname, 'build'),
            publicPath: '/',
            chunkFilename: env === 'development' ? 'js/[name].chunk.js' : 'js/[name].[chunkhash:5].chunk.js',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.css', '.json', '*'],
        },
        module: {
            rules: [{
                test: /\.js|jsx$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                use: [{
                    loader: 'babel-loader?cacheDirectory=true',
                    options: {
                        presets: ['env', 'react', 'stage-2'],
                        plugins: [
                            'antd',
                            'transform-decorators-legacy',
                            ['transform-runtime', {
                                polyfill: false,
                                regenerator: true
                            }]
                        ]
                    }
                }],
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'style-loader'
                })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {url: false}
                    }, {
                        loader: 'less-loader',
                        options: {
                            compress: true,
                        }
                    }],
                    fallback: 'style-loader'
                })
            }, {
                test: /\.(png|jpg|gif|jpeg|otf|eot|svg|ttf|woff|woff2)(\?\S+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '/asset/[hash:8].[ext]',
                    }
                }],
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                chunks: ['index'],
                template: './static/views/index.html',
                filename: './views/index.html',
            }),
            new HtmlWebpackPlugin({
                chunks: ['login'],
                template: './static/views/login.html',
                filename: './views/login.html',
            }),
            new ExtractTextPlugin({
                filename: './styles/[name].[hash:8].css',
                allChunks: true
            }),
            new CleanWebpackPlugin(['build'], {
                root: path.resolve(__dirname),
                verbose: true,
                watch: false
            }),
            new CopyWebpackPlugin([ // 复制插件
                {
                    from: path.join(__dirname, '/static/public'),
                    to: path.join(__dirname, 'build/public')
                }
            ]),
        ],
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
            chunks: false
        }
    };
};
