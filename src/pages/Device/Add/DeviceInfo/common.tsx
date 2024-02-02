import { ColumnsType } from "antd/es/table";
import React from 'react';
// 设备资料接口
export interface IDeviceInfo {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

export const commonDeviceInfoCols = [
    {
        title: '文件名',
        dataIndex: 'fileName',
        key: 'fileName',
        width: 160,
        ellipsis: true,
    },
    {
        title: '文件大小（B）',
        dataIndex: 'size',
        key: 'size',
        width: 140,
        ellipsis: true,
    },
]
// // 表头
// export const columns: ColumnsType<IDeviceInfo> = [
//     ...commonDeviceInfoCols,
//     {
//         title: '状态',
//         dataIndex: 'd',
//         key: 'd',
//         width: 140,
//         ellipsis: true,
//         render: (text, record) => {
//             return (
//                 <div className='td-status'>
//                     {/* <div className={`td-status-dot ${text === ETaskStatus.nomal ? 'bg-green' : 'bg-red'}`} ></div> */}
//                     {/* <span>{text === ETaskStatus.nomal ? '正常' : '报废'}</span> */}
//                 </div>
//             )
//         }
//     },
// ]
