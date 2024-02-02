import { RouterType } from '@/routers/pages';
import { IAccount } from './actions/user';

export const defaultState: IState = {
  menuList: [],
  isLoading: false,
  modalBtnLoading: false,
  btnLoading: false,
  selectPathname: '',
  organizeTreeExpandedKeys: [],
  userInfo: {} as IAccount
};

export interface IState {
  menuList: RouterType[];
  isLoading: boolean;
  modalBtnLoading: boolean;
  btnLoading: boolean;
  selectPathname: '';
  organizeTreeExpandedKeys: (number | string)[];
  userInfo: IAccount;
}

export interface IActions<T = any> {
  type: string;
  preload: T;
  [key: string]: any;
}
