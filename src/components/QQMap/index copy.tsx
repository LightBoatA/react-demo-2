import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
interface IProps {

}
const key = 'FRCBZ-D7QRW-RZHRS-3O242-YQNMK-FOBNR';
const TMap = key => {
    return new Promise(function (resolve, reject) {
        window.init = function () {
            resolve(qq);
        };
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key=' + key;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

export const QQMap: React.FC<IProps> = props => {
    // const {} = props;
    const mapRef = useRef();
    const [geometries, setGeometries] = useState<any[]>([]);
    const addMarker = useCallback((latLng: any) => {
        const newMaker = {
            position: latLng,
            id: 1,
            styleId: 'myStyle',
            properties: {
                //自定义属性
                title: 'marker2',
            },
        };
        setGeometries([...geometries, newMaker])
    }, [geometries]);
    const initMap = useCallback(() => {
        //设置中心坐标
        let tarLat = 39.984120;
        let tarLng = 116.307484;
        TMap(key).then(qq => {
            //初始化经纬度，最开始的点
            let myLatlng = new qq.maps.LatLng(tarLat, tarLng);
            //设置地图属性
            let myOptions = {
                zoom: 16,
                center: myLatlng,
                mapTypeId: qq.maps.MapTypeId.ROADMAP,
            };
            //创建地图，绑定dom
            const map = new qq.maps.Map(document.getElementById('myMap'), myOptions);
            //现实已经存在的点
            // let markerlast = new qq.maps.Marker({
            //     position: myLatlng,
            //     map,
            // });

            console.log('地图实例：', map);
            //监听点击事件添加marker
            map.on("zoom", (e) => {
                addMarker(e.latLng);
                console.log(e);
            });
        });
    },[addMarker]);
    


    useEffect(() => {
        initMap();
    }, [initMap]);


    return useMemo(() => {
        return (
            <div
                id="myMap"
                style={{
                    width: 1200,
                    height: 500,
                }}
            ></div>
        );
    }, []);

};

export default QQMap;