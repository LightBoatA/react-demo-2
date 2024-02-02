import { useAsyncFn } from 'react-use';
import { useEffect, useMemo } from 'react';
import axios from '@/model/axios';
import * as url from '@model/url';

enum EArchitectureType {
    city = 'CITY',
    tunnel = 'TUNNEL',
    room = 'ROOM',
}
interface IArchitecture {
    id: number;
    parentId: number;
    name: string;
    lat: number;
    lng: number;
    type: EArchitectureType;
    children: IArchitecture[];
}
export const useDeviceType = () => {

    const [data, getData] = useAsyncFn(() => {
        return axios.get(url.deviceTypeAll).then((res: any) => {
            return res;
        }).catch((error: any) => {
            return Promise.resolve([]);
        })
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    // 获取下拉列表项
    const deviceTypeOptions = useMemo(() => {
        return data?.value?.map(item => {
            return {
                text: item.name,
                value: `${item.id}`,
            }
        })
    }, [data?.value]);


    return useMemo(() => {
        return {
            deviceTypeOptions
        }
    }, [deviceTypeOptions])
}
