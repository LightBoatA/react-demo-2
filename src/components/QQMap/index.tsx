import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getImageSrcPrefix, getUUID } from "@/utils/utils";
import { MAP_KEY } from "@/utils/constant";
import './index.less';
// import colors from 'colors';
import { getDeviceTypeReportByRoomId } from "@/model/deviceType";
import { setUpChooseTableParams } from "ym-web-view";
import * as url from '@model/url';
import SearchBar from "./SearchBar";
import { generateDomStr } from "./common";

const CURRENT_MAKER_ID = 'current-marker';

export interface ILatLng {
    lat: number,
    lng: number,
}
interface IProps {
    showSearchBar?: boolean;
    tunnelId?: string | number;
    initCenter?: ILatLng | null;
    initMakerPoints?: any; // TODO: 类型：经度、纬度、名称
    initPolylines?: { lat: number, lng: number }[][]; // TODO: 类型：{ lat, lng}[]
    curMaker?: ILatLng | null;
    onAddMarker?: (val: ILatLng) => void;
    height?: any; // 地图挂载的dom的高度
}

const defaultCenter: ILatLng = {
    lat: 32.44316,
    lng: 119.927021,
}

//@ts-ignore
window.handleToDevicePage = (_id, _tunnelId) => {
    const obj = {};
    obj[url.deviceList] = { url: url.deviceList, pagination: { current: 1, size: 10 }, searchCondition: { tunnelId: _tunnelId + '', roomId: _id + '' } }
    setUpChooseTableParams(obj, true, true);
    window.location.href = '/device';
}

