// import { clearTableCacheParams } from '@/utils/utils';
import React, { useMemo } from 'react';
import { Breadcrumb, useRouter } from 'ym-web-view';
import './index.less';
import { USERLOGININFO } from '@/utils/constant';
import { findRouteNameByPathName } from './common';
import { useRedux } from '@/hooks/useRedux';

interface IBread {
  name: string;
  url?: string;
}

interface IProps {
  children?: any;
  rootClassName?: string; // 根节点class
  layoutClassName?: string; //
  breadData?: IBread[]; // 面包屑信息
  addtionBtn?: React.ReactNode;
}


export const HeaderLayout: React.FC<IProps> = props => {
  const { children, rootClassName = '', breadData = [], layoutClassName = '', addtionBtn } = props;
  const { history } = useRouter();
  const { state } = useRedux();
  return useMemo(() => {
    return (
      <div className="layout-header flex-col">
        <div className="header">
          <div className="left">
            {breadData 
              ? <div className="ml10"><Breadcrumb breadData={breadData} separator="/" /></div>
               : <></>}
          </div>
          <div className="right">
            <div className="icon-user"></div>
            <span className="username">{`Hi~ ${state.userInfo.realName}`}</span>
          </div>
        </div>
        <div className="content flex-1">
          {children}
        </div>
      </div>
    );
  }, [breadData, children, state.userInfo.realName]);
};

export default HeaderLayout;
