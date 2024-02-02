import React, { useCallback, useMemo, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { useTable } from 'ym-web-view';
import { columns } from './common';
import { addKeyForData, getActionCol } from '@/utils/utils';
import { IAction } from '@/utils/type';
import { Button, Modal, Space, Table, message } from 'antd';
import ListLayout from '@/components/ListLayout';
import { PlusOutlined } from '@ant-design/icons';
import RoleAdd from './Add';
import { addRole, deleteRoleById, updateRoleById } from '@/model/role';
import { useForm } from 'antd/lib/form/Form';
import * as url from '@model/url';
import ShowModalConfirm from '@/components/ShowModalConfirm';
interface IProps {

}
export const Role: React.FC<IProps> = props => {
    const [tSearchResult, setTSearchResult] = useState();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectRecord, setSelectRecord] = useState<any>();

    const [form] = useForm();

    const paramsTable = useTable(url.roleList, tSearchResult, 8, true, true, 'get');

    const handleOpenEditModal = useCallback((record: any) => {
        form.resetFields();
        setSelectRecord(record);
        setIsEditModalOpen(true);
    }, [form])
    
    const handleEdit = useCallback(async () => {
        try {
            const formData = await form.validateFields();
            await updateRoleById(selectRecord?.id, formData);
            message.success('修改成功！');
            setIsEditModalOpen(false);
            paramsTable.getDataSource();
        } catch (error) {
            console.log(error);
        }
    }, [form, paramsTable, selectRecord?.id])
    const handleDelete = useCallback((record: any) => {
        ShowModalConfirm({
            msg: `是否确认删除用户${record.name}？`,
            okText: '确认',
            onOKCallBack: async () => {
                try {
                    const res = await deleteRoleById(record.id);
                    paramsTable.getDataSource();
                    message.success('删除成功！');
                } catch (error) {
                    console.log(error)
                }
            }
        });
    }, [paramsTable])

    const handleAdd = useCallback(async () => {
        try {
            const formData = await form.validateFields();
            await addRole(formData);
            message.success('提交成功！');
            setIsAddModalOpen(false);
            paramsTable.getDataSource();
        } catch (error) {
            console.log(error);
        }
    }, [form, paramsTable])

    const tableColumns = useMemo(() => {
        const actions: IAction[] = [
            { text: '编辑', handler: handleOpenEditModal },
            { text: '删除', handler: handleDelete, danger: true },
        ]
        return [...columns, getActionCol(actions, 100)]
    }, [handleDelete, handleOpenEditModal])

    return useMemo(() => {
        return (
            <>
                <HeaderLayout
                    children={
                        <ListLayout
                            title='角色管理'
                            className='page-role'
                            // searchBar={
                            //     <SearchBar
                            //         options={searchOptions as IOptions[]}
                            //         result={tSearchResult}
                            //         onWatch={(_result: any) => {
                            //             console.log('搜索内容：', _result);
                            //             setTSearchResult(_result);
                            //         }}
                            //         direction="left">
                            //     </SearchBar>
                            // }
                            btns={
                                <Space>
                                    <Button icon={<PlusOutlined />} type='primary' onClick={() => { 
                                        form.resetFields();
                                        setIsAddModalOpen(true);
                                    }}>新增角色</Button>
                                </Space>
                            }
                            list={
                                <Table
                                    {...paramsTable}
                                    columns={tableColumns}
                                    dataSource={addKeyForData(paramsTable.dataSource)}
                                />
                            }
                        />
                    }
                />
                {/* 新增角色 */}
                <Modal
                    className='add-role-modal'
                    title="新增角色"
                    open={isAddModalOpen}
                    width={556}
                    onCancel={() => { setIsAddModalOpen(false) }}
                    footer={[
                        <Button onClick={() => { setIsAddModalOpen(false) }}>取消</Button>,
                        <Button
                            type="primary"
                            onClick={handleAdd}
                        >
                            提交
                        </Button>,
                    ]}
                >
                    <RoleAdd form={form}/>
                </Modal>
                {/* 编辑角色 */}
                <Modal
                    className='add-role-modal'
                    title="编辑角色"
                    open={isEditModalOpen}
                    width={556}
                    onCancel={() => { setIsEditModalOpen(false) }}
                    footer={[
                        <Button onClick={() => { setIsEditModalOpen(false) }}>取消</Button>,
                        <Button
                            type="primary"
                            onClick={handleEdit}
                        >
                            提交
                        </Button>,
                    ]}
                >
                    <RoleAdd initData={selectRecord} form={form} />
                </Modal>
            </>
        )
    }, [form, handleAdd, handleEdit, isAddModalOpen, isEditModalOpen, paramsTable, selectRecord, tableColumns])

}

export default Role;
