import { useAsyncFn } from 'react-use';
import { useCallback, useEffect, useMemo } from 'react';
import { IArchitecture, getArchitectureAll } from '@/model/architecture';
import axios from '@/model/axios';
import * as url from '@model/url';
import { getUserLogin } from '@/model/user';
import { getDeviceList } from '@/model/device';

export enum EArchitectureType {
    city = 'CITY',
    tunnel = 'TUNNEL',
    room = 'ROOM',
}
const getDescriptions = (_index, _count) => {
    const _desc = [
        `隧道位于泰州市海陵区永定快速路，桩号K6+830-K7+873，全长1043m，暗埋段680m，设计时速80公里每小时，双向六车道。`,
        `隧道位于泰州市海陵区永定快速路，桩号K5+782-K6+294，全长512m，暗埋段160m，设计时速80公里每小时，双向六车道。`,
        `隧道位于泰州市高港区东风南路，桩号K6+830-K7+320，全长490m，暗埋段130m，设计时速80公里每小时，双向六车道。`,
    ]
    return _desc[_index] + `现有机电设备${ _count }台，设备完好率100 %。`
}
export const useArchitecture = () => {

    const [archAll, getArchAll] = useAsyncFn(() => {
        return axios.get(`${url.architectureAll}`).then((res: IArchitecture) => {
            return res;
        }).catch((error: any) => {
            return Promise.resolve(null);
        })
    }, []);

    // const [tunnelDeviceCount, getTunnelDeviceCount] = useAsyncFn((_tunnelId) => {
    //     return getDeviceList({ tunnelId: _tunnelId }).then((res: any) => {
    //         return res?.total;
    //     }).catch((error: any) => {
    //         return Promise.resolve(null);
    //     })
    // }, []);

    useEffect(() => {
        getArchAll();
    }, [getArchAll]);

    // 所有隧道信息
    const tunnels = useMemo(() => {
        // console.log('value:', archAll.value);

        return archAll.value ? (archAll.value)?.children : [];
    }, [archAll.value]);

    // 获取某一隧道下的所有房间
    const getRooms = useCallback((tunnelId: string) => {
        const selectTunnel = tunnels?.find((item) => item.id == tunnelId);
        if (!selectTunnel) return [];
        else return selectTunnel?.children;
    }, [tunnels]);

    // 获取隧道下拉列表项
    const tunnelOptions = useMemo(() => {
        return tunnels?.map(item => {
            return {
                text: item.name,
                value: `${item.id}`,
            }
        })
    }, [tunnels]);

    const getTunnelDeviceCount = useCallback((_tunnelId) => {
        return getDeviceList({
            tunnelId: _tunnelId,
        }).then((_res:any) => {
            return _res.total;
        }).catch((error: any) => {
            console.log(error);
            return Promise.resolve(null);
        })
        
    }, []);
    // 获取隧道描述信息
    const getTunnelsInfo = useCallback(async () => {
        const arr = tunnels || [];
        const resultArray: any[] = [];

        await Promise.all(arr.map(async (_item, _index) => {
            const _count = await getTunnelDeviceCount(_item.id);
            resultArray.push({
                text: _item.name,
                value: `${_item.id}`,
                desc: getDescriptions(_index, _count),
             });
        }));

        return resultArray;

    }, [getTunnelDeviceCount, tunnels]);

    // 获取某一隧道下房间的下拉列表项
    const getRoomsOptions = useCallback((tunnelId: string) => {
        const _rooms = getRooms(tunnelId);
        return _rooms?.map((item) => {
            return {
                text: item.name,
                value: `${item.id}`,
            }
        });
    }, [getRooms]);

    // 获取某一房间同一隧道下的的所有兄弟房间，不包含它自己
    const getSilblingRooms = useCallback((_roomId: string, _tunnelId: number) => {
        const _tunnels = archAll.value?.children?.filter(item => item.id == _tunnelId as any); // TODO:number string 模糊相等
        if (_tunnels?.length) {
            // return _tunnels[0].children?.filter(item => item.id !== _roomId);
            return _tunnels[0].children?.filter(item => {
                return item.id !== _roomId
                
            });
        }
        return null;
    }, [archAll.value?.children])

    // 获取某一隧道经纬度数据
    const getTunnelLineById = useCallback(( _tunnelId: number) => {
        const _tunnel = tunnels?.find(item => item.id == _tunnelId as any); // TODO:number string 模糊相等
        if (_tunnel) {
            const _lines: { lat: number, lng: number }[][] = []; // 多段
            if (_tunnel.latLngs && _tunnel.latLngs.length) {
                _tunnel.latLngs.forEach(_item => {
                    _lines.push([_item.from, _item.to]);
                })
            }
            return _lines
        }
        return []
    }, [tunnels])

    // 获取某一隧道经纬度
    const getTunnelLatLng = useCallback((_tunnel: IArchitecture) => {
        // return _tunnel.latLngs?.[0] ? _tunnel.latLngs[0].from : null
        return _tunnel ? {
            lat: _tunnel.lat,
            lng: _tunnel.lng,
        } : null;
    }, [])
    
    return useMemo(() => {
        // console.log(tunnels);

        return {
            tunnelOptions,
            getRoomsOptions,
            getSilblingRooms,
            archiData: archAll.value,
            getArchiData: getArchAll,
            getTunnelLatLng,
            getTunnelsInfo,
            getTunnelDeviceCount,
            getTunnelLineById,
            // getTunnelInfo,
            // getRoomsInfo
        }
    }, [archAll.value, getArchAll, getRoomsOptions, getSilblingRooms, getTunnelDeviceCount, getTunnelLatLng, getTunnelLineById, getTunnelsInfo, tunnelOptions])
}
