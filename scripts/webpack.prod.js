const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path'); // nodejs核心模块，专门来处理路径问题
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 打包后的js分析
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const commonConfig = require('./webpack.common');
const srcDir = path.join(__dirname, '../src');

let config = merge(commonConfig, {
  mode: 'production',
  devtool: "source-map", //行列都对应 会有对应的map文件精确定位行列的映射
  plugins: [
    //  将public下面的资源复制到dist目录去（除了index.html）
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../build"),
          toType: "dir",
          noErrorOnMissing: true, // 不生成错误
          globOptions: {
            // 忽略文件
            ignore: ["**/index.html"],
          },
          info: {
            // 跳过terser压缩js
            minimized: true,
          },
        },
      ],
  }),
    // 提取css成单独文件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css', // 文件内容发生变化，hash才会变化
      chunkFilename: 'static/css/[name].chunk.[contenthash:8].css',
    }),
     // css压缩
    new CssMinimizerPlugin(),
    // new webpack.ids.HashedModuleIdsPlugin(),

  ],
  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 800000,
  },
  optimization: {
    minimize: true, // 是否进行压缩
    minimizer: [new TerserPlugin({
       terserOptions: {
          compress: {
            drop_console: true,//传true就是干掉所有的console.*这些函数的调用.
            drop_debugger: true, //干掉那些debugger;
            // pure_funcs: ['console.info'] // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
         }
        }
      })], // 去除console
    splitChunks: {
      chunks: 'all', // 默认只作用于异步模块，为`all`时对所有模块生效,`initial`对同步模块有效
      // 以下是默认值 下面的配置如果组里面没有，默认用
      // minSize: 20000, // 分割代码最小的大小
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      // cacheGroups: { // 组，哪些模块要打包到一个组
      //   defaultVendors: { // 组名
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
      //     priority: -10, // 权重（越大越高）
      //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      //   },
      //   default: { // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 这里的minChunks权重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
      cacheGroups: { // 修改配置
        react: {  // 组，哪些模块要打包到一个组
          test: /[\\/]node_modules[\\/](react|react-dom|react-dom-router)/,
          name:'chunk-react',
          minChunks: 1, //目前只有一个入口
          priority: 40, // 权重
        },
        dll: {  // 组，哪些模块要打包到一个组
          test: /[\\/]node_modules[\\/](antd|@ant-design)/,
          minChunks: 1, //目前只有一个入口
          priority: 30,
          name: 'chunk-ant',
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          priority: 1,
          name: 'vendors',
        },
      },
    },
     // 提取runtime文件，运行时文件
     runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`, // runtime文件命名规则
    },
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserWebpackPlugin(),

    ]
  },
});


module.exports = config;
