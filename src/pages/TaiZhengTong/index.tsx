import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import './index.less';
import { taizhengtongLogin } from '@/model/user';
import { useRouter } from 'ym-web-view';
interface IProps {

}
export const TaiZhengTong: React.FC<IProps> = props => {
    const { query, history } = useRouter();
    const { code } = query; 
    
    const login = useCallback(async () => {
        try {
            if (code) {
                await taizhengtongLogin(code);
            }
        } catch (error) {
           console.log('登录泰政通错误：', error);
        }
        history.push('/dashboard')
    }, [code, history]);

    useEffect(() => {
        login();
    }, [login]);
    return useMemo(() => {
        return (
            <div className="page-taizhengtong">
                <div className="grey">
                    自动登录中...
                </div>
            </div>
        );
    }, []);

};

export default TaiZhengTong;