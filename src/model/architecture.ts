import { ILatLng } from "@/pages/BuildManage/QQMap"
import axios from "./axios"
import * as url from "./url"
import { EArchitectureType } from "@/hooks/useArchitecture";

export interface ITunnelLatLngs {
  from: ILatLng,
  to: ILatLng,
}
export interface IArchitecture {
  id?: string,
  parentId: number | null,
  name: string,
  lat: number | null;
  lng: number | null;
  latLngs: ITunnelLatLngs[],
  type?: EArchitectureType;
  children?: IArchitecture[];
}
// 获取全部建筑数据
export const getArchitectureAll = () => {
  return axios.get(`${url.deviceTypeAll}`);
}
export const addArchitecture = (data: IArchitecture) => {
  return axios.post(`${url.addArchitecture}`, data)
}

export const updateArchitectureById = (id: number, data: IArchitecture) => {
  return axios.put(`${url.editArchitecture}${id}`, data)
}

export const deleteArchitectureById = (id: number) => {
  return axios.dDelete(`${url.deleteArchitecture}${id}`)
}

