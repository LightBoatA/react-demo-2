import React, { useMemo, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Form, Typography, Popconfirm, Table, Button, Space } from 'antd';
import EditableCell, { Item } from './EditableCell';
interface IProps {
    datasource: Item[];
}

export const EditableTable: React.FC<IProps> = props => {
    const { datasource } = props;
    const [form] = Form.useForm();
    const [data, setData] = useState(datasource);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        form.setFieldsValue({ name: '', age: '', address: '', ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Item;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: '规格名',
            dataIndex: 'name',
            width: '40%',
            editable: true,
        },
        {
            title: '规格值',
            dataIndex: 'value',
            width: '40%',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'actions',
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            保存
                        </Typography.Link>
                        <Popconfirm title="确认取消编辑吗?" onConfirm={cancel}>
                            <a>取消</a>
                        </Popconfirm>

                    </span>
                ) : (
                    <Space>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            编辑
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" disabled={editingKey !== ''} onConfirm={() => {}}>
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                删除
                            </Typography.Link>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return useMemo(() => {
        return (
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>
        );
    }, [data, form, mergedColumns]);

};

export default EditableTable;