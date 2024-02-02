import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Button } from 'antd';
// import { descriptions } from './common';
import { useRouter } from 'ym-web-view';
import { useArchitecture } from '@/hooks/useArchitecture';
import { defaultTunnelInfo } from './common';
interface IProps {

}
export const Dashboard: React.FC<IProps> = props => {
    const { getTunnelsInfo } = useArchitecture();

    const [hovered, setHovered] = useState(0);
    const { history } = useRouter();
    const [content, setContent] = useState<any>(defaultTunnelInfo);

    useEffect(() => {
        getTunnelsInfo().then((_res) => {
            if (_res) {
                // 先排序:1号、2号、汇景
                const _newArr: any[] = [];
                defaultTunnelInfo.forEach(defaultItem => {
                    const obj = _res.find(resItem => resItem.text === defaultItem.text)
                    obj && _newArr.push(obj);
                })
                setContent(_newArr)
            }
        });

    }, [getTunnelsInfo])

    const handleMouseEnter = (index) => {
        setHovered(index);
    };

    const handleMouseLeave = () => {
        setHovered(0);
    };
    
    const handleEnter = useCallback((id: string) => {
        history.push('/dashboard/map/' + id);
    }, [history])
    
    return useMemo(() => {
        return (
            <HeaderLayout
                children={
                    <div className='page-home-gallery '>
                        <div className="gallery">
                            {content.map((_item, index) => (
                                <div
                                    key={`image${index}`}
                                    className={`image-container ${hovered === index ? 'hovered' : ''}`}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className={`image p${index}`} ></div>
                                    <div className="overlay">
                                        <div className="pic-content">
                                            <div className="pic-title">
                                                <div className="title-icon"></div>
                                                <div className="title-text">{_item.text}</div>
                                            </div>
                                            <div className="description">
                                                {_item.desc}
                                            </div>
                                            <div className="btn-wrap">
                                                <Button className="btn" type='text' onClick={() => { handleEnter(_item.value as string) }}>点击进入<span style={{ fontSize: 26 }}>→</span></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            />
        );
    }, [content, handleEnter, hovered]);

};

export default Dashboard;