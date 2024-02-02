import React, { useMemo } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Descriptions } from 'antd/lib';
import { IDevice } from '@/model/device';
import { dateFormat } from '@/utils/utils';
interface IProps {
    deviceData: IDevice | null;
}

export const DeviceDetailBasic: React.FC<IProps> = props => {
    const { deviceData } = props;
    const items = useMemo(() => {
        if (!deviceData) return [];
        const {
            number,
            name,
            dictionary,
            tunnel,
            room,
            factoryName,
            factoryNumber,
            manufactureDate, // TODO: 测试，删掉
            description,
        } = deviceData;
        return [
            { label: '设备编号', children: number, key: '1' },
            { label: '设备名称', children: name, key: '2' },
            { label: '设备类型', children: dictionary.name, key: '3' },
            { label: '所属隧道', children: tunnel.name, key: '4' },
            { label: '所属房间', children: room.name, key: '5' },
            { label: '出厂公司', children: factoryName, key: '6' },
            { label: '出厂编号', children: factoryNumber, key: '7' },
            { label: '制造年月', children: dateFormat(manufactureDate, 'yyyy-MM'), key: '8' }, // TODO: 时间转换
            { label: '设备描述', children: description, key: '9' },
        ]
    }, [deviceData])

    return useMemo(() => {
        return (
            <div className="card mb15">
                <div className="title">基础信息</div>       
                <Descriptions 
                    title="" 
                    column={2}
                    items={items as any} 
                />         
            </div>
        );
    }, [items]);

};

export default DeviceDetailBasic;