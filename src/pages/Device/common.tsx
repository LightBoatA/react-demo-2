import { propertyTypeEnum } from "ym-web-view"
import React from "react";
import { dateFormat, emptyFormat } from "@/utils/utils";
import { EDeviceStatus } from "./DeviceSearchBar/common";

export enum ETaskStatus {
    'nomal' = 'nomal',
    'discard' = 'discard', // 后者替换成后端字符串
}

export const printPageStyle = `

    @media print {
          @page {
        size: 80mm 60mm;
    }

        .print-body {
            // border: 1px dashed green;
            zoom: 60%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .comp-device-QR-code {
            magin: 0;
            height: 356px;
            width: 475px;
            // border: 3px solid #ff0000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        img {
            width: 200px;
            height: 200px;
            display: block;
            margin-right: 20px;
        }
        .text-wrap {
            height: 202px;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 1px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-family: Source Han Sans CN;
        }
        .code-desc {
            overflow: hidden;
        }
        .code-label {
            margin-bottom: 3px;
        }
        .code-text {
            line-height: 18px;
        }
    }
`;
// 设备管理、报废管理通用表格列
export const commonDeviceColumns = [
    {
        title: '设备编号',
        dataIndex: 'number',
        key: 'number',
        width: 180,
        ellipsis: true,
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        width: 160,
        ellipsis: true,
    },
    {
        title: '设备类型',
        dataIndex: 'dictionary',
        key: 'dictionary',
        width: 140,
        ellipsis: true,
        render: (text) => {
            return (
                <span>{text?.name}</span>
            )
        }
    },
    {
        title: '所属隧道',
        dataIndex: 'tunnel',
        key: 'tunnel',
        width: 160,
        ellipsis: true,
        render: (text) => {
            return (
                <span>{text?.name}</span>
            )
        }
    },
    {
        title: '所属房间',
        dataIndex: 'room',
        key: 'room',
        width: 160,
        ellipsis: true,
        render: (text) => {
            return (
                <span>{text?.name}</span>
            )
        }
    },
]
// 表头
export const columns = [
    ...commonDeviceColumns,
    {
        title: '创建时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        width: 160,
        ellipsis: true,
        render: (text) => {
            return (
                <span>{dateFormat(text)}</span>
            )
        }
    },
    {
        title: '更新时间',
        dataIndex: 'lastModifiedDate',
        key: 'lastModifiedDate',
        width: 160,
        ellipsis: true,
        render: (text) => {
            return (
                <span>{dateFormat(text)}</span>
            )
        }
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        ellipsis: true,
        render: (text) => {
            return (
                <div className='td-status'>
                    <div className={`td-status-dot ${text === EDeviceStatus.normal ? 'bg-green' : 'bg-red'}`} ></div>
                    <span>{text === EDeviceStatus.normal ? '正常' : '报废'}</span>
                </div>
            )
        }
    },

]

export const customCSVExportDataForamt = () => {
    return [
        { title: "设备编号", key: "number" },
        { title: "设备名称", key: "name" },
        {
            title: "设备类型", key: "dictionary", render: (record) => {
                return emptyFormat(record.dictionary?.name)
            }
        },
        {
            title: "所属隧道", key: "tunnel", render: (record) => {
                return emptyFormat(record.tunnel?.name)
            }
        },
        {
            title: "所属房间", key: "room", render: (record) => {
                return emptyFormat(record.room?.name)
            }
        },
        {
            title: "创建时间", key: "createdDate", render: (record) => {
                return dateFormat(record.createdDate)
            }
        },
        {
            title: "更新时间", key: "lastModifiedDate", render: (record) => {
                return dateFormat(record.lastModifiedDate)
            }
        },
        {
            title: "状态", key: "status", render: (record) => {
                return record.status === EDeviceStatus.normal ? '正常' : '报废'
            }
        },

    ]
}