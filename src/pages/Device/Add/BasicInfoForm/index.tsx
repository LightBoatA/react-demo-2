import { useArchitecture } from "@/hooks/useArchitecture";
import { useDeviceType } from "@/hooks/useDeviceType";
import { getSelectOptions } from "@/utils/utils";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useCallback, useMemo, useState } from "react";

interface IProps {
    form: any;
    isEdit: boolean;
}

export const BasicInfoForm: React.FC<IProps> = (props) => {
    const { form, isEdit } = props;
    const { tunnelOptions, getRoomsOptions } = useArchitecture();
    // const { selectedTunnel, setSelectedTunnel}
    const { deviceTypeOptions } = useDeviceType();
    const [validateStatus, setValidateStatus] = useState<any>(undefined); // 受控的校验状态
    const [validateHelp, setValidateHelp] = useState<any>(''); // 校验的提示信息
    const tId = Form.useWatch('tunnel', form);
    const customValidator = useCallback(async (_, _value) => {
        // 非空校验
        if (_value === undefined || !_value.trim()) {
            setValidateStatus('error');
            setValidateHelp('请输入设备编号');
            throw new Error();
        }

        // 非中文及中文符号校验
        // eslint-disable-next-line no-control-regex
        const _res = /[^\x00-\xff]/.test(_value.trim()); 
        if (_res) {
            setValidateStatus('error');
            setValidateHelp('设备编号中不能包含中文');
            throw new Error();
        } else {
            setValidateStatus('success');
            setValidateHelp(undefined);
        }
    }, [])
    return useMemo(() => {
        return (
            <div className="card mb15">
                <div className="title">基础信息</div>
                <Form form={form}>
                    <Row>
                        <Col span={6} >
                            <Form.Item label="设备编号" name="number"
                                validateStatus={validateStatus}
                                help={validateHelp}
                                rules={[
                                    { required: true },
                                    { validator: customValidator }
                                ]}>
                                <Input placeholder="请输入设备编号" disabled={isEdit} />
                            </Form.Item>
                        </Col>
                        <Col span={6} offset={6}>
                            <Form.Item label="设备名称" name="name" rules={[{ required: true, message: '请输入设备名称' }]}>
                                <Input placeholder="请输入设备名称" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} >
                            <Form.Item label="设备类型" name="dictionary" rules={[{ required: true, message: '请选择设备类型' }]}>
                                <Select placeholder="请选择设备类型">
                                    {deviceTypeOptions ? getSelectOptions(deviceTypeOptions) : []}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6} offset={6}>
                            <Form.Item label="所属隧道" name="tunnel" rules={[{ required: true, message: '请选择所属隧道' }]}>
                                <Select placeholder="请选择所属隧道" onChange={() => {
                                    form.setFieldsValue({ room: null })
                                }}>
                                    {tunnelOptions ? getSelectOptions(tunnelOptions) : []}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} >
                            <Form.Item label="所属房间" name="room" rules={[{ required: true, message: '请选择所属房间' }]}>
                                <Select placeholder="请选择所属房间">
                                    {getSelectOptions(getRoomsOptions(tId) || [])}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6} offset={6}>
                            <Form.Item label="出厂公司" name="factoryName" rules={[{ required: true, message: '请输入出厂公司' }]}>
                                <Input placeholder="请输入出厂公司" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} >
                            <Form.Item label="出厂编号" name="factoryNumber" rules={[{ required: true, message: '请输入出厂编号' }]}>
                                <Input placeholder="请输入出厂编号" />
                            </Form.Item>
                        </Col>
                        <Col span={6} offset={6}>
                            <Form.Item label="制造年月" name="manufactureDate" rules={[{ required: true, message: '请输入制造年月' }]}>
                                <DatePicker picker="month" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={18} >
                            <Form.Item label="设备描述" name="description" >
                                <TextArea rows={7} placeholder="请输入设备描述" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }, [customValidator, deviceTypeOptions, form, getRoomsOptions, isEdit, tId, tunnelOptions, validateHelp, validateStatus]);
}

export default BasicInfoForm;
