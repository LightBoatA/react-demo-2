import React, { useEffect, useMemo } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
interface IProps {
    codeInfo: any; // TODO: 类型
}
export const QRCode: React.FC<IProps> = props => {
    const { codeInfo } = props;
    // console.log('重新渲染子组件啦');

    return useMemo(() => {
        const { name = '', number = '', factoryName = '', qrcode = '' } = codeInfo;
        return (
            <div className="flex-c-c comp-device-QR-code">
                {/* 使用img标签导致打印窗口出现两次，原因未找到，替换成object标签 */}
                {/* <img width={30} height={30} className='' src={'data:image/png;base64,' + qrcode} />  */}
                <object style={{ marginRight: 10 }} width={210} height={210} data={'data:image/png;base64,' + qrcode}></object>
                <div className="text-wrap flex-col flex-h-sb">
                    <div className="code-desc">
                        <div className="code-label">设备名称：</div>
                        <div className="code-text">{name}</div>
                    </div>
                    <div className="code-desc">
                        <div className="code-label">设备编号：</div>
                        <div className="code-text">{number}</div>
                    </div>
                    <div className="code-desc">
                        <div className="code-label">生产厂商：</div>
                        <div className="code-text">{factoryName}</div>
                    </div>
                </div>
            </div>
        );
    }, [codeInfo,]);

};

export default QRCode;