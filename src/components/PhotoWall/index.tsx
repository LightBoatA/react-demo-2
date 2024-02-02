// PhotoWall.js
import React, { useState } from 'react';
import { InfoCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { IDeviceFile } from '@/pages/Device/Add/DeviceInfo';

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface PhotoWallProps {
    uploadUrl?: string;
    maxPhotos?: number;
    value?: IDeviceFile[];
    onChange?: (value: any) => void;
}

const PhotoWall: React.FC<PhotoWallProps> = ({ maxPhotos = 8, value = [], onChange, uploadUrl = '/api/file/upload' }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {

        const filesValue = newFileList.map(item => {
            return { ...item.response }
        });
        onChange && onChange(filesValue)
        setFileList(newFileList)
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>添加图片</div>
        </div>
    );

    return (

        <>
            <Upload
                action={uploadUrl}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                multiple={true}
                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            >
                {fileList.length >= maxPhotos ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default PhotoWall;
