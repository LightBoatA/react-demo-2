import React, { useMemo } from 'react';
import './index.less';
import { Form, Select } from 'antd';
import { getSelectOptions } from '@/utils/utils';
interface IProps {
    form: any,
    roleOptions: any,
    initData?: any,
}
export const UserAdd: React.FC<IProps> = props => {
    const { form, initData, roleOptions } = props;
    // 编辑页初始化
    if (initData) {
        form.setFieldsValue({ ...initData, role: initData.role ? `${initData.role.id}` : null })
    }
    return useMemo(() => {
        return (
            <Form
                form={form}
                labelCol={{ span: 4 } }
            >
                <Form.Item label="手机号" name="mobilePhone" rules={[{ required: true }]}>
                    <div className="gray">{initData?.mobilePhone?.number}</div>
                </Form.Item>
                <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
                    <div className="gray">{initData?.orgName}</div>
                </Form.Item>
                <Form.Item label="组织" name="orgName" rules={[{ required: true }]}>
                    <div className="gray">{initData?.orgName}</div>
                </Form.Item>
                <Form.Item label="角色" name="role" rules={[{ required: true, message: '请选择' }]}>
                    <Select placeholder="请选择">
                        {getSelectOptions(roleOptions)}
                    </Select>
                </Form.Item>
            </Form>
        );
    }, [form, initData?.mobilePhone?.number, initData?.orgName, roleOptions]);

};

export default UserAdd;