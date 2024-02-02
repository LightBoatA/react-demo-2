import { getPersonDetail, getTaizhengtongStaffDetail } from '@/model/user';
import { IActions, IState } from '../defaultState';
import { IRole } from '@/model/role';
import { DEVELOP_ADDRESS, QA_ADDRESS } from '@/utils/constant';

export interface IAccount {
  id: string;
  accountName: string;
  realName: string;
  enabled: boolean;
  role: IRole;
}

export const actions = {
  userInfo() {
    return async dispatch => {
      // try {
      //   const res1: any = await getTaizhengtongStaffDetail(); // 泰政通当前用户
      //   console.log('泰政通用户：', res1);
      // } catch (error) {
      //   console.log('获取泰政通用户失败：', error);
      // }

      try {
        let data = {};
        console.log('当前运行环境：', process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'development') {
          console.log('本地获取用户');
          
          const res: any = await getPersonDetail(); // 本地测试用户
          data = {
            id: res.id || '',
            accountName: res.accountName || '',
            realName: res.realName || '',
            role: res.role || '' , 
          };
        } else {
          console.log('获取泰政通用户');
          
          const res: any = await getTaizhengtongStaffDetail(); // 泰政通当前用户
          data = {
            id: res.staffId || '',
            realName: res.user.name || '',
            role: res.role || '',
          };
        }

        dispatch({
          type: 'userInfo',
          preload: data
        });
        return data;
      } catch (e) {
        dispatch({
          type: 'userInfo',
          preload: {}
        });
      }
    };
  },
  clearUserInfo() {
    return {
      type: 'clearUserInfo',
      preload: {
        userInfo: {}
      }
    };
  }
};

export const reducers = {
  userInfo(state: IState, action: IActions) {
    const data = action.preload;
    // TODO 可根据当前用户的信息对菜单进行过滤等操作
    return {
      ...state,
      userInfo: data
    };
  },
  clearUserInfo(state: IState, action: IActions) {
    return {
      ...state,
      userInfo: action.preload.userInfo
    };
  }
};
