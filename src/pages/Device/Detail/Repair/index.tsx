import React, { useCallback, useMemo, useState } from 'react';
import './index.less';
import { Modal, Table } from 'antd';
import { columns } from './common';
import { IAction } from '@/utils/type';
import { getActionCol } from '@/utils/utils';
import { getRepairRecordDetail } from '@/model/device';
import DetailPop from '../DetailPop';
import { MODAL_WIDTH_SMALL } from '@/utils/constant';
interface IProps {
    repairData: any;
}
export const DeviceDetailRepair: React.FC<IProps> = props => {
    const { repairData = [] } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectRecord, setSelectRecord] = useState<any>();
    
    const handleView = useCallback(async (record: any) => {
        const res = await getRepairRecordDetail(record.id);
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

    return useMemo(() => {
        return (
            <div className="card mb15">
                <div className="title">维修记录</div>
                <Table
                    columns={tableColumns as any}
                    dataSource={repairData}
                    pagination={{
                        pageSize: 5,
                    }}
                />
                <Modal
                    className=''
                    title="维修记录"
                    open={isModalOpen}
                    width={MODAL_WIDTH_SMALL}
                    onCancel={() => { setIsModalOpen(false) }}
                    footer={null}
                    centered
                >
                    <DetailPop
                        type={'repair'}
                        info={selectRecord}
                    />
                </Modal>
            </div>
        );
    }, [isModalOpen, repairData, selectRecord, tableColumns]);

};

export default DeviceDetailRepair;