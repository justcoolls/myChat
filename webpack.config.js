const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
        module: {
            rules: [
                {
                    test: /(\.jsx|\.js)$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ['env', 'react', 'stage-0'],
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
                template: './static/views/index.html',
                filename: './views/index.html',
            }),
            new HtmlWebpackPlugin({
                chunks: ['login'],
                template: './static/views/login.html',
                filename: './views/login.html',
            })
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
