import React, { useCallback, useMemo, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Button, Modal, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { columns } from './common';
import { IAction } from '@/utils/type';
import { getActionCol } from '@/utils/utils';
import { getMaintainRecordDetail } from '@/model/device';
import DetailPop from '../DetailPop';
import { MODAL_WIDTH_SMALL } from '@/utils/constant';
interface IProps {
    maintainData: any,
}
export const DeviceDetailUpkeep: React.FC<IProps> = props => {
    
    const { maintainData = [] } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectRecord, setSelectRecord] = useState<any>();


    const handleView = useCallback(async (record: any) => {
        const res = await getMaintainRecordDetail(record.id);
        if (res) {
            setSelectRecord(res);
            setIsModalOpen(true);
        }
    }, [])
    const tableColumns = useMemo(() => {
        const actions: IAction[] = [
            { text: '查看', handler: handleView },
        ]
        return [...columns, getActionCol(actions)]
    }, [handleView])

    // console.log('保养信息：', maintainData);
    
    return useMemo(() => {
        return (
            <div className="card mb15">
                <div className="title">保养记录</div>
                <Table
                    columns={tableColumns as any}
                    dataSource={maintainData}
                    pagination={{
                        pageSize: 5,
                    }}
                />
                <Modal
                    className=''
                    title="保养记录"
                    open={isModalOpen}
                    width={MODAL_WIDTH_SMALL}
                    onCancel={() => { setIsModalOpen(false) }}
                    footer={null}
                    centered
                >
                    <DetailPop
                        type={'maintenance'}
                        info={selectRecord}
                    />
                </Modal>
            </div>
        );
    }, [isModalOpen, maintainData, selectRecord, tableColumns]);

};

export default DeviceDetailUpkeep;