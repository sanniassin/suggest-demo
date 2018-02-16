var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var srcDir = path.resolve(__dirname, '../src');

var isProduction = process.env.NODE_ENV === 'production';

var browsers = ['> 1%', 'last 2 versions', 'Firefox ESR', 'IE >= 10', 'Android >= 4.4', 'Safari >= 7'];

module.exports = {
  devtool: 'cheap-module-source-map',
  context: srcDir,
  entry: {
    'react-app': './react-app/index.js',
    'vanilla-app': './vanilla-app/vanilla.js'
  },
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js'
  },
  resolve: {
    extensions: ['.js', '.scss'],
    modules: ['node_modules', 'src']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"'
    }),
    // new ExtractTextPlugin(isProduction ? 'style.[name].[chunkhash].css' : 'style.[name].css'),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(srcDir, 'react-app/index.html'),
      filename: 'react.html',
      chunks: ['react-app']
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(srcDir, 'vanilla-app/index.html'),
      filename: 'vanilla.html',
      chunks: ['vanilla-app']
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers
                }
              }],
              '@babel/preset-stage-2',
              '@babel/preset-react'
            ],
            generatorOpts: {
              asciiUnsaf1e: true
            }
          }
        },
        exclude: {
          test: /node_modules/
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              import: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers
                })
              ]
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  stats: {
    assets: false,
    children: false,
    chunks: false,
    chunkModules: false,
    modules: false
  }
};
