import { ISpecParam } from "@/pages/Device/Add/SpecInfo";
import axios from "./axios"
import * as url from "./url"
import { IDeviceFile } from "@/pages/Device/Add/DeviceInfo";
import { buildQueryString } from "@/utils/utils";

export interface IDevice {
  number: string;
  name: string;
  dictionary: { id: number, name?: string, };
  tunnel: { id: number, name?: string, };
  room: { id: number, name?: string, };
  factoryName: string;
  factoryNumber: string;
  manufactureDate: string;
  description: string;
  specificationParams: ISpecParam[];
  attachments: IDeviceFile[];

}

export const getDeviceList = (params:any = null) => {
  let paramStr = '';
  if (params) {
    paramStr = buildQueryString(params);
  }
  return axios.get(`${url.deviceList}${paramStr}`)
}
// export interface IMaintainRecord
export const addDevice = (data: IDevice) => {
  return axios.post(`${url.deviceAdd}`, data)
}

export const updateDeviceById = (id: number, data: IDevice) => {
  return axios.put(`${url.deviceEdit}${id}`,data)
}

export const getDeviceDetail =  (id: number) => {
  return axios.get(`${url.deviceDetail}${id}`)
}
// 获取保养记录
export const getMaintainRecord = (id: number) => {
  return axios.get(`${url.maintainRecord}?id=${id}`)
}
// 获取维修记录
export const getRepairRecord = (id: number) => {
  return axios.get(`${url.repairRecord}${id}`)
}

// 获取保养记录详情
export const getMaintainRecordDetail = (id: number) => {
  return axios.get(`${url.maintainRecordDetail}${id}`)
}
// 获取维修记录详情
export const getRepairRecordDetail = (id: number) => {
  return axios.get(`${url.repairRecordDetail}${id}`)
}