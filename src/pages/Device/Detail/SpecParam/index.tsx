import React, { useMemo } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Table } from 'antd';
import { columns } from './common';
import { tableTestData } from '../../common';
import { ISpecParam } from '../../Add/SpecInfo';
interface IProps {
    specData: ISpecParam[];
}
export const DeviceDetailSpec: React.FC<IProps> = props => {
    const { specData } = props;
    // const tableData = 
    return useMemo(() => {
        return (
            <div className="card mb15">
                <div className="title">规格参数</div>  
                <Table
                    columns={columns as any}
                    dataSource={specData}
                    pagination={{
                        pageSize: 3,
                    }}
                />              
            </div>
        );
    }, [specData]);

};

export default DeviceDetailSpec;