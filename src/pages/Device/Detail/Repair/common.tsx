import { dateFormat } from '@/utils/utils';
import React from 'react';
// 表头：维修记录
export const columns = [
    // {
    //     title: '序号',
    //     dataIndex: 'a',
    //     key: 'a',
    //     width: 80,
    //     ellipsis: true,
    // },
    {
        title: '维修日期',
        dataIndex: 'repairDateTime',
        key: 'repairDateTime',
        width: 160,
        ellipsis: true,
        render: (text) => {
            return (
                <span>{dateFormat(text, 'yyyy-MM-dd')}</span>
            )
        }
    },
    {
        title: '维修人',
        dataIndex: 'repairRealName',
        key: 'repairRealName',
        width: 140,
        ellipsis: true,
    },
    {
        title: '维修内容',
        dataIndex: 'taskContent',
        key: 'taskContent',
        width: 140,
        ellipsis: true,
    },
]