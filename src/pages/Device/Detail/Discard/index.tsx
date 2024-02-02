import React, { useMemo } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Descriptions } from 'antd/lib';
import { Space } from 'antd';
import DiscardPop from '@/components/DiscardPop';
interface IProps {
    discardData: any;
}

export const DeviceDetailDiscard: React.FC<IProps> = props => {
    const { discardData } = props;
    // const discardLatest = discardData && discardData.length ? discardData[0] : null;
    const discardLatest = discardData && discardData.length ? discardData[discardData.length - 1] : null; // 需要最新的信息
    return useMemo(() => {
        return (
            <div className="card mb40">
                <div className="title">报废信息</div>
                {discardLatest
                    ? <div className="device-discard-wrap">
                        <DiscardPop info={discardLatest} isApprovedView={true} />
                    </div>
                    : <div className="mt10 mb15">
                        此设备暂无报废信息
                    </div>
                }

            </div>
        );
    }, [discardLatest]);

};

export default DeviceDetailDiscard;