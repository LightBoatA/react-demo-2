import { EArchitectureType, IArchitecture } from '@/hooks/useArchitecture';
import { Space, Typography } from 'antd';
import React from 'react';

// export const getArchiRows = (title: string, archiType: EArchitectureType, id: number) => {
//     switch (archiType) {
//         case EArchitectureType.city:
//             return <div className="flex flex-h-sb">
//                 <span>{title}</span>
//                 <Typography.Link onClick={() => {  }}>
//                     新增隧道
//                 </Typography.Link>
//             </div>
//         case EArchitectureType.tunnel:
//             return <div className="flex flex-h-sb">
//                 <span>{title}</span>
//                 <Space>
//                     <Typography.Link onClick={() => { }}>
//                         编辑
//                     </Typography.Link>
//                     <Typography.Link onClick={() => { }}>
//                         新增房间
//                     </Typography.Link>
//                 </Space>
//             </div>
//         case EArchitectureType.room:
//             return <div className="flex flex-h-sb">
//                 <span>{title}</span>
//                 <Space>
//                     <Typography.Link onClick={() => { }}>
//                         编辑
//                     </Typography.Link>
//                     <Typography.Link onClick={() => { }}>
//                         定位
//                     </Typography.Link>
//                 </Space>
//             </div>
//         default:
//             break;
//     }
// }

// export const getTreeData = (originDataArr: IArchitecture[]) => {
//     return originDataArr.map((item) => ({
//         title: getArchiRows(item.name, item.type, item.id),
//         // key: item.parentId ? `${item.parentId}-${item.id}` : item.id,
//         key: item.id,
//         children: item.children ? getTreeData(item.children) : [],
//     }));
// }
// const convertToTreeData = (data) => {
    
// };

