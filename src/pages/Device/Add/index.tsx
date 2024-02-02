import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Button, Form, Space, message } from 'antd';
import BasicInfoForm from './BasicInfoForm';
import SpecInfo from './SpecInfo';
import DeviceInfo from './DeviceInfo';
import { useForm } from 'antd/es/form/Form';
import { IDevice, addDevice, updateDeviceById } from '@/model/device';
import { useRouter } from 'ym-web-view';
import { useDevice } from '@/hooks/useDevice';
import { debounce, getUUID } from '@/utils/utils';
import dayjs from 'dayjs';
import { convertFileType } from './common';
interface IProps {

}
export const DeviceAdd: React.FC<IProps> = props => {
    // const {} = props;
    const [form] = useForm();
    const { history, match } = useRouter();
    const { params } = match;
    // @ts-ignore
    const { id } = params;
    const { deviceData } = useDevice(id);
    const [fileList, setFileList] = useState<any>(); // 只在编辑时，用一次
    const attachmentsRef = useRef<any>([]); // 用于存储上传结果
    const [specParams, setSpecParams] = useState<any>([]); // 用于存储上传结果
    const [loading, setLoading] = useState<boolean>(false); // 用于存储上传结果

    useEffect(() => {
        // 编辑页
        if (id && deviceData) {
            // 预数据
            const {
                number,
                name,
                dictionary,
                tunnel,
                room,
                factoryName,
                factoryNumber,
                manufactureDate,
                description,
                specificationParams,
                attachments,
            } = deviceData as any;

            form.setFieldsValue({
                number,
                name,
                dictionary: `${dictionary.id}`,
                tunnel: `${tunnel.id}`,
                room: `${room.id}`,
                factoryName,
                factoryNumber,
                manufactureDate: manufactureDate ? dayjs(manufactureDate, 'yyyy-MM') : '',
                description,
            })
            // 文件列表
            setFileList(convertFileType(attachments));
            const _specParams = specificationParams ? specificationParams.map((item) => {
                return { id: getUUID(), paramKey: item.key, paramValue: item.value }
            }) : [];
            setSpecParams(_specParams);
            attachmentsRef.current = attachments; // 初始值
        }
    }, [deviceData, form, id])

    const handleSubmit = useCallback(async () => {
        setLoading(true)
        try {
            const {
                number,
                name,
                dictionary,
                tunnel,
                room,
                factoryName,
                factoryNumber,
                manufactureDate,
                description,
            } = await form.validateFields();
            const obj = {
                number,
                name,
                dictionary: { id: dictionary },
                tunnel: { id: tunnel },
                room: { id: room },
                factoryName,
                factoryNumber,
                manufactureDate,
                description,
                specificationParams: specParams ? specParams.map((item) => {
                    return { key: item.paramKey, value: item.paramValue }
                }) : [],
                attachments: attachmentsRef.current,
            } as IDevice;
            if (id && deviceData) {
                // 修改
                await updateDeviceById(id, obj);
                message.success('修改成功！');
                history.push('/device');

            } else {
                // 新增
                await addDevice(obj);
                message.success('提交成功！');
                history.push('/device');
            }
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setLoading(false);
        }
    }, [deviceData, form, history, id, specParams])

    const handleSpecParamsChange = useCallback((_items: any) => {
        setSpecParams(_items);
    }, [])

    const handleUploadChange = useCallback((info: any) => {
        const newFiles = info.map(item => {
                return { ...item.response }
            })
        attachmentsRef.current = [...newFiles];
    }, [])

    return useMemo(() => {
        return (
            <>
                <HeaderLayout
                    breadData={[{ name: '设备管理', url: '/device' }, { name: `${id ? '编辑设备' : '新增设备'}` }]}
                    children={
                        <div className="page-device-add">
                            <Form
                                form={form}
                                labelCol={{ span: 4 }}
                            >
                                <BasicInfoForm
                                    form={form}
                                    isEdit={id}
                                />
                                <SpecInfo 
                                    value={specParams}
                                    onChange={handleSpecParamsChange}
                                />
                                <DeviceInfo
                                    form={form}
                                    fileList={fileList}
                                    onUploadChange={handleUploadChange}
                                />
                            </Form>
                        </div>
                    }
                />
                <div className="card submit-bar">
                    <Space>
                        <Button onClick={() => { history.goBack() }} >返回</Button>
                        <Button loading={loading} type="primary" onClick={debounce(handleSubmit, 800)} >提交</Button>
                    </Space>
                </div>
            </>

        );
    }, [fileList, form, handleSpecParamsChange, handleSubmit, handleUploadChange, history, id, loading, specParams]);

};

export default DeviceAdd;