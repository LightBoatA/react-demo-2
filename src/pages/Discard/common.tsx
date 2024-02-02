import { dateFormat, emptyFormat } from "@/utils/utils";
import { commonDeviceColumns } from "../Device/common"
import React from "react";

export enum EExamineStatus {
    'pending' = 'PENDING', // TODO: 待删除
    'approved' = 'APPROVED',
    'rejected' = 'REJECTED',
}

export const examineStatusText = {
    [EExamineStatus.pending]: '待审核',
    [EExamineStatus.approved]: '已通过',
    [EExamineStatus.rejected]: '已驳回',
}

const examineStatusColor = {
    [EExamineStatus.pending]: 'bg-orange',
    [EExamineStatus.approved]: 'bg-blue',
    [EExamineStatus.rejected]: 'bg-red',
}
// 表头
export const columns = [
    ...commonDeviceColumns,
    {
        title: '申请人',
        dataIndex: 'createdRealName',
        key: 'createdRealName',
        width: 100,
        ellipsis: true,
    },
    {
        title: '申请时间',
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
        width: 100,
        ellipsis: true,
        render: (text, record) => {
            return (
                <div className='td-status'>
                    <div className={`td-status-dot ${examineStatusColor[text]}`} ></div>
                    <span>{examineStatusText[text]}</span>
                </div>
            )
        }
    },

]

export const customCSVExportDataForamt = () => {
    return [
        {
            title: "设备编号", key: "number", render: (record) => {
                return emptyFormat(record.device.number)
            } },
        {
            title: "设备名称", key: "name", render: (record) => {
                return emptyFormat(record.device.name)
            }
},
        {
            title: "设备类型", key: "dictionary", render: (record) => {
                return emptyFormat(record.device.dictionary?.name)
            }
        },
        {
            title: "所属隧道", key: "tunnel", render: (record) => {
                return emptyFormat(record.device.tunnel?.name)
            }
        },
        {
            title: "所属房间", key: "room", render: (record) => {
                return emptyFormat(record.device.room?.name)
            }
        },
        {
            title: "申请人", key: "createdRealName"
        },
        {
            title: "申请时间", key: "createdDate", render: (record) => {
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
                return examineStatusText[record.status]
            }
        },

    ]
}