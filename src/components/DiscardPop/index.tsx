import React, { useMemo } from 'react';
import './index.less';
import { Col, Form, Input, Radio, Row } from 'antd';
import { EExamineStatus, examineStatusText } from '../../pages/Discard/common';
import { IDeviceFile } from '@/pages/Device/Add/DeviceInfo';
import TextArea from 'antd/es/input/TextArea';
import PhotoWall from '../PhotoWall';
import { dateFormat, getImages } from '@/utils/utils';

export interface IDiscardInfo {
    createdDate: any, // TODO: 类型
    createdRealName: string,
    reason?: string,
    attachments?: IDeviceFile[],
    status?: EExamineStatus,
    auditRemark?: string,

}

interface IProps {
    info: IDiscardInfo | undefined;
    isRegister?: boolean; // 是否是登记报废信息
    isExamine?: boolean; // 是否是审核报废信息
    isApprovedView?: boolean; // 是否是已审核的查看
    // isPendingView: boolean; // 是否是待审核的查看
    form?: any;
    examineForm?: any;
}
const empty_replace = '无';
export const DiscardPop: React.FC<IProps> = props => {
    const { info, isRegister = false, isExamine = false, isApprovedView = false, form, examineForm } = props;
    
    // console.log('props:===================', props);

    return useMemo(() => {
        if (!info) return <></>
        const {
            createdDate,
            createdRealName,
            reason,
            attachments,
            status,
            auditRemark,

        } = info;
        // 图片处理
        const images = getImages(attachments);

        return (
            <div className="comp-device-discard-info-pop">
                {/* <Form
                            form={form}
                            labelCol={{ span: 4 }}
                        > */}
                <Row className='ipt-row'>
                    <Col className=' label' span={4}>登记日期：</Col>
                    <Col className='' offset={1} span={19}>{createdDate ? dateFormat(createdDate, 'yyyy-MM-dd') : empty_replace }</Col>
                </Row>
                <Row className='ipt-row'>
                    <Col className=' label' span={4}>登记人：</Col>
                    <Col className='' offset={1} span={19}>{createdRealName || empty_replace}</Col>
                </Row>
                {/* 只有报废登记时此项为表单，其他均为内容展示 */}
                {isRegister
                    ? <>
                        <Form
                            form={form}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ offset: 1, span: 19 }}
                        >
                            <Form.Item className='ipt-row mt10' style={{ color: 'grey' }}  label="设备编号" name="number" rules={[{ required: true, message: '请输入设备编号' }]}>
                                <Input placeholder="请输入设备编号" />
                            </Form.Item>
                            <Form.Item className='' label="报废原因" name="reason" rules={[{ required: true, message: '请输入设备编号' }]}>
                                <TextArea rows={4} placeholder="请输入报废原因" />
                            </Form.Item>
                            <Form.Item className='ipt-upload-img' label="相关图片" name="attachments" rules={[{ required: true, message: '请上传相关图片' }]}>
                                <PhotoWall maxPhotos={8} />
                            </Form.Item>
                        </Form>
                    </>
                    : <>
                        <Row className='ipt-row'>
                            <Col className=' label' span={4}>报废原因：</Col>
                            <Col className='' offset={1} span={19}>{reason || empty_replace}</Col>
                        </Row>
                        <Row className='ipt-row'>
                            <Col className=' label' span={4}>相关图片：</Col>
                            <Col className='' offset={1} span={19}>{images || empty_replace}</Col>
                        </Row>
                    </>
                }
                {/* 报废审批表单 */}
                {isExamine && <>
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ offset: 1, span: 19 }}
                    >
                        <Form.Item className='mt10' label="审批意见" name="status" rules={[{ required: true, message: '请选择审批意见' }]}>
                            <Radio.Group>
                                <Radio value={EExamineStatus.approved}>通过</Radio>
                                <Radio value={EExamineStatus.rejected}>驳回</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item className='' label="审批说明" name="remark" rules={[{ required: true, message: '请输入审批说明' }]}>
                            <TextArea rows={4} placeholder="请输入审批说明" />
                        </Form.Item>
                    </Form>
                </>}
                {/* 查看报废信息-已审核 */}
                {isApprovedView && <>
                    <Row className='ipt-row'>
                        <Col className=' label' span={4}>审批意见：</Col>
                        <Col className='' offset={1} span={19}>{examineStatusText[status as EExamineStatus] || empty_replace}</Col>
                    </Row>
                    <Row className='ipt-row'>
                        <Col className=' label' span={4}>审批说明：</Col>
                        <Col className='' offset={1} span={19}>{auditRemark || empty_replace}</Col>
                    </Row>
                </>}
                {/* </Form> */}
            </div>
        );
    }, [form, info, isApprovedView, isExamine, isRegister]);

};

export default DiscardPop;