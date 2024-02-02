import React, { useMemo } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
interface IProps {

}
export const Logo: React.FC<IProps> = props => {
    // const {} = props;
    return useMemo(() => {
        return (
            <div className="logo"></div>
        );
    }, []);

};

export default Logo;