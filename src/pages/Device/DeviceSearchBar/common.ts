import { searchOptionWidth } from "@/utils/constant";
import { propertyTypeEnum } from "ym-web-view";

export enum EDeviceStatus {
    'normal' = 'NORMAL',
    'scrap' = 'SCRAP',
}
export const deviceStatusOptions = [
    { text: '正常', value: EDeviceStatus.normal },
    { text: '报废', value: EDeviceStatus.scrap }, // TODO: 看有几种状态
]

// export const searchOptions = [
//     {
//         type: propertyTypeEnum.search,
//         name: 'number',
//         placeholder: '请输入设备编号',
//         width: searchOptionWidth,
//         aliasText: 'text',
//     },
//     {
//         type: propertyTypeEnum.search,
//         name: 'name',
//         placeholder: '请输入设备名称',
//         width: searchOptionWidth,
//         aliasText: 'text',
//     },
//     {
//         type: propertyTypeEnum.select,
//         placeholder: '请选择设备类型',
//         name: 'deviceTypeId',
//         aliasText: 'text',
//         availableOptions: taskStatusOptions,
//         width: searchOptionWidth,
//     },
//     {
//         type: propertyTypeEnum.select,
//         placeholder: '请选择所属隧道',
//         name: 'tunnelId',
//         aliasText: 'text',
//         availableOptions: taskStatusOptions,
//         width: searchOptionWidth,
//     },
//     {
//         type: propertyTypeEnum.select,
//         placeholder: '请选择所属房间',
//         name: 'roomId',
//         aliasText: 'text',
//         availableOptions: taskStatusOptions,
//         width: searchOptionWidth,
//     },
//     {
//         type: propertyTypeEnum.select,
//         placeholder: '请选择设备状态',
//         name: 'status',
//         aliasText: 'text',
//         availableOptions: taskStatusOptions,
//         width: searchOptionWidth,
//     },
// ]