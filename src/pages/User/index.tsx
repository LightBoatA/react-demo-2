import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { SearchBar, propertyTypeEnum } from 'ym-web-view';
import { columns } from './common';
import { Button, Modal, Space, Table, message } from 'antd';
import ListLayout from '@/components/ListLayout';
import * as url from '@model/url';
import { searchOptionWidth } from '@/utils/constant';
import { useAsyncFn } from 'react-use';
import axios from '@/model/axios';
import { useForm } from 'antd/lib/form/Form';
import { bindingRoleById } from '@/model/user';
import { addKeyForData, deleteEmptyKey } from '@/utils/utils';
import UserAdd from './Add';
interface IProps {

}
export const User: React.FC<IProps> = props => {
    const [form] = useForm();
    const [tSearchResult, setTSearchResult] = useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectRecord, setSelectRecord] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    const [roleData, getRoleData] = useAsyncFn(() => {
        return axios.get(`${url.roleList}`).then((res: any) => {
            return res.records;
        }).catch((error: any) => {
            return Promise.resolve([]);
        })
    }, []);

    const [dataSource, getDataSource] = useAsyncFn(() => {
        return axios.get(`${url.userList}`).then((res: any) => {
            setLoading(false)
            return res;
        }).catch((error: any) => {
            return Promise.resolve([]);
        })
    }, []);

    useEffect(() => {
        getDataSource();
        getRoleData();
    }, [getDataSource, getRoleData]);

    const roleOptions = useMemo(() => {
        return roleData.value
            ? roleData.value.map(item => {
                return { key: item.name, text: item.name, value: `${item.id}` }
            })
            : [];
    }, [roleData.value])

    const searchOptions = useMemo(() => {
        return [
            {
                type: propertyTypeEnum.search,
                name: 'mobilePhone',
                placeholder: '请输入手机号',
                width: searchOptionWidth,
                aliasText: 'text',
            },
            // {
            //     type: propertyTypeEnum.search,
            //     name: 'realName',
            //     placeholder: '请输入用户姓名',
            //     width: searchOptionWidth,
            //     aliasText: 'text',
            // },
            // {
            //     type: propertyTypeEnum.select,
            //     placeholder: '请选择用户单位',
            //     name: 'company',
            //     aliasText: 'text',
            //     availableOptions: companyOptions,
            //     width: searchOptionWidth,
            // },
            // {
            //     type: propertyTypeEnum.select,
            //     placeholder: '请选择用户角色',
            //     name: 'roleId',
            //     aliasText: 'text',
            //     availableOptions: roleOptions,
            //     width: searchOptionWidth,
            // },
            // {
            //     type: propertyTypeEnum.select,
            //     placeholder: '请选择启用状态',
            //     name: 'status',
            //     aliasText: 'text',
            //     availableOptions: accountStatusOptions,
            //     width: searchOptionWidth,
            // },
        ]
    }, [])
    // const paramsTable = useTable(url.userList, tSearchResult, 8, true, false, 'get');

    // const handleOpenAddModal = useCallback(() => {
    //     form.resetFields();
    //     setSelectRecord(undefined);
    //     setIsModalOpen(true);
    // }, [form])
    const handleOpenEditModal = useCallback((record: any) => {
        form.resetFields();
        setSelectRecord(record);
        setIsModalOpen(true);
    }, [form])

    // const handleResetPassword = useCallback((record: any) => {
    //     ShowModalConfirm({
    //         msg: `是否确认重置用户${record.accountName}的密码？`,
    //         okText: '确认',
    //         onOKCallBack: async () => {
    //             try {
    //                 await resetPassword(record.id);
    //                 paramsTable.getDataSource();
    //                 message.success('重置成功！');
    //             } catch (error) {
    //                 console.log(error)
    //             }
    //         }
    //     });
    // }, [paramsTable])

    // const handleChangeAccountStatus = useCallback((record: any) => {
    //     const statusText =  record.status === EAccountStatus.active ? '停用' : '启用' ;
    //     const toStatus = record.status === EAccountStatus.active ? EAccountStatus.inactive : EAccountStatus.active;

    //     ShowModalConfirm({
    //         msg: `是否确认${statusText}账户${record.accountName}？`,
    //         okText: '确认',
    //         onOKCallBack: async () => {
    //             try {
    //                 await updateUserStatusById(record.id, toStatus);
    //                 paramsTable.getDataSource();
    //                 message.success(`${statusText}成功！`);
    //                 paramsTable.getDataSource();
    //             } catch (error) {
    //                 console.log(error)
    //             }
    //         }
    //     });
    // }, [paramsTable])

    const handleEdit = useCallback(async (record: any) => {
        try {
            const formData = await form.validateFields();
            const roleId = formData.role;
            await bindingRoleById(selectRecord?.id, roleId);
            message.success('角色分配成功！');
            setLoading(false);
            setIsModalOpen(false);
            getDataSource();
        } catch (error) {
            console.log(error);
        }
    }, [form, getDataSource, selectRecord?.id])

    // const handleAdd = useCallback(async () => {
    //     try {
    //         const formData = await form.validateFields();
    //         const obj = { ...formData, role: { id: formData.role } }
    //         await addUser(obj);
    //         message.success('提交成功！');
    //         setIsModalOpen(false);
    //         paramsTable.getDataSource();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }, [form, paramsTable])

    // 获取table的搜索条件
    // useEffect(() => {
    //   const tableParams = getChooseTableParams(url.userList);
    //   setTSearchResult(tableParams.searchCondition || {});
    // }, [])

    const tableColumns = useMemo(() => {
        return [
            ...columns,
            {
                title: '操作',
                dataIndex: 'actions',
                key: 'actions',
                width: 180,
                render: (_, record) => {
                    return (
                        <Space>
                            <Button
                                type="link"
                                onClick={() => { handleOpenEditModal(record) }}
                                style={{ paddingLeft: 5, paddingRight: 5 }}
                            >分配角色</Button>
                            {/* <Button
                                type="link"
                                onClick={() => { handleResetPassword(record) }}
                                style={{ paddingLeft: 5, paddingRight: 5 }}
                            >重置密码</Button>
                            <Button
                                type="link"
                                onClick={() => { handleChangeAccountStatus(record) }}
                                style={{ paddingLeft: 5, paddingRight: 5 }}
                            >{ record.status === EAccountStatus.active ? '停用' : '启用'}</Button> */}
                        </Space>
                    )
                }
            }
        ]
    }, [handleOpenEditModal])

    return useMemo(() => {
        // 数据结构处理
        const formattedData = dataSource.value
            ? dataSource.value.map(item => {
                return { ...item.staff, role: item.role }
            })
            : [];

        // 搜索过滤
        let filteredData;
        if (Object.keys(tSearchResult).length === 0) {
            filteredData = formattedData;
        } else {
            filteredData = formattedData.filter(item => {
                // 此次只需要过滤手机号
                return item.mobilePhone.number.includes(tSearchResult.mobilePhone)
            })
        }

        const totalCount = filteredData.length;

        return (
            <>
                <HeaderLayout
                    children={
                        <ListLayout
                            title='用户管理'
                            className='page-user'
                            searchBar={
                                <SearchBar
                                    options={searchOptions as any}
                                    result={tSearchResult}
                                    onWatch={(_result: any) => {
                                        setTSearchResult(deleteEmptyKey(_result));
                                    }}
                                    direction="left">
                                </SearchBar>
                            }
                            // btns={
                            //     <Space>
                            //         <Button icon={<PlusOutlined />} type='primary' onClick={handleOpenAddModal}>新增用户</Button>
                            //     </Space>
                            // }
                            list={
                                <Table
                                    // {...paramsTable}
                                    pagination={{
                                        pageSize: 8,
                                        total: totalCount,
                                    }}
                                    loading={loading}
                                    columns={tableColumns}
                                    dataSource={addKeyForData(filteredData)}
                                />
                            }
                        />
                    }
                />
                {/* 新建角色弹窗 */}
                <Modal
                    title={'编辑用户'}
                    open={isModalOpen}
                    onCancel={() => { setIsModalOpen(false) }}
                    footer={[
                        <Button onClick={() => { setIsModalOpen(false) }}>取消</Button>,
                        <Button
                            type="primary"
                            onClick={handleEdit}
                            loading={loading}
                        >
                            提交
                        </Button>
                    ]}
                >
                    <UserAdd form={form} roleOptions={roleOptions} initData={selectRecord} />
                </Modal>
            </>

        )
    }, [dataSource.value, form, handleEdit, isModalOpen, loading, roleOptions, searchOptions, selectRecord, tSearchResult, tableColumns])

}

export default User;
