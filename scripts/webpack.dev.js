const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// 本地启动dev
const devServer = "10.212.28.129";  // dev     10.234.18.183
const devServerAccount = "10.234.13.87"; // dev

// qa
//  const devServer = "10.234.17.5";
//  const devServerAccount = "10.234.24.218";

module.exports = merge(commonConfig, {
  mode: "development",
  devtool: "cheap-module-source-map", //只针对行
  devServer: {
    host: "0.0.0.0",
    port: 7788,
    hot: true, // 开启HMR功能，用于开发环境
    open: true,
    compress: true,
    client: {
      logging: 'none',
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    historyApiFallback: true, // 解决react-router刷新404问题
    // 接口代理转发
    proxy: [{
      context: ['/oauth2'],
      target: `http://${devServerAccount}:8080`,
      changeOrigin: true
    }, {
      context: ['/public', '/file', '/api', '/login-customize'],
      target: `http://${devServer}:80`,
      changeOrigin: true
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin() // 开启js的HMR功能
  ],
  devtool: 'eval-source-map',
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    // 提取runtime文件，运行时文件
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`, // runtime文件命名规则
    },
  },
});
