import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, MenuProps } from 'antd';
import { setUpChooseTableParams, useRouter, setUpChooseTabsParams } from 'ym-web-view';
import { flattenRoute, getMenuByPathname } from '@/routers/utils';
import { useRedux } from '@/hooks/useRedux';
import './index.less';
import { RouterType } from '@/routers/common';
import Logo from '../Logo';
// import Icon from '@ant-design/icons';

interface Props {
  navList: RouterType[];
  title: string;
  titleDesc?: string;
  homePath: string;
  openMenuKeys?: string;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, name: string, icon?: React.ReactNode, children?: MenuItem[], type?: 'group'): MenuItem {
  return {
    key,
    icon,
    name,
    children,
    label,
    type
  } as MenuItem;
}

export const formatMenuByNavList = (list: RouterType[], selectedKeys) => {
  if (!list) return;
  const items: MenuItem[] = [];

  
  list.forEach((item: any) => {
    if (item.isMenu === 'first') {
      items.push(getItem(item.title, item.path, item.name as string, <div className={`${item.name} icon-size`}></div>));
    } else if (item.isMenu === 'second') {
      items.push(getItem(item.title, item.path, item.name as string, <div className={`${item.name} icon-size`}></div>, formatMenuByNavList(item.routes as RouterType[], selectedKeys)));
    }
  });

  
  return items;
};

let timer: any;
export const MenuNav: React.FC<Props> = props => {
  const { navList, title, homePath, openMenuKeys, titleDesc } = props;
  const { history, location } = useRouter();
  const [selectKeys, setSelectKeys] = useState<string[]>([homePath]);
  const [selectOpenKeys, setSelectOpenKeys] = useState<string[]>(openMenuKeys ? [openMenuKeys] : []);
  const [formatNavList] = useState(flattenRoute(navList));
  const { state, actions } = useRedux();
  // console.log('state:::dfskfksfsf=------------', state);
  

  const handle = useCallback(
    item => {
      // console.log('点击了：', item);
      // console.log('selectKeys', selectKeys?.toString());
      
      // if (selectKeys?.toString() !== [item.key]?.toString()) {
      //   setUpChooseTabsParams('', true, true);
      //   setUpChooseTableParams({}, true, true);
      // }
      history.push(item.key);

      setSelectKeys([item.key]);
      if (item.keyPath.length === 1) {
        setSelectOpenKeys([]);
      }
      if (item.keyPath.length === 2) {
        setSelectOpenKeys([item.keyPath[1]]);
      }
    },
    [history]
  );

  // useEffect(() => {
    // clearTimeout(timer);
    // timer = setTimeout(() => {
    //   const pathname = state.selectPathname;
    //   if (pathname && pathname !== '/') {
    //     const { openKeys, keys } = getMenuByPathname(pathname, formatNavList);
    //     if (openKeys || keys) {
    //       keys && setSelectKeys([keys]);
    //       // openKeys && setSelectOpenKeys([openKeys]);
    //     } else {
    //       setSelectKeys([homePath]);
    //     }
    //   } else {
    //     setSelectKeys([homePath]);
    //   }
    //   history.push(pathname);
    // }, 100);
  // }, [formatNavList, history, homePath, state.selectPathname]);

  useEffect(() => {
    const { pathname } = location;
          if (pathname && pathname !== '/') {
            const { openKeys, keys } = getMenuByPathname(pathname, flattenRoute(navList));
        if (openKeys || keys) {
          keys && setSelectKeys([keys]);
          openKeys && setSelectOpenKeys([openKeys]);
        } else {
          setSelectKeys([homePath]);
        }
      } else {
        setSelectKeys([homePath]);
      }
  }, [formatNavList, homePath, location, navList]);

  return useMemo(() => {
    const items = formatMenuByNavList(navList, selectKeys);
    // console.log('菜单项：', items);
    
    return (
      <div className="module-menu">
        <div className="module-menu-title flex-c-c">
            {/* <img src="" alt="" className="logo" /> */}
            <Logo/>
            <div className="text">
              <div className="main">{title}</div>
            <div className="desc">{titleDesc}</div>
            </div>
          </div>
        <div className="module-menu-wrap">
          <Menu
            selectedKeys={selectKeys}
            openKeys={selectOpenKeys}
            mode="inline"
            items={items}
            onClick={obj => {
              handle(obj);
            }}
            onOpenChange={keys => {
              if (selectOpenKeys) {
                const latestOpenKey = keys.find(key => selectOpenKeys.indexOf(key) === -1);
                if (latestOpenKey === selectOpenKeys[0]) {
                  setSelectOpenKeys([]);
                } else {
                  setSelectOpenKeys(keys);
                }
              } else {
                setSelectOpenKeys(keys);
              }
            }}
          />
        </div>
      </div>
    );
  }, [handle, navList, selectKeys, selectOpenKeys, title, titleDesc]);
};

export default MenuNav;
