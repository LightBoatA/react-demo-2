import React, { useMemo } from 'react';
import './index.less';
import { Form, Input } from 'antd';
import { IUser } from '@/model/user';
interface IProps {
    form: any,
    initData?: IUser,
}
export const DeviceTypeAdd: React.FC<IProps> = props => {
    const { form, initData } = props;
    // 编辑页初始化
    if (initData) {
        form.setFieldsValue({ ...initData })
    }

    return useMemo(() => {
        return (
            <Form
                form={form}
                labelCol={{ span: 4 } }
            >
                <Form.Item label="设备类型" name="name" rules={[{ required: true, message: '请输入设备类型名' }]}>
                    <Input placeholder="请输入设备类型名" />
                </Form.Item>
                <Form.Item label="标识" name="label" rules={[{ required: true, message: '请输入标识' }]}>
                    <Input disabled={initData ? true : false} placeholder="请输入标识" />
                </Form.Item>
            </Form>
        );
    }, [form, initData]);

};

export default DeviceTypeAdd;