const path = require('path');
const glob = require('glob-all');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PATHS = {
  js: path.join(__dirname, 'src/'),
  views: path.join(__dirname, 'views'),
  root: path.join(__dirname, '..'),
};

console.log(PATHS.root);

module.exports = {
  mode: 'production',
  entry: {
    index: './src/js/index.js',
  },
  stats: {
    loggingDebug: ['sass-loader'],
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: (pathData) => {
        return pathData.chunk.name === 'index' ? 'style.min.css' : '[name].min.css';
      },
    }),
    new PurgeCSSPlugin({
      paths: glob.sync([`${__dirname}/*.html`], { nodir: true }),
      // safelist: {
      //   standard: [/d-none/, /:marker/],
      //   deep: [/strong/, /aria/],
      //   greedy: [/strong/, /aria/, /contact-formular/, /r-c/],
      // },
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader, // 3. extract css into files
          'css-loader', // 2. Turns css into commonjs

          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-sort-media-queries']],
              },
            },
          },

          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                // This silences the deprecation warning
                silenceDeprecations: ['legacy-js-api'],
              },
            },
          }, // 1. Turns sass into css
        ],
      },
      // {
      //   test: /\.m?js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-env'],
      //     },
      //   },
      // },
    ],
  },
};
