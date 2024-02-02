import React, { useMemo } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { dateFormat, getImages } from '@/utils/utils';
import { Col, Row } from 'antd';
interface IProps {
    type: 'maintenance' | 'repair'
    info: any;
}
const empty_replace = '无';
export const DetailPop: React.FC<IProps> = props => {
    const { info, type } = props;
    const { content, taskContent, homeworkRequirement, estimate, attachments, repairRealName, maintenanceRealName, maintenanceDateTime, repairDateTime } = info;
    const imagesComps = getImages(attachments);

    return useMemo(() => {
        return (
            <div className="comp-device-detail-pop">
                { type === 'maintenance' 
                    ? <>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>保养时间</Col>
                            <Col className='' offset={1} span={20}>{maintenanceDateTime ? dateFormat(maintenanceDateTime, 'yyyy-MM-dd') : empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>保养人员</Col>
                            <Col className='' offset={1} span={20}>{maintenanceRealName || empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>任务内容</Col>
                            <Col className='' offset={1} span={20}>{content || empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>作业要求</Col>
                            <Col className='' offset={1} span={20}>{homeworkRequirement || empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>估算数量及预算金额</Col>
                            <Col className='' offset={1} span={20}>{estimate || empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>相关图片</Col>
                            <Col className='' offset={1} span={20}>{imagesComps || empty_replace}</Col>
                        </Row>
                    </>
                    : <>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>维修时间</Col>
                            <Col className='' offset={1} span={20}>{repairDateTime ? dateFormat(repairDateTime, 'yyyy-MM-dd') : empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>维修人员</Col>
                            <Col className='' offset={1} span={20}>{repairRealName || empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>任务内容</Col>
                            <Col className='' offset={1} span={20}>{taskContent || empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>作业要求</Col>
                            <Col className='' offset={1} span={20}>{homeworkRequirement || empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>估算数量及预算金额</Col>
                            <Col className='' offset={1} span={20}>{estimate || empty_replace}</Col>
                        </Row>
                        <Row className='show-info-row'>
                            <Col className='gray info-label' span={3}>相关图片</Col>
                            <Col className='' offset={1} span={20}>{imagesComps || empty_replace}</Col>
                        </Row>
                    </>
                }

            </div>
        );
    }, [content, estimate, homeworkRequirement, imagesComps, maintenanceDateTime, maintenanceRealName, repairDateTime, repairRealName, taskContent, type]);

};

export default DetailPop;