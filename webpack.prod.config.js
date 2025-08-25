const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  
  entry: {
    // Bundle principal optimisé
    'widget-core': [
      './js/api-client.js',
      './js/api-monitor.js',
      './js/wrapper-api.js'
    ],
    // Bundles modulaires
    'widget-api': './js/api-client.js',
    'widget-monitor': './js/api-monitor.js',
    'widget-wrapper': './js/wrapper-api.js'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].min.js',
    library: {
      name: 'WidgetDSFR',
      type: 'umd',
      export: 'default'
    },
    clean: true,
    globalObject: 'this'
  },
  
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: false,
    
    // Configuration du tree shaking
    providedExports: true,
    concatenateModules: true,
    
    // Suppression du code mort
    innerGraph: true,
    
    // Optimisation des chunks
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    
    // Configuration du minifier
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 2015,
          compress: {
            drop_console: true, // Supprimer TOUS les console.log en production
            drop_debugger: true,
            dead_code: true,
            unused: true,
            pure_funcs: [
              'console.log',
              'console.debug',
              'console.info',
              'console.warn'
            ],
            passes: 3,
            arrows: true,
            collapse_vars: true,
            comparisons: true,
            computed_props: true,
            hoist_funs: true,
            hoist_props: true,
            hoist_vars: false,
            inline: 3,
            loops: true,
            negate_iife: true,
            properties: true,
            reduce_funcs: true,
            reduce_vars: true,
            switches: true,
            toplevel: true,
            typeofs: true,
            booleans: true,
            if_return: true,
            sequences: true,
            side_effects: true,
            warnings: false
          },
          mangle: {
            safari10: true,
            toplevel: true,
            properties: {
              regex: /^_/
            }
          },
          format: {
            comments: false,
            ascii_only: true
          }
        },
        extractComments: false
      })
    ],
    
    // Optimisation du runtime
    runtimeChunk: {
      name: 'runtime'
    },
    
    // Configuration des IDs déterministes
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  },
  
  plugins: [
    // Plugin pour définir l'environnement de production
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEV__': false,
      '__PROD__': true
    }),
    
    // Compression Gzip
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 1024,
      minRatio: 0.8,
      deleteOriginalAssets: false
    }),
    
    // Compression Brotli (meilleure compression)
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        level: 11
      },
      threshold: 1024,
      minRatio: 0.8,
      filename: '[path][base].br',
      deleteOriginalAssets: false
    }),
    
    // Plugin pour analyser la taille du bundle
    new webpack.ProgressPlugin(),
    
    // Optimisation des modules
    new webpack.optimize.ModuleConcatenationPlugin(),
    
    // Limitation de la taille des chunks
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 5
    }),
    
    // Optimisation de la taille minimale des chunks
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 10000
    })
  ],
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['>0.25%', 'not dead']
                },
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              // Plugin pour supprimer les console.log au build
              ['transform-remove-console', {
                exclude: ['error']
              }]
            ],
            cacheDirectory: true,
            cacheCompression: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }
        ]
      }
    ]
  },
  
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'api': path.resolve(__dirname, 'js')
    }
  },
  
  // Optimisations de performance
  performance: {
    hints: 'warning',
    maxEntrypointSize: 250000, // 250kb
    maxAssetSize: 250000,
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith('.js');
    }
  },
  
  // Configuration du cache
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
    compression: 'gzip'
  },
  
  // Pas de source map en production (économie de taille)
  devtool: false,
  
  // Stats pour analyse
  stats: {
    assets: true,
    children: false,
    chunks: true,
    chunkModules: false,
    colors: true,
    entrypoints: true,
    modules: false,
    performance: true,
    warnings: true,
    errors: true,
    errorDetails: true,
    timings: true,
    builtAt: true
  }
};