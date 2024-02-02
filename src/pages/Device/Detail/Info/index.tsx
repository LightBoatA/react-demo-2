import React, { useCallback, useMemo, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Button, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { columns, tableTestData } from './common';
import { IAction } from '@/utils/type';
import {  formatNumber, getActionCol, getImageSrcPrefix } from '@/utils/utils';
import { IDeviceFile } from '../../Add/DeviceInfo';
interface IProps {
    infoData: IDeviceFile[];
}
export const DeviceDetailInfo: React.FC<IProps> = props => {
    const { infoData } = props;

    return useMemo(() => {
        const deviceInfoCols = [
            {
                title: '文件名',
                dataIndex: 'fileName',
                key: 'fileName',
                width: 160,
                ellipsis: true,
                render: (text, record) => {
                    return (
                        <a style={{ textDecoration: 'underline' }} href={`${getImageSrcPrefix()}${record.location}`} download={text}>{text}</a>
                    )
                }
            },
            {
                title: '文件大小',
                dataIndex: 'size',
                key: 'size',
                width: 140,
                ellipsis: true,
                render: (text) => {
                    return (
                        <>{`${formatNumber(Math.ceil(text / 1024))} KB`}</>
                    )
                }
            },
        ]
        return (
            <div className="card mb15">
                <div className="title">设备资料</div>
                <Table
                    columns={deviceInfoCols as any}
                    dataSource={infoData}
                    pagination={{
                        pageSize: 5,
                    }}
                />
            </div>
        );
    }, [infoData]);

};

export default DeviceDetailInfo;