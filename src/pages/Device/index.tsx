import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { getChooseTableParams, useRouter, useTable } from 'ym-web-view';
import { columns, customCSVExportDataForamt, printPageStyle } from './common';
import { addKeyForData, deleteEmptyKey, getActionCol, saveBlobToFile } from '@/utils/utils';
import { IAction } from '@/utils/type';
import { Button, Modal, Space, Table } from 'antd';
import ListLayout from '@/components/ListLayout';
import { PlusOutlined } from '@ant-design/icons';
import * as url from '@model/url';
import QRCode from './QRCode';
import { IDevice, getDeviceList } from '@/model/device';
import domtoimage from 'dom-to-image';
import CSVExportBtn from '@/components/CSVExportBtn';
import DeviceSearchBar from './DeviceSearchBar';
import ReactToPrint from 'react-to-print';

interface IProps {

}
export const Device: React.FC<IProps> = props => {
    // const myResult =

    const { history } = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectDevice, setSelectDevice] = useState<IDevice>();
    const qrCodeRef = useRef(null);
    const [tSearchResult, setTSearchResult] = useState<any>({});
    const paramsTable = useTable(url.deviceList, tSearchResult, 8, true, false, 'get');
    const handleView = useCallback((record: any) => {
        history.push('/device/detail/' + record.id);
    }, [history])

    const handleEdit = useCallback((record: any) => {
        history.push('/device/edit/' + record.id);
    }, [history])

    const handlePrintCode = useCallback((record: any) => {
        // console.log('选中的记录====', record);
        setSelectDevice(record);
        setIsModalOpen(true)
    }, [])

    const handleDownloadCode = useCallback(() => {
        const scale = 1; // 提高分辨率，scale越高越清晰
        const a3RatioSize = {
            height: 356,
            width: 475,
        }
        domtoimage.toBlob(qrCodeRef.current, {
            bgcolor: '#fff',
            width: a3RatioSize.width * scale,
            height: a3RatioSize.height * scale,
            style: {
                margin: 0,
                zoom: scale,
            },
        })
            .then(function (blob) {
                saveBlobToFile(blob, '下载二维码');
                setIsModalOpen(false)
            })
            .catch(function (e) {
                console.log(e);
            });
    }, [])

    // 整体操作
    const handleExport = useCallback(() => {

    }, [])

    const handleAdd = useCallback(() => {
        history.push('/device/add');
    }, [history])

    const tableColumns = useMemo(() => {
        const actions: IAction[] = [
            { text: '查看', handler: handleView },
            { text: '编辑', handler: handleEdit },
            { text: '打印二维码', handler: handlePrintCode },
        ]
        return [...columns, getActionCol(actions)]
    }, [handleEdit, handlePrintCode, handleView])

    useEffect(() => {

        const tableParams = getChooseTableParams(url.deviceList);
        // console.info('tableParams====', tableParams);
        setTSearchResult(tableParams.searchCondition || {});
    }, [])
    
    return useMemo(() => {
        // console.log('数据：', paramsTable.dataSource);
        // console.log('容器：', qrCodeRef);
        
        return (
            <HeaderLayout
                children={
                    <>
                        <ListLayout
                            title='设备管理'
                            className='page-device'
                            searchBar={
                                <DeviceSearchBar
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
                                            return getDeviceList(tSearchResult)
                                        }}
                                        exportFileName='设备管理'
                                        customCSVExportDataForamt={customCSVExportDataForamt}
                                    />
                                    <Button icon={<PlusOutlined />} type='primary' onClick={handleAdd}>新增设备</Button>
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
                            title="设备二维码"
                            open={isModalOpen}
                            centered
                            onCancel={() => { setIsModalOpen(false) }}
                            footer={[
                                <Space>
                                    <Button
                                        key="submit"
                                        // type="primary"
                                        onClick={() => {
                                            handleDownloadCode()
                                        }}
                                    >
                                        下载
                                    </Button>
                                    <ReactToPrint
                                        key={'print'}
                                        trigger={() => <Button type="primary">打印</Button>}
                                        content={() => qrCodeRef.current}
                                        bodyClass='print-body'
                                        pageStyle={printPageStyle}
                                        copyStyles={false}
                                    />
                                </Space>
                            ]}
                        >
                            <div ref={qrCodeRef}>
                                <QRCode codeInfo={selectDevice} />
                            </div>
                        </Modal>
                    </>

                }
            />
        )
    }, [handleAdd, handleDownloadCode, isModalOpen, paramsTable, selectDevice, tSearchResult, tableColumns])
}

export default Device;
