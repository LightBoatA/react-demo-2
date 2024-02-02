import React, { useMemo } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import DeviceDetailBasic from './Basic';
import DeviceDetailSpec from './SpecParam';
import DeviceDetailUpkeep from './Upkeep';
import DeviceDetailDiscard from './Discard';
import DeviceDetailInfo from './Info';
import DeviceDetailRepair from './Repair';
import { useRouter } from 'ym-web-view';
import { useDevice } from '@/hooks/useDevice';
interface IProps {

}
export const DeviceDetail: React.FC<IProps> = props => {
    // const {} = props;
    const { history, match } = useRouter();
    const { params } = match;
    // @ts-ignore
    const { id } = params;
    const { deviceData, maintainRecordData, repairRecordData, discardData } = useDevice(id);
    // console.log('设备数据：', deviceData);
    return useMemo(() => {
        return (
            <HeaderLayout
                breadData={[{ name: '设备管理', url: '/device' }, { name: '设备查看' }]}
                children={
                    <div className="page-device-detail">
                        <DeviceDetailBasic deviceData={deviceData}/>
                        <DeviceDetailSpec specData={deviceData ? deviceData.specificationParams : []} />
                        <DeviceDetailInfo infoData={deviceData ? deviceData.attachments : []} />
                        <DeviceDetailUpkeep maintainData={maintainRecordData} />
                        <DeviceDetailRepair repairData={repairRecordData}/>
                        <DeviceDetailDiscard discardData={discardData}/>
                    </div>
                }
            />
        );
    }, [deviceData, discardData, maintainRecordData, repairRecordData]);

};

export default DeviceDetail;