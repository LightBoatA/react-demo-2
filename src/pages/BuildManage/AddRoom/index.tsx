import React, { useCallback, useMemo } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Row, Col, Input } from 'antd';
import QQMap, { ILatLng } from '../QQMap';
interface IProps {

}
export const AddRoom: React.FC<IProps> = props => {
    // const {} = props;
    // 新增标记点
    const handleAddMaker = useCallback((val: ILatLng) => {

    }, [])
    return useMemo(() => {
        return (
            <>
                <Row>
                    <Col className='grey' span={4}>房间名称:</Col>
                    <Col span={20}>
                        <Input placeholder="请输入房间名称" />
                    </Col>
                </Row>
                <Row>
                    <QQMap
                        onAddMarker={handleAddMaker}
                    />
                </Row>
            </>

        );
    }, [handleAddMaker]);

};

export default AddRoom;