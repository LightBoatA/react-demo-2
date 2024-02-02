import React, { useCallback, useMemo, useState } from 'react';
// import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { IOptions, SearchBar, useTable } from 'ym-web-view';
import { columns, searchOptions } from './common';
import { addKeyForData, deleteEmptyKey, getActionCol } from '@/utils/utils';
import { IAction } from '@/utils/type';
import { Button, Modal, Space, Table, message } from 'antd';
import ListLayout from '@/components/ListLayout';
import { PlusOutlined } from '@ant-design/icons';
import * as url from '@model/url';
import { useForm } from 'antd/lib/form/Form';
import { addDeviceType, updateDeviceTypeById } from '@/model/deviceType';
import DeviceTypeAdd from './Add';

interface IProps {

}
export const DeviceType: React.FC<IProps> = props => {
    const [tSearchResult, setTSearchResult] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectRecord, setSelectRecord] = useState<any>();
    const [form] = useForm();

    const paramsTable = useTable(url.deviceTypeList, tSearchResult, 8, true, true);

    const handleOpenAddModal = useCallback(() => {
        form.resetFields();
        setSelectRecord(undefined);
        setIsModalOpen(true);
    }, [form])
    const handleOpenEditModal = useCallback((record: any) => {
        form.resetFields();
        setSelectRecord(record);
        setIsModalOpen(true);
    }, [form])

    const handleEdit = useCallback(async (record: any) => {
        try {
            const formData = await form.validateFields();
            await updateDeviceTypeById(selectRecord?.id , { name: formData.name });
            message.success('修改成功！');
            setIsModalOpen(false);
            paramsTable.getDataSource();
        } catch (error) {
            console.log(error);
        }
    }, [form, paramsTable, selectRecord?.id])

    const handleAdd = useCallback(async () => {
        try {
            const formData = await form.validateFields();
            await addDeviceType(formData);
            message.success('提交成功！');
            setIsModalOpen(false);
            paramsTable.getDataSource();
        } catch (error) {
            console.log(error);
        }
    }, [form, paramsTable])
    const tableColumns = useMemo(() => {
        const actions: IAction[] = [
            { text: '编辑', handler: handleOpenEditModal },
        ]
        return [...columns, getActionCol(actions, 80)]
    }, [handleOpenEditModal])

    return useMemo(() => {
        return (
            <HeaderLayout
                children={
                    <>
                        <ListLayout
                            title='设备类型管理'
                            className='page-device-type'
                            searchBar={
                                <SearchBar
                                    options={searchOptions as IOptions[]}
                                    result={tSearchResult}
                                    onWatch={(_result: any) => {
                                        setTSearchResult(deleteEmptyKey(_result));
                                    }}
                                    direction="left">
                                </SearchBar>
                            }
                            btns={
                                <Space>
                                    <Button icon={<PlusOutlined />} type='primary' onClick={handleOpenAddModal}>新增设备类型</Button>
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
                        <Modal
                            title={selectRecord ? '编辑设备类型' : '新建设备类型'}
                            open={isModalOpen}
                            onCancel={() => { setIsModalOpen(false) }}
                            footer={[
                                <Button onClick={() => { setIsModalOpen(false) }}>取消</Button>,
                                <Button
                                    type="primary"
                                    onClick={selectRecord ? handleEdit : handleAdd}
                                >
                                    提交
                                </Button>,
                            ]}
                        >
                            <DeviceTypeAdd form={form} initData={selectRecord} />
                        </Modal>
                    </>

                }
            />
        )
    }, [form, handleAdd, handleEdit, handleOpenAddModal, isModalOpen, paramsTable, selectRecord, tSearchResult, tableColumns])

}

export default DeviceType;
