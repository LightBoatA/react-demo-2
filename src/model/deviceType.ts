import axios from "./axios"
import * as url from "./url"


export interface IDeviceType {
    id?: number;
    name: string;
    label?: string;
    type?: 'DEVICE';
}

// 获取所有设备类型
export const getDeviceTypeAll = () => {
    return axios.get(`${url.deviceTypeAll}`);
}
export const getDeviceTypeList = () => {
    return axios.get(`${url.deviceTypeList}`)
}

export const addDeviceType = (data: IDeviceType) => {
    return axios.post(`${url.deviceTypeAdd}`, data)
}

export const updateDeviceTypeById = (id: number, data: IDeviceType) => {
    return axios.put(`${url.deviceTypeEdit}${id}`, data)
}

export const getDeviceTypeReportByRoomId = (id: number) => {
    return axios.get(`${url.deviceTypeReport}${id}/devicetype`);
}
