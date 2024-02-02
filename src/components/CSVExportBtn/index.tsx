import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from 'antd';
import { EMPTY_REPLACE } from '@/utils/constant';
import * as XLSX from 'xlsx/xlsx.mjs';
import { exportCsv } from '@/utils/utils';
import { UploadOutlined } from '@ant-design/icons';
import { getDeviceList } from '@/model/device';

interface IProps {
  // requestBody: any;
  // tSearchResult: any;
  // requestFunc: (params?: any) => void;
  requestFunc: () => Promise<any>;
  // datasource: any[];
  customCSVExportDataForamt: any;
  // databaseTableName: string;
  exportFileName: string;
  // removeParams?: string[];
}

export const CSVExportBtn:React.FC<IProps> = (props) => {
  // const { requestBody, tSearchResult, customCSVExportDataForamt, databaseTableName, exportFileName, removeParams = [] } = props;
  const { customCSVExportDataForamt, exportFileName, requestFunc } = props;
  const [isExport, setIsExport] = useState<boolean>(false);

  const formatCSVData = useCallback((data, _columns) => {
    const result: any = [];
    data.forEach((item) => {
      const obj: any = {};
      _columns?.forEach((column) => {
        obj[column.title] = column?.render ? column.render(item) : item[column.key];
        // debugger
        // console.log('看看转换结果：', obj[column.title]);
        // console.log('item', item);
        if (column?.render) {
          // console.log('column', column);
          
          // console.log('render.item', column.render(item));
        }
        
        
        if (!obj[column.title]) {
          obj[column.title] = EMPTY_REPLACE;
        }
      })
      result.push(obj);
    })
    // console.log("XLSX", XLSX)
    const ws = XLSX.utils.json_to_sheet(result);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${exportFileName}.xlsx`);
    setIsExport(false);
  }, [exportFileName])

  const handleExport = useCallback(async () => {
    try {
      setIsExport(true);
      const res = await requestFunc();
      if (res?.records?.length) {
        const columns = customCSVExportDataForamt && customCSVExportDataForamt();
        formatCSVData(res.records, columns);
      } else {
        exportCsv(exportFileName, [], () => { setIsExport(false); });
      }
    } catch (e) {
      console.log(e);
      setIsExport(false);
    }
  }, [customCSVExportDataForamt, exportFileName, formatCSVData, requestFunc])

  return useMemo(() => {
    return (
      <React.Fragment>
        <Button icon={<UploadOutlined />} loading={isExport} onClick={handleExport}>导出</Button>
      </React.Fragment>
    )
  }, [handleExport, isExport])
}

export default CSVExportBtn;