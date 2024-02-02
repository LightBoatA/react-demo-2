import { Button, Form, Input, Modal, Table } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { columns } from "./common";
import { PlusOutlined } from "@ant-design/icons";
import { IAction } from "@/utils/type";
import { addKeyForData, getActionCol, getUUID } from "@/utils/utils";
import { useForm } from "antd/lib/form/Form";

export interface ISpecParam {
    id: string;
    paramKey: string;
    paramValue: string;
}
interface IProps {
    value?: ISpecParam[];
    onChange?: (value: any) => void;
    // formChild: any;
}

export const SpecInfo: React.FC<IProps> = (props) => {
    const { value = [], onChange } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validateStatus, setValidateStatus] = useState<any>(undefined); // 受控的校验状态
    const [validateHelp, setValidateHelp] = useState<any>(''); // 校验的提示信息
    const [form] = useForm();
    const handleDelete = useCallback((record: any) => {
        const newItems = value.filter((item) => item.id !== record.id);
        onChange && onChange(newItems);
    }, [onChange, value])

    const handleOpenAddModal = useCallback(async () => {
        form.resetFields();
        setIsModalOpen(true);

    }, [form])

    const handleAdd = useCallback(async () => {
        try {
            const { paramKey, paramValue } = await form.validateFields();
            if (paramKey && paramValue) {
                const addData = { id: getUUID(), paramKey, paramValue };
                const newItems = [...value, addData];
                setIsModalOpen(false);
                onChange && onChange(newItems);
            }
        } catch (error) {
            console.log(error);
        }
    }, [form, onChange, value])

    const paramKeyValidator = useCallback(async (_, _value) => {
        // 非空校验
        if (_value === undefined || !_value.trim()) {
            setValidateStatus('error');
            setValidateHelp('请输入规格参数');
            throw new Error();
        }

        // 检验重复
        const obj = value.find(item => item.paramKey === _value);
        if (obj) {
            setValidateStatus('error');
            setValidateHelp('规格参数名不能重复');
            throw new Error();
        } else {
            setValidateStatus('success');
            setValidateHelp(undefined);
        }
    }, [value])
    const tableColumns = useMemo(() => {
        const actions: IAction[] = [
            { text: '删除', handler: handleDelete, danger: true },
        ]
        return [...columns, getActionCol(actions)]
    }, [handleDelete])

    return useMemo(() => {
        return (
            <div className="card  mb15">
                <div className="spec-info-title flex flex-h-sb ">
                    <div className="title">规格参数</div>
                    <Button type="primary" className="btn-border" onClick={() => { handleOpenAddModal() }} icon={<PlusOutlined />}>添加规格项</Button>
                </div>
                <Table
                    columns={tableColumns as any}
                    // dataSource={value}
                    dataSource={addKeyForData(value)}
                />
                <Modal
                    title="添加数据项"
                    open={isModalOpen}
                    onOk={() => {
                        handleAdd()
                    }}
                    onCancel={() => { setIsModalOpen(false) }}
                >
                    <Form
                        form={form}
                        labelCol={{ span: 4 }}
                        className="mt15"
                    >
                        <Form.Item label="规格参数" name="paramKey"
                            validateStatus={validateStatus}
                            help={validateHelp} 
                            rules={[
                                { required: true },
                                { validator: paramKeyValidator }
                            ]}>
                            <Input placeholder="请输入规格参数" />
                        </Form.Item>
                        <Form.Item label="值" name="paramValue" rules={[{ required: true, message: '请输入参数值' }]}>
                            <Input placeholder="请输入参数值" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }, [form, handleAdd, handleOpenAddModal, isModalOpen, paramKeyValidator, tableColumns, validateHelp, validateStatus, value]);
}

export default SpecInfo;
