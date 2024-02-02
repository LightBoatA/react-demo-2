const path = require('path');
const cwd = process.cwd();
const resolve = (pathName) => {
  return path.resolve(cwd, pathName);
};
module.exports = {
    extensions: [' ', '.ts', '.tsx', '.less', '.js', '.jsx'],
    alias: {
      '@': resolve('src'),
      '@pages': resolve('src/pages'),
      '@routers': resolve('src/routers'),
      '@utils': resolve('src/utils'),
      '@model': resolve('src/model'),
      '@hooks': resolve('src/hooks'),
    }
  };
