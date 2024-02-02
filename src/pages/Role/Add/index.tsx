import React, { useEffect, useMemo } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Col, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import { TreeSelect } from 'antd';
import {  permissions } from './common';
import { IRole } from '@/model/role';
const treeData = [
    {
        title: '顶级',
        value: 'all',
        key: 'all',
        children: [
            {
                title: '工作台',
                value: 'dashboard',
                key: 'dashboard',
            },
            {
                title: '设备管理',
                value: 'device',
                key: 'device',
            },
            {
                title: '报废管理',
                value: 'discard',
                key: 'discard',
            },
            {
                title: '系统管理',
                value: 'system',
                key: 'system',
                children: [
                    {
                        title: '用户管理',
                        value: 'user',
                        key: 'user',
                    },
                    {
                        title: '角色管理',
                        value: 'role',
                        key: 'role',
                    },
                    {
                        title: '建筑管理',
                        value: 'build',
                        key: 'build',
                    },
                    {
                        title: '设备类型管理',
                        value: 'deviceType',
                        key: 'deviceType',
                    },
                ],
            },
            {
                title: '小程序',
                value: 'miniProgram',
                key: 'miniProgram',
            },
        ],
    },
];

interface IProps {
    form: any,
    initData?: IRole,
}
export const RoleAdd: React.FC<IProps> = props => {
    const { form, initData } = props;
    const { SHOW_PARENT } = TreeSelect;


    return useMemo(() => {
        const tProps = {
            treeData,
            // value,
            // onChange,
            treeCheckable: true,
            treeDefaultExpandAll: true,
            showCheckedStrategy: SHOW_PARENT,
            placeholder: '请选择权限',
            style: {
                width: '100%',
            },
            listHeight: 400,
        };
        // 编辑页初始化
        if (initData) {
            form.setFieldsValue({ ...initData })
        }

        return (
            <Form
                form={form}
                labelCol={{ span: 4 } }
            >
                <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '请输入角色名称' }]}>
                    <Input placeholder="请输入角色名称"  />
                </Form.Item>
                <Form.Item label="角色标识" name="label" rules={[{ required: true, message: '请输入角色标识' }]}>
                    <Input disabled={ initData ? true : false } placeholder="请输入角色标识" maxLength={12} />
                </Form.Item>
                <Form.Item label="描述" name="description" >
                    <TextArea rows={7} placeholder="请输入角色描述" />
                </Form.Item>
                <Form.Item label="权限功能" name="permissions" rules={[{ required: true, message: '请选择权限' }]}>
                    <TreeSelect  {...tProps} />
                </Form.Item>
            </Form>
        );
    }, [SHOW_PARENT, form, initData]);

};

export default RoleAdd;