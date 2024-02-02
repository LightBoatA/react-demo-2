export const permissions = [
    {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
            {
                title: 'Child Node1',
                value: '0-0-0',
                key: '0-0-0',
            },
        ],
    },
    {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
        children: [
            {
                title: 'Child Node3',
                value: '0-1-0',
                key: '0-1-0',
            },
            {
                title: 'Child Node4',
                value: '0-1-1',
                key: '0-1-1',
            },
            {
                title: 'Child Node5',
                value: '0-1-2',
                key: '0-1-2',
            },
        ],
    },
];

export const permissions1 = [
    {
        title: '顶级',
        value: 'all',
        key: 'all',
        children: [
            {
                title: '工作台',
                value: 'dashboard',
                key: 'dashboard',
            },
            {
                title: '设备管理',
                value: 'device',
                key: 'device',
            },
            {
                title: '报废管理',
                value: 'discard',
                key: 'discard',
            },
            {
                title: '系统管理',
                value: 'system',
                key: 'system',
                children: [
                    {
                        title: '用户管理',
                        value: 'user',
                        key: 'user',
                    },
                    {
                        title: '角色管理',
                        value: 'role',
                        key: 'role',
                    },
                    {
                        title: '建筑管理',
                        value: 'build',
                        key: 'build',
                    },
                    {
                        title: '设备类型管理',
                        value: 'deviceType',
                        key: 'deviceType',
                    },
                ],
            },
            {
                title: '小程序',
                value: 'miniProgram',
                key: 'miniProgram',
            },
        ],
    },
]