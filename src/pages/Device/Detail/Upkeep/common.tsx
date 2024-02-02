import { dateFormat } from "@/utils/utils";
import { ColumnsType } from "antd/es/table";
import React from 'react';
// 表头
export const columns = [
    // {
    //     title: '序号',
    //     dataIndex: 'a',
    //     key: 'a',
    //     width: 80,
    //     ellipsis: true,
    // },
    {
        title: '保养日期',
        dataIndex: 'maintenanceDateTime',
        key: 'maintenanceDateTime',
        width: 160,
        ellipsis: true,
        render: (text) => {
            return (
                <span>{dateFormat(text, 'yyyy-MM-dd')}</span>
            )
        }
    },
    {
        title: '保养人',
        dataIndex: 'maintenanceRealName',
        key: 'maintenanceRealName',
        width: 140,
        ellipsis: true,
    },
    {
        title: '保养内容',
        dataIndex: 'content',
        key: 'content',
        width: 140,
        ellipsis: true,
    },
]
