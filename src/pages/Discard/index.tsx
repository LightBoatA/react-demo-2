import React, { useCallback, useMemo, useState } from 'react';
// import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { useTable } from 'ym-web-view';
import { EExamineStatus, columns, customCSVExportDataForamt } from './common';
import { deleteEmptyKey, getUUID } from '@/utils/utils';
import { Button, Modal, Space, Table, message } from 'antd';
import ListLayout from '@/components/ListLayout';
import { PlusOutlined } from '@ant-design/icons';
import * as url from '@model/url';
import DiscardPop from '../../components/DiscardPop';
import { useForm } from 'antd/es/form/Form';
import { addDiscard, discardExamine, getDiscardList } from '@/model/discard';
import { getDeviceList } from '@/model/device';
import CSVExportBtn from '@/components/CSVExportBtn';
import DiscardSearchBar from './DiscardSearchBar';
import { useRedux } from '@/hooks/useRedux';

interface IProps {

}
export const Discard: React.FC<IProps> = props => {
    const [tSearchResult, setTSearchResult] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false); // 报废登记弹窗
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // 报废查看弹窗
    const [isExamineModalOpen, setIsExamineModalOpen] = useState(false); // 报废审批弹窗
    const [selectRecord, setSelectRecord] = useState<any>();
    const paramsTable = useTable(url.discardList, tSearchResult, 9, true, true, 'get');
    const [form] = useForm();
    const { state } = useRedux();

    // 对记录数据的操作
    const handleOnenView = useCallback((record: any) => {
        form.resetFields();
        setSelectRecord(record);
        setIsViewModalOpen(true);
    }, [form])
    const handleOnenExamine = useCallback((record: any) => {
        form.resetFields();
        setSelectRecord(record);
        setIsExamineModalOpen(true);
    }, [form])
    const handleOnenRegister = useCallback(() => {
        form.resetFields();
        setIsModalOpen(true);
    }, [form])

    const searchDeviceId = useCallback(async (number: string) => {
        const res: any = await getDeviceList()
        if (res.records) {
            const device = res.records.find(item => item.number === number);
            return Promise.resolve(device && device.id);
        }
        return Promise.resolve(null);
    }, [])

    const handleRegister = useCallback(async () => {
        try {
            form.setFieldsValue({ status: EExamineStatus.pending, remark: '1' });
            const { number, reason, attachments } = await form.validateFields();

            // 根据设备编号查询设备ID
            const deviceId = await searchDeviceId(number)

            if (deviceId) {
                const obj = {
                    objectId: deviceId,
                    objectType: 'DEVICE_SCRAP',
                    reason,
                    attachments,
                }
                await addDiscard(obj);
                message.success('提交成功！');
                setIsModalOpen(false);
                paramsTable.getDataSource();
            } else {
                message.error('系统内无对应设备，请检查设备编号！');
            }
            
        } catch (error) {
            console.log(error);
        }

    }, [form, paramsTable, searchDeviceId])


    const handleExamine = useCallback(async () => {
        try {
            form.setFieldsValue({ number: '1', reason: '1', attachments: [{}] });
            const { status, remark } = await form.validateFields();
            await discardExamine(selectRecord?.id, status, remark);
            message.success('提交成功！');
            setIsExamineModalOpen(false);
            paramsTable.getDataSource();
        } catch (error) {
            console.log(error);
        }
    }, [form, paramsTable, selectRecord?.id])
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
                                onClick={() => { handleOnenView(record) }}
                                style={{ paddingLeft: 5, paddingRight: 5 }}
                            >查看</Button>
                            <Button
                                type="link"
                                disabled={record.status !== EExamineStatus.pending}
                                onClick={() => { handleOnenExamine(record) }}
                                style={{ paddingLeft: 5, paddingRight: 5 }}
                            >审批</Button>
                        </Space>

                    )
                }
            }
        ]
    }, [handleOnenExamine, handleOnenView])

    return useMemo(() => {
        const datasourceFormat = paramsTable.dataSource.map((item) => {
            const { id, device, createdRealName, createdDate, lastModifiedDate, status, reason, attachments, auditRemark } = item;
            const { number, name, dictionary, tunnel, room } = device;
            return {
                key: getUUID(),
                id, createdRealName, createdDate, lastModifiedDate, status, number, name, dictionary, tunnel, room, reason, attachments, auditRemark
            } // TODO-不紧急：修改写法
        });

        return (
            <HeaderLayout
                children={
                    <>
                        <ListLayout
                            title='报废管理'
                            className='page-discard'
                            searchBar={
                                <DiscardSearchBar
                                    result={tSearchResult}
                                    onWatch={(result: any) => {
                                        setTSearchResult(deleteEmptyKey(result));
                                    }}
                                />
                            }
                            btns={
                                <Space>
                                    <CSVExportBtn
                                        requestFunc={() => {
                                            return getDiscardList(tSearchResult)
                                        }}
                                        exportFileName='报废管理'
                                        customCSVExportDataForamt={customCSVExportDataForamt}
                                    />
                                    <Button icon={<PlusOutlined />} type='primary' onClick={() => { handleOnenRegister() }}>报废登记</Button>
                                </Space>
                            }
                            list={
                                <Table
                                    {...paramsTable}
                                    dataSource={datasourceFormat}
                                    columns={tableColumns}
                                />
                            }
                        />
                        {/* 报废登记弹窗 */}
                        <Modal
                            title="报废信息"
                            open={isModalOpen}
                            onCancel={() => { setIsModalOpen(false) }}
                            centered
                            width={620}
                            footer={[
                                <Button onClick={() => { setIsModalOpen(false) }}>取消</Button>,
                                <Button
                                    type="primary"
                                    onClick={handleRegister}
                                >
                                    提交
                                </Button>,
                            ]}
                        >
                            {/* <DiscardAdd/> */}
                            <DiscardPop
                                info={{
                                    createdDate: new Date(),
                                    createdRealName: state.userInfo.realName, // TODO-重要：填写此两项
                                }}
                                isRegister={true}
                                form={form}
                            />
                        </Modal>
                        {/* 查看报废信息弹窗 */}
                        <Modal
                            title="报废信息"
                            open={isViewModalOpen}
                            footer={[]}
                            centered
                            onCancel={() => { setIsViewModalOpen(false) }}
                        >
                            <DiscardPop info={selectRecord} isApprovedView={selectRecord?.status !== EExamineStatus.pending}/>
                        </Modal>
                        {/* 报废审批弹窗 */}
                        <Modal
                            title="报废信息"
                            open={isExamineModalOpen}
                            onCancel={() => { setIsExamineModalOpen(false) }}
                            centered
                            footer={[
                                <Button onClick={() => { setIsExamineModalOpen(false) }}>取消</Button>,
                                <Button
                                    type="primary"
                                    onClick={handleExamine}
                                >
                                    提交
                                </Button>,
                            ]}
                        >
                            <DiscardPop form={form} info={selectRecord} isExamine={true} />
                        </Modal>
                    </>

                }
            />
        )
    }, [form, handleExamine, handleOnenRegister, handleRegister, isExamineModalOpen, isModalOpen, isViewModalOpen, paramsTable, selectRecord, state.userInfo.realName, tSearchResult, tableColumns])

}

export default Discard;
