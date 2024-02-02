import { useArchitecture } from '@/hooks/useArchitecture';
import { useDeviceType } from '@/hooks/useDeviceType';
import { searchOptionWidth } from '@/utils/constant';
import React, { useMemo, useState } from 'react';
import { IOptions, SearchBar, propertyTypeEnum } from 'ym-web-view';
import { deviceStatusOptions } from './common';
interface IProps {
    result: any
    onWatch?: (result: any) => void
}
export const DeviceSearchBar: React.FC<IProps> = props => {
    const { tunnelOptions, getRoomsOptions } = useArchitecture();
    const { deviceTypeOptions } = useDeviceType();
    const { result, onWatch } = props;
    const searchOptions = useMemo(() => {
        return [
            {
                type: propertyTypeEnum.search,
                name: 'number',
                placeholder: '请输入设备编号',
                width: searchOptionWidth,
                aliasText: 'text',
            },
            {
                type: propertyTypeEnum.search,
                name: 'name',
                placeholder: '请输入设备名称',
                width: searchOptionWidth,
                aliasText: 'text',
            },
            {
                type: propertyTypeEnum.select,
                placeholder: '请选择设备类型',
                name: 'deviceTypeId',
                aliasText: 'text',
                availableOptions: deviceTypeOptions,
                width: searchOptionWidth,
            },
            {
                type: propertyTypeEnum.select,
                placeholder: '请选择所属隧道',
                name: 'tunnelId',
                aliasText: 'text',
                availableOptions: tunnelOptions,
                width: searchOptionWidth,

            },
            {
                type: propertyTypeEnum.select,
                placeholder: '请选择所属房间',
                name: 'roomId',
                aliasText: 'text',
                availableOptions: result && result.tunnelId ? getRoomsOptions(result.tunnelId as string) : [],
                width: searchOptionWidth,
            },
            {
                type: propertyTypeEnum.select,
                placeholder: '请选择设备状态',
                name: 'status',
                aliasText: 'text',
                availableOptions: deviceStatusOptions,
                width: searchOptionWidth,
            },
        ]
    }, [deviceTypeOptions, getRoomsOptions, result, tunnelOptions])

    return useMemo(() => {
        return (
            <SearchBar
                options={searchOptions as IOptions[]}
                result={result}
                onWatch={(_result: any) => {
                    if (_result.tunnelId !== result.tunnelId) {
                        if (_result.roomId) {
                            delete _result.roomId;
                        }
                    }
                    onWatch && onWatch(_result);
                }}
                direction="left">
            </SearchBar>
        );
    }, [onWatch, result, searchOptions]);

};

export default DeviceSearchBar;
