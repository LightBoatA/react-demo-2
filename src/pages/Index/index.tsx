import React, { useCallback, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import MenuNav from '@/components/MenuNav';
import { initRouter } from '@/routers/pages';
import './index.less';
import { flattenRoute } from '@/routers/utils';
import { useRedux } from '@/hooks/useRedux';
import { generateFilteredRouters } from '@/routers/common';

export const Index: React.FC = () => {
    const [navListFormat, setNavListFormat] = useState<any>([]);
    const [flattenRouters, setFlattenRouters] = useState<any>([]);
    const { actions } = useRedux();

    const initData = useCallback(async () => {
        try {
            actions.global.setLoading(true);
            const data: any = await actions.user.userInfo() || {};
            const permissionList: any = data.role.permissions || ['all'];
            const filteredRouters = generateFilteredRouters(permissionList);
            setNavListFormat([...filteredRouters])
            const routes = [...flattenRoute(initRouter())];
            setFlattenRouters(routes);
            actions.global.setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }, [actions.global, actions.user]);

    // useEffect(() => {
    //     setUpChooseTabsParams('',true,true)
    //     storage.session.set('cache_table_params', {});
    // },[])

    useEffect(() => {
        initData();
    }, [initData])


    return (
        <div className='page-wrap flex'>
            {/* 左侧菜单栏 */}
            <div className="menu-left">
                <MenuNav title={"设备赋码系统"} titleDesc={"EQUIPMENT CODING SYSTEM"} navList={navListFormat} homePath="/dashboard"></MenuNav>
            </div>
            {/* 内容显示区 */}
            <div className="content-center">
                <Switch>
                    {/* <Redirect exact from="/" to={process.env.NODE_ENV === 'qa' ? '/taizhengtong' : '/login'} /> */}
                    {flattenRouters.map((route: any) => (
                        <Route
                            exact
                            key={route.name}
                            path={route.path}
                            render={(routerProps: any) => {
                                const Component: any = route.component; // 注入路由信息
                                return <Component {...routerProps} />;
                            }}
                        />
                    ))}
                </Switch>
            </div>
        </div>
    )
};

export default Index;
