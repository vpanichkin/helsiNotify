const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './FrontEnd/MainComponent.jsx'
    ],
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        hot: true,
        contentBase: 'public/',
        historyApiFallback: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    stats: {
        colors: true,
        reasons: true,
        chunks: true
    },
    plugins: [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()],
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            }
        ]
    }
};