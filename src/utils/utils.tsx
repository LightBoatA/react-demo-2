import { Button, Select, Space, Image } from "antd";
import { IAction } from "./type";
import React from 'react';
import { DEVELOP_ADDRESS, EMPTY_REPLACE, IMG_SRC_PREFIX, PROD_ADDRESS, QA_ADDRESS, TEST_ADDRESS } from "./constant";
import { json2csv } from 'json-2-csv';


const { Option } = Select;

export const dateFormat = (dateFrom: number | string, format = 'yyyy-MM-dd hh:mm:ss') => {
    if (!dateFrom || dateFrom === 0 || dateFrom === '') {
        return '';
    }
    const iso8601Regex = /T|Z/;
    // const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{6})Z$/;
    if ((Object.prototype.toString.call(dateFrom) === '[object String]') && !iso8601Regex.test(dateFrom as string)) {
        dateFrom = dateFrom.toString().replace(/-/g, '/');
    }
    const date = new Date(dateFrom);
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    Object.keys(o).forEach(k => {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
        }
    });
    return format;
};

// blob文件下载
export const saveBlobToFile = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
}

/**
 * 数组去重
 */
export const uniqueArr = (arr, key) => {
    const obj = {};
    const result: any = [];
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i][key]]) {
            result.push(arr[i]);
            obj[arr[i][key]] = true;
        }
    }
    return result;
};

/**
 * 过滤数组
 */
export const filterArrUnique = (arrData, key) => {
    const obj = {};
    const newArr = arrData.reduce((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        obj[b[key]] ? '' : (obj[b[key]] = true) && a.push(b);
        return a;
    }, []);
    return newArr;
};

export const isVoid = (val: unknown) => {
    return val === undefined || val === null || val === '';
};

export const cleanObject = (obj: { [key: string]: unknown }) => {
    const result = { ...obj };
    Object.keys(result).forEach(key => {
        const val = result[key];
        if (isVoid(val)) {
            delete result[key];
        }
    });
    return result;
};

/**
 * 数组对象查找某个值
 */
export const findValueObj = (arr, key, value) => {
    if (!(arr && Array.isArray(arr))) {
        return -1;
    }
    const obj = arr.find(item => {
        return item[key] === value;
    });
    return obj;
};
/**
 * 生成随机ID
 */
export const getUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * 生成表格操作列
 */
export const getActionCol = (actions: IAction[], colWidth = 180) => {
    return {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        width: colWidth,
        render: (_, record) => {
            const actionsBtns = actions.map(action => {
                return (
                    <Button
                        key={getUUID()}
                        type="link"
                        disabled={action.disabled}
                        danger={action.danger}
                        onClick={() => { action.handler(record) }}
                        style={{ paddingLeft: 5, paddingRight: 5 } }
                    >{action.text}</Button>
                )
            })
            return (<Space>{actionsBtns}</Space>)
        }
    }
}

// 为表格数据添加key
export const addKeyForData = (data: any[]) => {
    return data.map(item => {
        return {
            ...item,
            key: getUUID(),
        }
    })
}
// 生成antd Options
export const getSelectOptions = (ops: { value: any, text: string }[]) => {
    return ops.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)
}


/**
 * 将post请求对象换成get形式拼接到url上
*/
export const changeParam = (param) => {
    param = cleanObject(param)
    if (!param) {
        return '';
    }

    if (Object.prototype.toString.call(param) === '[object Object]' && Object.keys(param).length === 0) {
        return '';
    }

    //   return JSON.stringify(param).replace(/:/g,'=').replace(/,/g,'&').replace(/{/g,'?')
    // .replace(/}/g,'')
    // .replace(/"/g,'');
    const params: any = [];

    Object.keys(param).forEach((key) => {
        let value = param[key]
        // 如果值为undefined我们将其置空
        if (typeof value === 'undefined') {
            value = ''
        }
        // 对于需要编码的文本（比如说中文）我们要进行编码
        params.push([key, value].join('='))
    })
    return `?${params.join('&')}`;
}

// 删除对象中值为空的键
export const deleteEmptyKey = (obj) => {
    for (let key in obj) {
        if (!obj[key]) {
            delete obj[key];
        }
    }
    return obj;
}

export const getImageSrcPrefix = () => {
    let addr = '';
    // console.log('当前环境：', process.env.NODE_ENV);
    
    switch (process.env.NODE_ENV as any) {
        case 'development':
            addr += DEVELOP_ADDRESS;
            break;
        case 'test':
            addr += TEST_ADDRESS;
            break;
        case 'qa':
            addr += QA_ADDRESS;
            break;
        case 'production':
            addr += PROD_ADDRESS;
            break;
        default:
            addr += PROD_ADDRESS;
            break;
    }
    return addr += '/file/';
}
// 图片显示处理
export const getImages = (attachments) => {
    return attachments && attachments.length
        ? attachments.map(item => {
            return <span className='mr5'>
                <Image src={`${getImageSrcPrefix()}${item.location}`} className='img-s' style={{ width: 75, height: 74 }} />
                {/* <Image src={`${IMG_SRC_PREFIX}${item.location}`} className='img-s' style={{ width: 75, height: 74 }} /> */}
            </span>
        })
        : '无';
}
export const formatNumber = (num) => {
    return Number(num).toLocaleString()
}
// csv导出
export const exportCsv = (fileName: String, data, cb) => {
    json2csv(data).then(value => {
        const blob = new Blob([value], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName + ".csv";
        link.click();
        URL.revokeObjectURL(url);
        cb();
    }).catch((error) => {
        console.log(error);
        cb();
    });
}

// 空转 -- 或者0
export const emptyFormat = (text?: string | number, isToZero = false) => {
    if (isToZero) {
        return text || '0';
    }
    return text || EMPTY_REPLACE;
};

// 构建查询参数
export const buildQueryString = (params) => {
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    return queryString.length > 0 ? `?${queryString}` : '';
};

// 防抖
export const debounce = (fn, delay = 500) => {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};


