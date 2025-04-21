const path = require('path');
const glob = require('glob-all');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PATHS = {
  js: path.join(__dirname, 'src'),
  root: path.join(__dirname, 'src'),
};

console.log(PATHS.root);

module.exports = (env, argv) => {
  const mode = argv.mode;
  const isProduction = argv.mode == 'production';

  console.log('mode: ', mode);
  console.log('isProduction: ', isProduction);

  return {
    mode: mode,
    devtool: !isProduction && 'source-map',
    stats: {
      loggingDebug: ['sass-loader'],
    },
    entry: {
      index: './src/js/index.js',
    },
    output: {
      filename: '[name].wbpgs.min.js',
      path: path.resolve(__dirname, 'public'),
      clean: true,
    },
    resolve: {
      alias: {
        '@fonts': path.resolve(__dirname, 'src', 'assets', 'fonts'),
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: (pathData) => {
          return pathData.chunk.name === 'index' ? 'style.wbpgs.min.css' : '[name].wbpgs.min.css';
        },
      }),
      new CopyPlugin({
        patterns: [{ from: './src/images', to: './images' }],
      }),

      isProduction &&
        new PurgeCSSPlugin({
          paths: glob.sync([`./*.html`], { nodir: true }),
          // safelist: {
          //   standard: [/d-none/, /:marker/],
          //   deep: [/strong/, /aria/],
          //   greedy: [/strong/, /aria/, /contact-formular/, /r-c/],
          // },
        }),
    ],
    optimization: isProduction
      ? {
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
        }
      : undefined,
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
            'sass-loader', // 1. Turns sass into css
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
        {
          test: /\.(png|jpe?g|avif|svg|webp)$/i,
          type: 'asset', // Automatically chooses between inline/resource
          generator: {
            filename: 'images/[name][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 1 * 1024, // 4kb - files smaller will be inlined
            },
          },
        },

        {
          test: /sprite\.svg$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
      ],
    },
  };
};
