/**
 * 根据权限筛选菜单路由
 */

import { findValueObj } from '@/utils/utils';
import { RouterType } from './common';

/**
 * 将路由转为一维数组
 */
export const flattenRoute = (routeList: RouterType[], path?: string) => {
  const result: RouterType[] = [];
  for (let i = 0; i < routeList.length; i++) {
    const route = routeList[i];
    if (path) {
      route.fatherRoute = path;
    }
    result.push({
      ...route
    });
    if (route.routes) {
      result.push(...flattenRoute(route.routes, route.path));
    }
  }
  return result;
};

/**
 * 根据当前的路由选择选中的菜单
 */

export const getMenuByPathname = (pathName, formatNavList) => {
  let openKeys = '';
  let keys = '';
  // 针对pathname:id带参数的直接忽略后面的参数，变成:
  const _arr = pathName.split('/');
  const _pathName = _arr
    .map(item => {
      let obj = item;
      if (item && !/^[a-zA-Z]+$/.test(item)) {
        obj = ':';
      }
      return obj;
    })
    .join('/');

  // 针对传进来的路由数组讲:type?这种可选参数变成'',将:id带参数的直接忽略后面的参数，变成:
  const _formatNavList = [...formatNavList].map(item => {
    item.formatPath = item.path.replace(/[:][a-zA-Z]{1,30}[?]/g, '').replace(/[:][a-zA-Z]{1,30}/g, ':');
    return item;
  });

  // 判断pathname和路由数组相同的是哪一项，针对 :type?、:id判断不同
  const getNumber = (arr, key, value) => {
    if (!(arr && Array.isArray(arr))) {
      return -1;
    }
    const num = arr.findIndex(item => {
      const str = _arr[_arr.length - 1];
      let index = -1;
      // 纯数字
      if (/^[0-9]+$/.test(str)) {
        index = value.lastIndexOf('/:');
      } else {
        index = value.lastIndexOf('/:/');
      }

      let _value = value;
      if (index > -1) {
        _value = value.substring(0, index + 3);
        return item[key] === _value;
      }
      return item[key] === _value;
    });
    return num;
  };
  const menuArr: any = [];
  // 找出pathname的父路由，可能是一层或者两层
  const getSelectedPathName = (name, arr) => {
    const index = getNumber(arr, 'formatPath', name);
    if (index > -1) {
      // 选中的为二级菜单
      if (arr[index].isMenu === 'second') {
        menuArr.push(arr[index]);
      }
      if (arr[index].isMenu === 'first') {
        menuArr.push(arr[index]);
        const fRoute = arr[index]?.fatherRoute || '';
        const childIndex = fRoute && getNumber(arr, 'formatPath', fRoute);
        if (childIndex > -1) {
          // 选中的为二级菜单
          getSelectedPathName(fRoute, _formatNavList);
        }
      }
      if (arr[index].isMenu === 'no') {
        const fRoute = arr[index]?.fatherRoute || '';
        const childIndex = fRoute && getNumber(arr, 'formatPath', fRoute);
        if (childIndex > -1) {
          // 选中的为二级菜单
          getSelectedPathName(fRoute, _formatNavList);
        }
      }
    }
    return menuArr;
  };
  const arr = getSelectedPathName(_pathName, _formatNavList);
  if (arr.length === 1) {
    // openKeys = arr[0].path;
    keys = arr[0].path;
  }
  if (arr.length === 2) {
    openKeys = findValueObj(arr, 'isMenu', 'second')?.path || '';
    keys = findValueObj(arr, 'isMenu', 'first')?.path;
  }

  return { openKeys, keys };
};


