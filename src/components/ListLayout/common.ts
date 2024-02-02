// import { initRouter } from '@/routers/Customer';
// import { flattenRoute } from '@/routers/utils';

import { initRouter } from "@/routers/pages";

// const firstItem = {
//   name: '操作台',
//   url: '/'
// };

// // 根据pathname  生成面包屑路径
// export const findRouteByPathName = (pathname: string) => {
//   let breadData = [firstItem];

//   if (pathname === '/') return breadData;

//   const navList = initRouter();
//   const _navList = flattenRoute(navList);
//   if (_navList && !_navList.length) return breadData;

//   const pathArr = pathname.split('/');
//   const _pathArr = pathArr.filter(item => item && !/^\d+$/.test(item)).map(item => '/' + item);
//   if (!_pathArr.length) return breadData;
//   console.log(_pathArr);
//   const __pathArr = _pathArr.map((item, index) => {
//     return _pathArr.splice(0, index + 1).toString();
//   });
//   console.log(_pathArr.slice(0, 1));

//   const _breadData = _pathArr.map(item => {
//     const itemArr = _navList.filter(n => n.path.includes(item));
//     if (itemArr.length) {
//       return {
//         name: itemArr[0].title,
//         url: itemArr[0].path
//       };
//     }
//   });

//   const __breadData = _breadData.filter(item => item !== undefined);

//   const ___breadData = [...breadData, ...__breadData].reverse();

//   return ___breadData.splice(0, 2).reverse();
// };

// 根据pathname  找到路由名称
export const findRouteNameByPathName = (pathname: string): string => {
  if (pathname === '/') return '';
  const navList = initRouter();
  const arr = navList.filter(item => item.path === pathname);
  if (arr.length === 0) return '';
  return arr[0].title ? arr[0].title : '';
};
