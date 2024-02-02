import { useAsyncFn } from 'react-use';
import { useCallback, useEffect, useMemo } from 'react';
import { getArchitectureAll } from '@/model/architecture';
import axios from '@/model/axios';
import * as url from '@model/url';
import { getUserLogin } from '@/model/user';
import { IDevice } from '@/model/device';
import { OBJ_TYPE } from '@/utils/constant';

export const useDevice = (id: number) => {

    const [data, getData] = useAsyncFn(() => {
        return axios.get(`${url.deviceDetail}${id}`).then((res: IDevice) => {
            return res;
        }).catch((error: any) => {
            return Promise.resolve(null);
        })
    }, []);

    // TODO: 保养和维修数据类型
    const [maintainRecordData, getMaintainRecordData] = useAsyncFn(() => {
        return axios.get(`${url.maintainRecord}?deviceId=${id}`).then((res: any) => {
            return res.records;
        }).catch((error: any) => {
            return Promise.resolve([]);
        })
    }, []);

    const [repairRecordData, getRepairRecordData] = useAsyncFn(() => {
        return axios.get(`${url.repairRecord}?deviceId=${id}`).then((res: any) => {
            return res.records;
        }).catch((error: any) => {
            return Promise.resolve([]);
        })
    }, []);

    const [discardData, getDiscardData] = useAsyncFn(() => {
        return axios.get(`${url.deviceDiscardRecord}object-${id}/object-${OBJ_TYPE}`).then((res: any) => {
            return res;
        }).catch((error: any) => {
            return Promise.resolve([]);
        })
    }, []);

    useEffect(() => {
        id && getData();
        id && getMaintainRecordData();
        id && getRepairRecordData();
        id && getDiscardData();
    }, [getData, getDiscardData, getMaintainRecordData, getRepairRecordData, id]);

    return useMemo(() => {
        return {
            deviceData: data?.value || null,
            maintainRecordData: maintainRecordData.value,
            repairRecordData: repairRecordData.value,
            discardData: discardData.value,
        }
    }, [data?.value, discardData.value, maintainRecordData.value, repairRecordData.value])
}