export const QQMap: React.FC<IProps> = props => {
    const { height = '100%', showSearchBar = false, tunnelId = null, onAddMarker = null, curMaker: propsCurMaker = null, initCenter, initMakerPoints = null, initPolylines = null } = props;
    const [TMap, setTMap] = useState<any>(null); // Map类
    const [myMap, setMyMap] = useState<any>(null); // map实例
    const markerLayerRef = useRef<any>(null) // 标记点
    const infoWindowRef = useRef<any>(null) // 信息窗口
    const labelLayerRef = useRef<any>(null) // 标记点标签
    const polylineRef = useRef<any>(null) // 折线
    const districtRef = useRef<any>(null) // 行政区划
    const isCreatedMyMap = useRef<boolean>(false)
    const [keyword, setKeyword] = useState("");
    const [suggestionList, setSuggestionList] = useState([]);
    const [cityList, setCityList] = useState<any[]>([]);
    const currentMarkerId = useRef<any>(null);

    //@ts-ignore
    window.handleCloseInfoWindow = () => {
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }
    }
    const getLatLng = useCallback((lat: number, lng: number) => {
        if (TMap) {
            return new TMap.LatLng(lat, lng);
        }
    }, [TMap])

    // const TMapGL = (key: string) => {

    //     let script = document.createElement('script')
    //     script.type = 'text/javascript'
    //     script.text = 'TMap'
    //     script.src = 'https://map.qq.com/api/gljs?v=1.exp&libraries=service&key=' + key
    //     script.onerror = (err) => {
    //         console.log('添加脚本错误：', err);

    //     }
    //     script.onload = (e) => {
    //         const tmap = (window as any).TMap
    //         setTMap(tmap);
    //         console.log('！！！获取api，添加脚本，完毕');

    //     }
    //     document.head.appendChild(script)

    // }
    // 获取TMap
    useEffect(() => {
        let attempts = 0;

        const tryGetTMap = () => {
            const tmap = (window as any).TMap;
            if (tmap) {
                setTMap(tmap);
                console.log('获取api，添加脚本，完毕');
            } else {
                attempts++;
                console.log('脚本尚未加载，尝试次数：', attempts);

                if (attempts < 6) {  // 最多尝试 5 次，每次间隔 5 秒
                    setTimeout(tryGetTMap, 5000);
                } else {
                    console.log('达到最大尝试次数，脚本加载失败');
                }
            }
        };
        tryGetTMap();
    }, [])

    const addCurMaker = useCallback((latLng: any) => {
        let markers = [{
            "id": CURRENT_MAKER_ID,   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
            "styleId": 'redMarker',  //指定样式id
            "position": latLng,  //点标记坐标位置
            "properties": {
                "title": "defaultMarker"
            }
        }]
        markerLayerRef.current.add(markers)
        currentMarkerId.current = CURRENT_MAKER_ID;

    }, [])
    const addOnePoint = useCallback((e: any) => {
        if (currentMarkerId.current) {
            markerLayerRef.current.remove(currentMarkerId.current);
            currentMarkerId.current = null;
        }
        addCurMaker(e.latLng)
        onAddMarker && onAddMarker(e.latLng);
    }, [addCurMaker, onAddMarker])

    const searchSuggestionAPI = useCallback((value: string) => {

        if (TMap) {
            console.log('searchSuggestionAPI');

            let suggest = new TMap.service.Suggestion({
                pageSize: 10, // 返回结果每页条目数
            });
            suggest.getSuggestions({
                keyword: value,
            })
                .then((result) => {
                    // 以当前所输入关键字获取输入提示
                    if (result.data.length > 0) {
                        setSuggestionList(result.data);
                    }
                })
                .catch((error) => {
                    console.log("[searchSuggestionAPIerror]", error);
                });
        }

    }, [TMap])

    const onClickMap = useCallback((e: any) => {
        console.log('click', e)
        addOnePoint(e)
    }, [addOnePoint])

    const searchHandle = useCallback((e: any) => {
        let value = e;
        if (value.length > 0) {
            setKeyword(value);
            searchSuggestionAPI(value);
        } else {
            setKeyword("");
        }
    }, [searchSuggestionAPI])

    const selectSuggestionHandle = useCallback((row: any) => {
        if (TMap && myMap) {
            myMap.setCenter(
                new TMap.LatLng(row.location.lat, row.location.lng)
            );
            setKeyword(row.address);
            addOnePoint({ latLng: new TMap.LatLng(row.location.lat, row.location.lng) })
            setSuggestionList([]);
        }
    }, [TMap, addOnePoint, myMap])

    const handleMarkerClick = useCallback(async (evt) => {
        const _roomId = evt.geometry.properties.roomId;
        if (_roomId) {
            const _roomName = evt.geometry.properties.roomName;
            // 先显示Loading窗口，避免点击标记点后延迟反应
            const loadingDomStr = generateDomStr(_roomName, [], null, null, true);
            infoWindowRef.current.open();
            infoWindowRef.current.setPosition(evt.geometry.position);
            infoWindowRef.current.setContent(loadingDomStr);

            const res = await getDeviceTypeReportByRoomId(_roomId);
            const _tunnelId = evt.geometry.properties.parentId;
            const dynamicDomStr = generateDomStr(_roomName, res, _roomId, _tunnelId);
            infoWindowRef.current.setContent(dynamicDomStr);
        }
    }, [])
    // 标记
    const initMarkers = useCallback(() => {
        // 先初始化出图层
        if (TMap && myMap) {
            if (!markerLayerRef.current) {
                markerLayerRef.current = new TMap.MultiMarker({
                    // id:
                    map: myMap,  //指定地图容器
                    // enableCollision: true,
                    //样式自定义
                    styles: {
                        blueMarker: new TMap.MarkerStyle({
                            direction: 'top', // 标注点文本标记

                            width: 20,  // 点标记样式宽度（像素）
                            height: 30, // 点标记样式高度（像素）
                            // src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png",  //图片路径，不设置会使用腾讯地图默认的红标
                            src: "./markerDefault.png",  //图片路径，不设置会使用腾讯地图默认的红标
                            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
                            anchor: { x: 10, y: 30 }
                        }),
                        // TODO: 换成红标记图片
                        redMarker: new TMap.MarkerStyle({
                            direction: 'top', // 标注点文本标记
                            width: 20,  // 点标记样式宽度（像素）
                            height: 30, // 点标记样式高度（像素）
                            //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
                            anchor: { x: 10, y: 30 }
                        }),
                    },
                    //点标记数据数组
                    geometries: [],
                });
                // 标记点击事件
                markerLayerRef.current.on("click", handleMarkerClick)
                // console.log('===初始化标记点图层===完毕：', markerLayerRef.current);
            }
            // 添加初始化标记点
            const makerGeometries = initMakerPoints
                ? initMakerPoints.map(item => {
                    return {
                        id: getUUID(),
                        // content: item.name,
                        styleId: 'blueMarker',
                        position: new TMap.LatLng(item.lat, item.lng),
                        properties: {
                            title: "currentMarker",
                            roomId: item.id,
                            roomName: item.name,
                            parentId: item.parentId,
                        }
                    }
                })
                : [];
            // 当前标记：红色显眼
            if (propsCurMaker) {
                makerGeometries.push({
                    id: CURRENT_MAKER_ID,
                    styleId: 'redMarker',
                    position: new TMap.LatLng(propsCurMaker.lat, propsCurMaker.lng),
                    properties: {
                        title: "defaultMarker"
                    }
                });
                currentMarkerId.current = CURRENT_MAKER_ID;
            }

            if (markerLayerRef.current) {
                markerLayerRef.current.setGeometries(makerGeometries);
            }

            // console.log('===初始化标记点===完毕：', makerGeometries);
        }

    }, [TMap, handleMarkerClick, initMakerPoints, myMap, propsCurMaker])

    // 标记点label
    const initLabel = useCallback(() => {
        if (myMap && TMap) {
            if (!labelLayerRef.current) {
                labelLayerRef.current = new TMap.MultiLabel({
                    id: 'label-layer',
                    map: myMap,
                    enableCollision: true,
                    styles: {
                        // @ts-ignore
                        label: new TMap.LabelStyle({
                            color: '#3777FF', // 颜色属性
                            size: 12, // 文字大小属性
                            offset: { x: 0, y: -40 }, // 文字偏移属性单位为像素
                            angle: 0, // 文字旋转属性
                            alignment: 'center', // 文字水平对齐属性
                            verticalAlignment: 'middle' // 文字垂直对齐属性
                        })
                    },
                    geometries: []
                });
                // console.log('===初始化Label图层===完毕：', labelLayerRef.current);
            }

            // Label初始化
            const labelGeometries = initMakerPoints
                ? initMakerPoints.map(item => {
                    return {
                        id: getUUID(),
                        styleId: 'label',
                        content: item.name,
                        position: new TMap.LatLng(item.lat, item.lng),
                        properties: {
                            title: "label",
                        }
                    }
                })
                : [];
            if (labelLayerRef.current) {
                labelLayerRef.current.setGeometries(labelGeometries);
            }


            // labelLayerRef.current?.setVisible(false);
        }
    }, [TMap, initMakerPoints, myMap])

    // 折线
    const initPloylines = useCallback(() => {
        if (TMap && myMap && !polylineRef.current) {
            if (initPolylines) {
                const geometries = initPolylines.map(item => {
                    return {
                        id: getUUID(),
                        styleId: 'style_red',
                        paths: item.map(_point => getLatLng(_point.lat, _point.lng)),
                    }
                })
                polylineRef.current = new TMap.MultiPolyline({
                    id: 'polyline-layer', //图层唯一标识
                    map: myMap,//绘制到目标地图
                    styles: {
                        style_red: new TMap.PolylineStyle({
                            color: '#CC0000', //线填充色
                            width: 6, //折线宽度
                            lineCap: 'round' //线端头方式
                        })
                    },
                    //折线数据定义
                    geometries: geometries,
                });
                // console.log('===初始化折线===完毕');
            }
        }
    }, [TMap, getLatLng, initPolylines, myMap])



    // 信息窗体
    const initInfoWindow = useCallback(() => {
        if (myMap && TMap && !infoWindowRef.current) {
            infoWindowRef.current = new TMap.InfoWindow({
                map: myMap,
                position: new TMap.LatLng(36.984104, 119.307503),
                offset: { x: 0, y: -32 }, //设置信息窗相对position偏移像素
                enableCustom: true,
                content: "<div></div>",
            });
            infoWindowRef.current.close();//初始关闭信息窗关闭
            // }
            // console.log('===初始化标记点上的信息窗口===完毕');

        }
    }, [TMap, myMap])

    // 获取行政区划数据
    const getDistrictData = useCallback(async (provinceName, cityName) => {
        const findDistrictByName = (districtList, name) => {
            return districtList.find((item) => item.name === name);
        };

        const getDistrictChildren = async (parentId) => {
            const res = await districtRef.current.getChildren({ id: parentId });
            return res && res.result ? res.result[0] : null;
        };

        try {
            districtRef.current = new TMap.service.District();
            if (districtRef.current) {
                const res = await districtRef.current.getChildren();
                if (res && res.result) {
                    const province = findDistrictByName(res.result[0], provinceName);
                    if (province) {
                        const city = findDistrictByName(await getDistrictChildren(province.id), cityName);
                        if (city) {
                            const _cityList = await getDistrictChildren(city.id);
                            if (_cityList) {
                                setCityList(_cityList);
                                // console.log('-----行政区划新-------', _cityList);
                            }
                        } else {
                            console.log(`无法找到${cityName}`);
                        }
                    } else {
                        console.log(`无法找到${provinceName}`);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [TMap, setCityList]);

    // 初始化行政区划，获取城市列表，一层层找
    const initDistrict = useCallback(async () => {
        if (myMap && TMap && !districtRef.current) {
            getDistrictData('江苏', '泰州');
        }
    }, [TMap, getDistrictData, myMap])

    const initMapData = useCallback(() => {
        const origin = initCenter || defaultCenter;
        try {
            if (myMap && TMap) {
                // console.log('!!地图创建完成!!', 'TMap:', TMap, 'myMap:', myMap);
                myMap.setCenter(origin)
                initInfoWindow();
                initMarkers();
                initLabel();
                initPloylines();
                showSearchBar && initDistrict();
            } else {
                // console.log('地图未创建完成', 'TMap:', TMap, 'myMap:', myMap);
            }
        } catch (error) {
            console.log('初始化地图页错误：', error);
        }
    }, [initCenter, myMap, TMap, initInfoWindow, initMarkers, initLabel, initPloylines, showSearchBar, initDistrict])

    const getMapInstance = useCallback(() => {
        //定义地图中心点坐标
        if (TMap && !isCreatedMyMap.current) {
            // console.log('getMapInstance');

            let center = new TMap.LatLng(defaultCenter.lat, defaultCenter.lng)
            let myOptions = {
                zoom: 18,
                minZoom: 10,
                center
            };
            let dom = document.getElementById('my-map')
            //创建地图，绑定dom
            const map = new TMap.Map(dom, myOptions);
            isCreatedMyMap.current = true;
            // 如果传入加marker函数，才绑定此功能
            if (onAddMarker) {
                map.on("click", onClickMap);
            }
            setMyMap(map) // state为了响应
            console.log('生成地图实例并挂载到DOM-----完毕');

        }
    }, [TMap, onAddMarker, onClickMap])

    useEffect(() => {
        try {
            getMapInstance()
        } catch (error) {
            console.log('获取地图实例错误：', error);
        }
        return () => {
            if (myMap) {
                console.log('销毁地图');
                myMap.destroy();
                setMyMap(null);
            }
        }
    }, [getMapInstance, myMap])

    useEffect(() => {
        initMapData()
    }, [initMapData])

    useEffect(() => {
        // TODO 设置collisionOptions方式要改变
        myMap?.on('zoom', () => {
            const zoom = myMap?.getZoom();
            if (zoom < 15) {
                labelLayerRef.current?.setVisible(false);
            } else if (zoom >= 15 && zoom < 19.5) {
                labelLayerRef.current?.setVisible(true);
                if (labelLayerRef.current?.collisionOptions?.sameSource !== undefined) {
                    !labelLayerRef.current.collisionOptions.sameSource && (labelLayerRef.current.collisionOptions.sameSource = true);
                }
            } else if (zoom >= 19.5) {
                if (labelLayerRef.current?.collisionOptions?.sameSource !== undefined) {
                    labelLayerRef.current.collisionOptions.sameSource && (labelLayerRef.current.collisionOptions.sameSource = false);
                }
            }
            // if (zoom < 19.5) {
            //     if (markerLayerRef.current?.collisionOptions?.sameSource !== undefined) {
            //         !markerLayerRef.current.collisionOptions.sameSource && (markerLayerRef.current.collisionOptions.sameSource = true);
            //     }
            // } else {
            //     if (markerLayerRef.current?.collisionOptions?.sameSource !== undefined) {
            //         markerLayerRef.current.collisionOptions.sameSource && (markerLayerRef.current.collisionOptions.sameSource = false);
            //     }
            // }
        });
        return () => {
            myMap?.on('off', () => { });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myMap]);

    const handleSelectCityName = useCallback((_name: string) => {
        const _data = cityList.find(item => item.fullname === _name);
        if (_data) {
            const { lat, lng } = _data.location;
            myMap.setCenter(getLatLng(lat, lng));
        }
    }, [cityList, getLatLng, myMap])
    return useMemo(() => {
        const suggestOptions = suggestionList.map((item: any) => {
            return {
                label: item.title,
                value: item,
            }
        })
        // console.log('*******渲染地图页面*******');
        return (
            <div className='qq-map-wrap'>
                {showSearchBar && <div className="qq-map-search-bar-wrap">
                    <SearchBar
                        cityList={cityList}
                        keyword={keyword}
                        handleSelectCityName={handleSelectCityName}
                        searchHandle={searchHandle}
                        suggestionList={suggestionList}
                        selectSuggestionHandle={selectSuggestionHandle}
                    />
                </div>}
                <div id="my-map" style={{ width: '100%', height: height }}>
                </div>
            </div>
        );
    }, [cityList, handleSelectCityName, height, keyword, searchHandle, selectSuggestionHandle, showSearchBar, suggestionList]);
}
export default QQMap;
