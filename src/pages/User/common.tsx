import { propertyTypeEnum } from "ym-web-view"
import React from "react";
import { searchOptionWidth } from "@/utils/constant";
import { EAccountStatus } from "@/model/user";
import { dateFormat } from "@/utils/utils";

export const companyOptions = [
    { text: '养护中心', value: '养护中心' },
    { text: '养护单位', value: '养护单位' },
]

// export const accountStatusOptions = [
//     { text: '启用', value: EAccountStatus.active },
//     { text: '停用', value: EAccountStatus.inactive },
// ]

export const accountStatusValueText = {
    [EAccountStatus.inactive]: '未注册',
    [EAccountStatus.normal]: '已注册',
    [EAccountStatus.frozen]: '已冻结',
    [EAccountStatus.deleted]: '已删除',
}



// 表头
export const columns = [
    {
        title: '手机号',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
        width: 100,
        ellipsis: true,
        render: (text, record) => {
            return (<>{text.number}</>)
        }
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        ellipsis: true,
    },
    {
        title: '组织',
        dataIndex: 'orgName',
        key: 'orgName',
        width: 100,
        ellipsis: true,
    },
    {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
        width: 140,
        ellipsis: true,
        render: (text, record) => {
            return (<>{text?.name}</>)
        }
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        ellipsis: true,
        render: (text, record) => {
            return (<>{accountStatusValueText[text]}</>)
        }
    },

]
