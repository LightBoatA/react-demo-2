// import { changeParam } from '@/utils/utils';
import { changeParam } from '@/utils/utils';
import axios from './axios';
import * as url from './url';
import { IRole } from './role';

// interface IOauthToken {
//   grant_type: string;
//   client_secret: string;
//   client_id: string;
//   username: string;
//   password: string;
//   status: number; // pc端登录
// }

export interface IUser {
  id?: number;
  accountName: string,
  company: string,
  realName: string,
  password: string,
  role: IRole,
}

// export enum EAccountStatus {
//   'active' = 'ACTIVE',
//   'inactive' = 'INACTIVE', // 停用
// }
export enum EAccountStatus {
  'inactive', // 未注册
  'normal', // 已注册
  'frozen', // 已冻结
  'deleted', // 已删除
}

// 获取账号信息
export const getPersonDetail = () => {
  return axios.get(url.getPersonDetail);
};

// jsapi鉴权
export const getJsapiConfig = (_url: string) => {
  return axios.get('/public/jsapi/signature?url=' + _url);
};
// 获取泰政通用户登录详情
export const getTaizhengtongStaffDetail = () => {
  return axios.get(url.getTaizhengtongStaffDetail);
};

// 泰政通登录
export const taizhengtongLogin = (code: string) => {
  return axios.post(`${url.taizhengtongLogin}?code=${code}`);
};

// TODO 获取token
export const getUserLogin = values => {
  let data = new FormData();
  data.append('username', values.username);
  data.append('password', values.password);
  return axios.post(url.getUserLogin, data);
};

export const getUserList = () => {
  return axios.get(`${url.userList}`)
}

export const addUser = (data: IUser) => {
  return axios.post(`${url.userAdd}`, data)
}

// export const updateUserById = (id: number, data: IUser) => {
//   return axios.put(`${url.userEdit}${id}`, data)
// }

export const bindingRoleById = (staffId: string, roleId: number) => {
  return axios.put(`${url.bindingRole}${staffId}/role/${roleId}`)
}

export const resetPassword = (id: number) => {
  return axios.put(`${url.userPassowrdReset}${id}/resetpwd`)
}

export const updateUserStatusById = (id: number, status: EAccountStatus) => {
  return axios.put(`${url.userEdit}${id}/${status}`)
}