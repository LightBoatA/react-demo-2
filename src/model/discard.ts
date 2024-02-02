import { ISpecParam } from "@/pages/Device/Add/SpecInfo";
import axios from "./axios"
import * as url from "./url"
import { IDeviceFile } from "@/pages/Device/Add/DeviceInfo";
import { buildQueryString } from "@/utils/utils";

export interface IDiscard {
  reason: string;
  attachments: IDeviceFile[];
}

// 报废列表
export const getDiscardList = (params = null) => {
  let paramStr = '';
  if (params) {
    paramStr = buildQueryString(params);
  }
  return axios.get(`${url.discardList}${paramStr}`)
}
// 审核 TODO: 类型
export const discardExamine = (id: number, status: any, remark: string) => {
  return axios.put(`${url.discardExamine}${id}/${status}?remark=${remark}`);
}

// 添加报废信息
export const addDiscard = (data: IDiscard) => {
  return axios.post(`${url.discardAdd}`, data);
}