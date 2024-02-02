import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { TMap, MultiMarker } from '@map-component/react-tmap';
interface IProps {

}
// 标记点样式
const styles = {
    myStyle: {
        width: 20, // 点标记样式宽度（像素）
        height: 30, // 点标记样式高度（像素）
        src:
            'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png', //图片路径
        //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
        anchor: { x: 10, y: 30 },
    },
};
export const CustomMap: React.FC<IProps> = props => {
    // const {} = props;
    const [s, set] = useState(0);
    const [index, setIndex] = useState(0);
    const [geometries, setGeometries] = useState<any[]>([]);
    const map = useRef(null);
    // const path = [
    //     //多边形轮廓点串（LatLng数组）
    //     { lat: 40.041054, lng: 116.272303 },
    //     { lat: 40.039419, lng: 116.272721 },
    //     { lat: 40.039764, lng: 116.274824 },
    //     { lat: 40.041374, lng: 116.274491 },
    // ];
    const center = { lat: 39.23, lng: 116.13 };
    useEffect(() => {
        console.log(map.current?.map?.getZoom());
    });
    // const geometries = [
    //     {
    //         position: { lat: 39.23, lng: 116.13 },
    //         id: 0,
    //         styleId: 'myStyle',
    //         properties: {
    //             //自定义属性
    //             title: 'marker1',
    //         },
    //     }
    // ];
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
    function trim(str, type) {
        str = str || "";
        type = type || 1;
        switch (type) {
            case 1:
                return str.replace(/\s+/g, "");
            case 2:
                return str.replace(/(^\s*)|(\s*$)/g, "");
            case 3:
                return str.replace(/(^\s*)/g, "");
            case 4:
                return str.replace(/(\s*$)/g, "");
            default:
                return str;
        }
    }
    // //   点击选中下拉数据
    // function selectSuggestionHandle(row) {
    //     mapInit.current.then((TMap) => {
    //         //修改地图中心点
    //         Map.current.setCenter(
    //             new TMap.LatLng(row.location.lat, row.location.lng)
    //         );
    //         if (markerLayer.current) {
    //             markerLayer.current.setGeometries([]);
    //         }
    //         setKeyword(row.address);
    //         props.click({
    //             keyword: row.address,
    //             position: {
    //                 lat: row.location.lat,
    //                 lng: row.location.lng,
    //             },
    //         });
    //         markerLayer.current.add([
    //             {
    //                 id: "1", //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
    //                 position: new TMap.LatLng(row.location.lat, row.location.lng), //点标记坐标位置
    //             },
    //         ]);
    //         setSuggestionList([]);
    //     });
    // }
    // //根据输入值进行逆向定位
    // function searchHandle(e) {
    //     let value = trim(e);
    //     if (value.length > 0) {
    //         setKeyword(value);
    //         searchSuggestionAPI(value);
    //     } else {
    //         setKeyword("");
    //     }
    // }

    // function searchSuggestionAPI(value) {
    //     mapInit.current.then((TMap) => {
    //         // 新建一个关键字输入提示类
    //         let suggest = new TMap.service.Suggestion({
    //             pageSize: 10, // 返回结果每页条目数
    //         });
    //         suggest
    //             .getSuggestions({
    //                 keyword: value,
    //             })
    //             .then((result) => {
    //                 // 以当前所输入关键字获取输入提示
    //                 if (result.data.length > 0) {
    //                     setSuggestionList(result.data);
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.log("[error]", error);
    //             });
    //     });
    // }

    return useMemo(() => {
        return (
            <>
                {/* <div className="search-header">
                    <input
                        type="text"
                        placeholder="请输入地址"
                        value={keyword}
                        onChange={(e) => searchHandle(e.target.value)}
                    />
                </div>
                {suggestionList.length > 0 ? (
                    <ul className="suggestion-wrap">
                        {suggestionList.map((item, index) => (
                            <li
                                key={index}
                                className="suggestion-item"
                                onClick={() => {
                                    selectSuggestionHandle(item);
                                }}
                            >
                                {item.title}
                            </li>
                        ))}
                    </ul>
                ) : (
                    ""
                )} */}
                <TMap
                    mapKey="TOZBZ-OU2CX-JJP4Z-7FCBV-CDDJ2-AHFQZ"
                    onClick={e => {
                        addMarker(e.latLng);
                        console.log(e);
                    }}
                    // center={path[index]}
                    center={center}
                    zoom={10} // 3-20
                    control={{
                        scale: {
                            position: 'BOTTOM_LEFT',
                        },
                    }}
                    libraries={['service']}
                    style={{}}
                    ref={map}
                    onLoad={m => console.log(m)}
                >
                    <MultiMarker geometries={geometries} styles={styles} />
                </TMap>
            </>

        );
    }, [addMarker, center, geometries]);

};

export default CustomMap;