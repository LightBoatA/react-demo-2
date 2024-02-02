import React, { ReactNode } from 'react';
import Device from '@/pages/Device';
import Discard from '@/pages/Discard';
import User from '@/pages/User';
import Role from '@/pages/Role';
import DeviceType from '@/pages/DeviceType';
import DeviceAdd from '@/pages/Device/Add';
import DeviceDetail from '@/pages/Device/Detail';
import Build from '@/pages/BuildManage';
import Home, { Dashboard } from '@/pages/Dashboard';
import MapPage from '@/pages/Dashboard/Map';
import TaiZhengTong from '@/pages/TaiZhengTong';

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
  permission?: string;
}

// Test 模拟一级菜单、二级菜单 根据你的项目 选择配置一级菜单还是二级菜单?
// const Dashboard = lazy(() => import('../pages/Dashboard'));
// const AlarmInfo = lazy(() => import('../pages/AlarmInfo'));

export const initRouter = () => {
  const routers: RouterType[] = [
    {
      name: 'dashboard',
      path: '/dashboard',
      component: Dashboard,
      title: '工作台',
      isMenu: 'first',
      routes: [
        {
          name: 'map',
          path: '/dashboard/map/:id',
          component: MapPage,
          title: '地图',
          isMenu: 'no',
          routes: [],
        }
      ],
    },

    {
      name: 'device',
      // path: '/device/:tunnelId/:roomId',
      path: '/device',
      component: Device,
      title: '设备管理',
      isMenu: 'first',
      routes: [
        {
          name: 'deviceAdd',
          path: '/device/add',
          component: DeviceAdd,
          title: '新增设备',
          isMenu: 'no'
        },
        {
          name: 'deviceEdit',
          path: '/device/edit/:id',
          component: DeviceAdd,
          title: '设备编辑',
          isMenu: 'no'
        },
        {
          name: 'deviceDetail',
          path: '/device/detail/:id',
          component: DeviceDetail,
          title: '设备查看',
          isMenu: 'no'
        },
      ],
    },
    {
      name: 'discard',
      path: '/discard',
      component: Discard,
      title: '报废管理',
      isMenu: 'first',
      routes: [],
    },
    {
      name: 'system',
      path: '/system',
      component: Dashboard,
      title: '系统管理',
      isMenu: 'second',
      routes: [
        {
          name: 'user',
          path: '/system/user',
          component: User,
          title: '用户管理',
          isMenu: 'first'
        },
        {
          name: 'role',
          path: '/system/role',
          component: Role,
          title: '角色管理',
          isMenu: 'first'
        },
        {
          name: 'build',
          path: '/system/build',
          component: Build,
          title: '建筑管理',
          isMenu: 'first'
        },
        {
          name: 'deviceType',
          path: '/system/deviceType',
          component: DeviceType,
          title: '设备类型管理',
          isMenu: 'first'
        },
      ],
    },
  ];

  return routers;
};
