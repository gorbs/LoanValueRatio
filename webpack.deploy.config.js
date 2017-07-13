var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var DefinePlugin = require('webpack').DefinePlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const DIST = './dist';
var config = {
    entry: [path.resolve(__dirname, './ui/js/main.jsx'), path.resolve(__dirname, './ui/css/main.sass')],
    output: {
        path: path.resolve(__dirname, DIST),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015', 'stage-1']
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        },{
            test: /\.s[ca]ss$/,
            loader: ExtractTextPlugin.extract('css!sass')
        }]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.sass']
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './node_modules/bootstrap/dist/css/bootstrap.css'),
                to: path.resolve(__dirname, DIST + '/css'),
                force: true
            },
            {
                from: path.resolve(__dirname, './ui/index.html'),
                to: path.resolve(__dirname, DIST),
                force: true
            },
            {
                from: path.resolve(__dirname, './node_modules/fixed-data-table/dist/fixed-data-table.min.css'),
                to: path.resolve(__dirname, DIST + '/css'),
                force: true
            },
        ]),
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"'
            }
        }),
        new ExtractTextPlugin( '/css/main.css', {
            allChunks: true
        })
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './',
        port: 3000,
    },
    node: {
        net: 'empty'
    }
};

module.exports = config;

