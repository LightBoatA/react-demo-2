import React, { ReactNode } from 'react';
import { Modal } from 'antd';
import { ExclamationCircleFilled, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

interface IProps {
  msg: string;
  title?: string;
  icon?: ReactNode;
  okText?: string;
  cancelText?: string;
  okType?: 'danger' | 'link' | 'ghost' | 'dashed' | 'text';
  content?: ReactNode;
  width?: number;
  onOKCallBack?: () => void;
  onCancelCallBack?: () => void;
}

const initIcon: ReactNode = <ExclamationCircleFilled style={{ color: '#F99204' }} className="modal-info-icon fs18 mr10" />;

export const ShowModalConfirm = (props: IProps) => {
  const { title, msg, cancelText, okText, onOKCallBack, onCancelCallBack, icon, content, okType = 'primary', width } = props;
  confirm({
    className: 'common-confirm',
    content: content || (
      <div className="flex flex-v-center">
        {icon ? icon : initIcon}
        <span dangerouslySetInnerHTML={{ __html: msg }} />
      </div>
    ),
    title: title ? title : '系统提示',
    cancelText: cancelText ? cancelText : '取消',
    okText: okText ? okText : `确定`,
    centered: true,
    okType,
    width,
    onOk: () => {
      onOKCallBack && onOKCallBack();
    },
    onCancel: () => {
      onCancelCallBack && onCancelCallBack();
    }
  });
};

export default ShowModalConfirm;
