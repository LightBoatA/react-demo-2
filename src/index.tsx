// 引入全局垫片
import "core-js/stable";
// // 被@babel/preset-env 的依赖引入的，polyfill。使得支持yield
import "regenerator-runtime/runtime";
import React from 'react';
import ReactDom from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
// import 'moment/locale/zh-cn';
import App from './App';
import './assets/less/index.less';

const Index = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  );
};

ReactDom.render(<Index />, document.getElementById('root'));
