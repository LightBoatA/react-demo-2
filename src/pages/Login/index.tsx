import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { TOKEN_KEY, USERLOGININFO } from '@utils/constant';
// import { getValueFromEvent } from '@/utils/utils';
import { storage, tools, useRouter } from 'ym-web-view';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRedux } from '@/hooks/useRedux';
import {getUserLogin } from '@/model/user';
import './index.less';
import Logo from '@/components/Logo';

interface IProps {
  name?: string;
}

export const Login: React.FC<IProps> = (props: any) => {
  const [btnIsLoading, setBtnIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { actions } = useRedux();
  const { history } = useRouter();
  const onFinish = useCallback(
    async values => {
      try {
        setBtnIsLoading(true);
        const res: any = await getUserLogin({
          username: values.username,
          password: values.password,
        });
        localStorage.setItem(USERLOGININFO, values.username);
        history.push('/dashboard');
        setBtnIsLoading(false);
      } catch (e) {
        setBtnIsLoading(false);
      }
    },
    [history]
  );

  return useMemo(() => {
    return (
      <div className="page-login-wrap">
        <div className="form-wrap">
          <div className="form-title">
            <Logo/>
            <div className="sub-title">设备赋码系统</div>
          </div>
          <Form form={form} layout="vertical" className="module-login-form" name="basic" initialValues={{}} onFinish={onFinish}>
            <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号名' }]}>
              <Input className="form-input mb5" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入账号名" />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入登录密码' }]}>
              <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="请输入登录密码" className="form-input mb15" />
            </Form.Item>
            <Form.Item>
            <Button loading={btnIsLoading} type="primary" htmlType="submit" className="w100p form-btn">
              登录
            </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }, [btnIsLoading, form, onFinish]);
};

export default Login;
