import axios from './axios';
import * as url from './url';

export interface IRole {
  id?: number;
  label: string,
  description: string,
  name: string,
  permissions: string[],
}
export const getRoleList = () => {
  return axios.get(`${url.roleList}`)
}

export const addRole = (data: IRole) => {
  return axios.post(`${url.roleAdd}`, data)
}

export const updateRoleById = (id: number, data: IRole) => {
  return axios.put(`${url.roleEdit}${id}`, data)
}

export const deleteRoleById = (id: number) => {
  return axios.dDelete(`${url.roleDelete}${id}`)
}