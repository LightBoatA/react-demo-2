import { ReactNode } from "react";
import { initRouter } from "./pages";

export interface RouterType {
  title?: string;
  name?: string;
  path: string;
  component?: React.FC;
  /** 子路由 */
  routes?: RouterType[];
  isMenu?: string; // 不在菜单'no' 一级菜单'first' 二级菜单 'second'
  fatherRoute?: string; // 二级菜单的父级菜单
  belongRoute?: string;
  icon?: ReactNode;
  selectIcon?: ReactNode;
  permission?: string | string[];
}
interface permissionType {
  name: string;
  children: permissionType[];
}
// export const permissionTree: permissionType[] = [
//   {
//     name: 'dashboard',
//     children: [],
//   },
//   {
//     name: 'device',
//     children: [],
//   },
//   {
//     name: 'discard',
//     children: [],
//   },
//   {
//     name: 'system',
//     children: [
//       {
//         name: 'user',
//         children: [],
//       },
//       {
//         name: 'role',
//         children: [],
//       },
//       {
//         name: 'build',
//         children: [],
//       },
//       {
//         name: 'deviceType',
//         children: [],
//       },
//     ],
//   },
// ]
interface IPermissionParentInfo {
  [key: string] : null | string
}
export const permissionParentInfo: IPermissionParentInfo = {
  dashboard : null,
  device: null,
  discard: null,
  system: null,
  user: 'system',
  role: 'system',
  build: 'system',
  deviceType: 'system',
};

const _getFilteredRouters = (permissions, routers) => {
  const filteredRouters = routers.filter(route => {
    if (permissions.includes(route.name)) {
      if (route.routes) {
        route.routes = _getFilteredRouters(permissions, route.routes);
      }
      return true;
    }
    return false;
  });

  return filteredRouters;
}
export const generateFilteredRouters = (permissions) => {
  const allRouter = initRouter();
  // 如果是全权限，直接返回
  if (permissions.includes('all')) return allRouter;
  // 先将权限数组处理成更方便的结构（添加父级）
  const processedPermissionsSet = new Set<string>();
  permissions.forEach((_item) => {
    // 有父级：加父级
    if (permissionParentInfo[_item]) {
      processedPermissionsSet.add(permissionParentInfo[_item] as string)
    }
    // 加自己
    processedPermissionsSet.add(_item);
  })

  const processedPermissions = Array.from(processedPermissionsSet);
  return _getFilteredRouters(processedPermissions, allRouter);
  
};


// const permissions = ['dashboard', 'device', 'user', 'miniProgram'];
// const permissionsAddParent = findParentNames(permissions, permissionTree);
// console.log('带父亲的数组：', permissionsAddParent);
// const filteredRouters = generateFilteredRouters(permissionsAddParent, allRouter);
// console.log('过滤后的路由：', filteredRouters);

