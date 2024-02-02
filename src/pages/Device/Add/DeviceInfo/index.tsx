import React, { useMemo } from 'react';
import './index.less';
import { Button, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from "ym-web-view";
// import { UploadFile } from "antd";

export interface IDeviceFile {
    id?: string;
    location: string;
    fileName: string;
    contentType: string;
    size: number;
}

interface IProps {
    form: any;
    fileList?: any;
    onUploadChange: (info: any) => void;
}
export const DeviceInfo: React.FC<IProps> = props => {
    const { form, fileList, onUploadChange } = props;

    return useMemo(() => {
        return (
            <div className="card mb100">
                <div className="spec-info-title ">
                    <div className="title">设备资料</div>
                    <Form form={form}>
                        <Form.Item name="attachments" >
                            <UploadFile
                                action="/api/file/upload"
                                fileSize={100}
                                name="file"
                                maxCount={999}
                                accept=".mp3,.zip,.xlsx,.doc,.docx,.wps,.word,.pdf,.png,.jpeg,.jpg,.gif,.mp4,.avi,.ppt"
                                // accept="."
                                // accept="*/*"
                                errorHandle={() => { }}
                                defaultFileList={fileList && fileList.length ? [...fileList] : undefined }
                                onChange={onUploadChange}
                        >
                            <Button type="primary" className='btn-border' icon={< UploadOutlined />}>上传</Button>
                        </UploadFile>
                    </Form.Item>
                </Form>


            </div>
            </div >
        );
    }, [fileList, form, onUploadChange]);

};

export default DeviceInfo;