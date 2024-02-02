import { searchOptionWidth } from "@/utils/constant";
import { propertyTypeEnum } from "ym-web-view";
import { EExamineStatus } from "../common";

export const examineStatusOptions = [
    { text: '已通过', value: EExamineStatus.approved },
    { text: '已驳回', value: EExamineStatus.rejected },
    { text: '待审核', value: EExamineStatus.pending },
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