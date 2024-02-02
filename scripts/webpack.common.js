
const path = require('path'); // nodejs核心模块，专门来处理路径问题
const webpack = require('webpack'); // nodejs核心模块，专门来处理路径问题
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//使用 Day.js 替换 momentjs 优化打包大小
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const resolveConfig = require('./resolve');
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

const srcDir = path.join(__dirname, '../src');
// 是否是开发模式
const devMode = process.env.NODE_ENV === 'development';
console.log('process.env:===========', process.env);
// 返回处理的样式
const getStyleLoaders = (preProcessor) => {
  return [
    // 使用什么loader处理，处理顺序从右向左
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader, // 将js中css通过动态创建style标签添加到html文件中生效
    'css-loader', // 将css代码编译成commonjs的模块到js中
    'postcss-loader', // css的兼容性配置 配合package.json中browserslist来指定兼容性程度
    {
      loader: 'px2rem-loader', // px转为rem
      options: {
        remUnit: 160,
      }
    },
    preProcessor && {
      loader: preProcessor,
      options: preProcessor === "less-loader"
      ? {
          // antd的自定义主题
          lessOptions: {
            modifyVars: {
              // "@primary-color": "#2078FE", // 全局主色
              // "@menu-bg": "#4c89f0", // 菜单背景色
              // "@modal-header-border-style": "dashed",
            },
            javascriptEnabled: true,
          },
        }
      : {},
    },
  ].filter(Boolean);
}

module.exports = {
    entry: {
        main: path.join(__dirname, '../src/index.tsx'),
    },
    output: {
        path: devMode ? undefined : path.resolve(__dirname, '../build'), // 所有文件打包都会在该目录下面 生产模式需要输出
        filename: devMode ? 'static/js/[name].js' : 'static/js/[name].[contenthash:8].js', // 入口文件打包输出资源命名方式
        // publicPath: "/",
        chunkFilename: devMode ? 'static/js/[name].chunk.js' : 'static/js/[name].chunk.[contenthash:8].js', // 打包输出的其他文件的命名  动态导入输出资源命名方式
        clean:  true, // 自动清空上次打包的内容 原理，在打包前，将path整个目录内容晴空，再进行打包
        assetModuleFilename: 'static/media/[hash:10][ext][query]' // 图片、字体等通过asset处理资源命名方式
    },
    resolve: resolveConfig,
    performance: false, // 关闭性能分析，提示速度
    module: {
        rules: [
          // 每一个文件只能被其中一个loader配置处理
         {
          oneOf: [
            {
              test: /\.less$/, // 只检测.less的文件
              use: getStyleLoaders('less-loader'),
            },
            {
                test: /\.css$/,
                use: getStyleLoaders(),
            },
            {
              test: /\.(jpe?g|png|gif|svg|woff|eot|otf|webp)$/i,
              type: "asset", // 可以转为base64
              parser: {
                  dataUrlCondition: {
                  maxSize: 10 * 1024 // 小于10kb的图片被base64处理
                }
              },
              generator: {
                  filename: 'static/image/[name]-[hash:6][ext]' // 图片的输出路径
              }
            },  // 字体视频文件的处理
            {
              test: /\.(ttf|woff2?|map4|map3|avi|xlsx)$/,
              type: "asset/resource", // 原封不动的输出
              generator: {
                filename: "static/media/[name]-[hash:6][ext]",
              },
            },
            {
              test: /\.(js|jsx|ts|tsx)$/,
              include: [srcDir],
              loader: 'babel-loader',
              options: {
                cacheDirectory: true, // 开启babel编译缓存
                cacheCompression: false,  // 缓存文件不要压缩
                plugins: [
                  //"@babel/plugin-transform-runtime", // 减少代码体积
                  devMode && "react-refresh/babel", // 开启js的HMR功能
                ].filter(Boolean)
              }
            }
          ]
      },
        ]
    },
    plugins:  [
      new ESLintWebpackPlugin({
        // 指定检查文件的根目录
        context: path.resolve(__dirname, "src"),
        exclude: "node_modules", // 默认值
        cache: true,// 开启缓存
        // 缓存目录
        cacheLocation:  path.resolve(__dirname,'../node_modules/.cache/.eslintcache')
      }),
      new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "../public/index.html"),
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      })
    ],
}
