import React, { useCallback, useMemo, useRef, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { Button, Col, ConfigProvider, Form, Input, Modal, Row, Space, Tree, Typography, message } from 'antd';
import { EArchitectureType, useArchitecture } from '@/hooks/useArchitecture';
import { DataNode } from 'antd/es/tree';
import CustomMap from '@/components/CustomMap';
import { useForm } from 'antd/lib/form/Form';
import { IArchitecture, addArchitecture, deleteArchitectureById, updateArchitectureById } from '@/model/architecture';
import ShowModalConfirm from '@/components/ShowModalConfirm';
import QQMap, { ILatLng } from '@/components/QQMap';

interface IProps {

}

enum EActionType {
    'addRoom',
    'editRoom',
    'deleteRoom',
    'addTunnel',
    'editTunnel',
    'none', // 无动作
}
export const Build: React.FC<IProps> = props => {
    // const {} = props;
    const { archiData, getArchiData, getSilblingRooms, getTunnelLatLng, getTunnelLineById } = useArchitecture();
    const [selectRecord, setSelectRecord] = useState<IArchitecture | null>(null);
    const [isAddTunnelModalOpen, setIsAddTunnelModalOpen] = useState(false);
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const maker = useRef<any>(null);
    const actionType = useRef<EActionType>(EActionType.none);
    const [form] = useForm();

    // 打开弹框
    const openAModal = useCallback((item: IArchitecture, isEdit: boolean) => {
        form.resetFields();
        const { type, id } = item;
        switch (actionType.current) {
            case EActionType.addRoom:
                setSelectRecord(item);
                setIsAddRoomModalOpen(true);
                break;
            case EActionType.editRoom:
                form.setFieldsValue({ name: item.name })
                maker.current = { lat: item.lat, lng: item.lng };
                setSelectRecord(item)
                setIsAddRoomModalOpen(true);
                break;
            case EActionType.addTunnel:
                // setSelectRecord(item);
                // setIsAddRoomModalOpen(true);
                break;
            case EActionType.editTunnel:
                form.setFieldsValue({ name: item.name })
                setSelectRecord(item);
                setIsAddTunnelModalOpen(true);
                break;
            default:
                break;
        }
    }, [form])

    // 删除建筑
    const handleDelete = useCallback((record: any) => {
        ShowModalConfirm({
            msg: `是否确认删除房间${record.name}？`,
            okText: '确认',
            onOKCallBack: async () => {
                try {
                    await deleteArchitectureById(record.id);
                    getArchiData();
                    message.success('删除成功！');
                } catch (error) {
                    console.log(error)
                }
            }
        });
    }, [getArchiData])
    
    const getArchiRows = useCallback((item: IArchitecture) => {
        const  { type: archiType, name: title,  id = 0, } = item;
        switch (archiType) {
            case EArchitectureType.city:
                return <div className="flex flex-h-sb flex-v-center tree-row">
                    <span>{title}</span>
                    <Typography.Link
                        disabled
                         onClick={() => { 
                        actionType.current = EActionType.addTunnel;
                        openAModal(item, false) 
                        }}>
                        新增隧道
                    </Typography.Link>
                </div>
            case EArchitectureType.tunnel:
                return <div className="flex flex-h-sb  flex-v-center tree-row">
                    <span>{title}</span>
                    <Space>
                        <Typography.Link onClick={() => { 
                            actionType.current = EActionType.editTunnel;
                            openAModal(item, true) 
                            }}>
                            编辑
                        </Typography.Link>
                        <Typography.Link onClick={() => { 
                            actionType.current = EActionType.addRoom
                            openAModal(item, false) 
                        }}>
                            新增房间
                        </Typography.Link>
                    </Space>
                </div>
            case EArchitectureType.room:
                return <div className="flex flex-h-sb  flex-v-center tree-row">
                    <span>{title}</span>
                    <Space>
                        <Typography.Link onClick={() => { 
                            actionType.current = EActionType.editRoom;
                            openAModal(item, true) 
                        }}>
                            编辑
                        </Typography.Link>
                        <Typography.Link onClick={() => { 
                            actionType.current = EActionType.deleteRoom;
                            handleDelete(item)
                        }}>
                            删除
                        </Typography.Link>
                    </Space>
                </div>
            default:
                break;
        }
    }, [handleDelete, openAModal])

    // 新增标记点
    const handleAddMaker = useCallback((val: ILatLng) => {
        maker.current = val;
    }, [])

    // 新增建筑
    const handleAddArchitecture = useCallback(async () => {
        try {
            const { name } = await form.validateFields();
            const obj: IArchitecture = {
                name,
                parentId: selectRecord?.id as any,
                lat: maker.current?.lat || null,
                lng: maker.current?.lng || null,
                latLngs: [],
            }
            await addArchitecture(obj);
            message.success('提交成功！');
            setIsAddRoomModalOpen(false);
            getArchiData();
        } catch (error) {
            console.log(error);
        }
    }, [form, getArchiData, selectRecord?.id])

    const handleEditArchitecture = useCallback(async () => {
        try {
            const { name } = await form.validateFields();
            let obj: any;
            switch (actionType.current) {
                case EActionType.editTunnel:
                    obj = { name };
                    break;
                case EActionType.editRoom:
                    obj = {
                        name,
                        parentId: selectRecord?.id as any,
                        lat: maker.current?.lat || null,
                        lng: maker.current?.lng || null,
                        latLngs: [],
                    }
                    break;
                default:
                    obj = null;
                    break;
            }
            await updateArchitectureById(selectRecord?.id as any, obj);
            message.success('修改成功！');
            setIsAddRoomModalOpen(false);
            setIsAddTunnelModalOpen(false);
            getArchiData();
        } catch (error) {
            console.log(error);
        }
    }, [form, getArchiData, selectRecord?.id])
    

    // 建筑数据转换为树结构
    const getTreeData = useCallback((dataArr: IArchitecture[]) => {
        return dataArr.map((item) => ({
            title: getArchiRows(item),
            // key: item.parentId ? `${item.parentId}-${item.id}` : item.id,
            // key: item.id,
            key: item.id,
            children: item.children ? getTreeData(item.children) : [],
        }));
    }, [getArchiRows])

    // 转换后的树结构
    const treeData = useMemo(() => {
        if (archiData) {
            const archiDataArr = Array.isArray(archiData) ? archiData : [archiData];
            return getTreeData(archiDataArr);
        } else return []
    }, [archiData, getTreeData])

    // 本隧道下所有房间的标记点
    const roomMarkerPoints = useMemo(() => {
        if (selectRecord) {
            let _rooms = selectRecord?.children;
            if (selectRecord.type === EArchitectureType.room) {
                // 获取其父节点下所有兄弟房间的位置
                _rooms = getSilblingRooms(selectRecord.id as string, selectRecord.parentId as number) as IArchitecture[];
                // console.log('兄弟房间：', _rooms);
                
            }
            const points = _rooms
                    ?.filter(item => item.lat && item.lng)
                    ?.map(item => {
                        const { lat = 0, lng = 0, name } = item;
                        return {
                            name,
                            lat,
                            lng,
                        }

                    });
                return points || null;
                // 获取其父节点下所有兄弟房间的位置
            
        } else {
            return null;
        }
    }, [getSilblingRooms, selectRecord])

    // 地图的初始中心点
    const mapCenter = useMemo(() => {
        if (!selectRecord) return null;
        if (selectRecord.type === EArchitectureType.tunnel) {
            // 如果是隧道，中心点为隧道第一段的头坐标
            return getTunnelLatLng(selectRecord)
            // return selectRecord?.latLngs?.[0] ? selectRecord?.latLngs[0].from : null
        } else if (selectRecord.type === EArchitectureType.room) {
            // 如果是房间，中心点为房间坐标
            return { lat: selectRecord.lat || 0, lng: selectRecord.lng || 0 }
        }
    },[getTunnelLatLng, selectRecord])

    // 当前标记点
    const initMarker = useMemo(() => {
        if (actionType.current === EActionType.editRoom) {
            return { lat: selectRecord?.lat, lng: selectRecord?.lng }
        } else return null;
    }, [selectRecord])

    const initPolylines = useMemo(() => {
        if (!selectRecord) return null;
        let _tunnelId;
        if (selectRecord.type === EArchitectureType.tunnel) {
            _tunnelId = selectRecord.id;
        } else if (selectRecord.type === EArchitectureType.room) {
            _tunnelId = selectRecord.parentId;
        }
        const _lines = getTunnelLineById(_tunnelId);
        return _lines;
    }, [getTunnelLineById, selectRecord])

    return useMemo(() => {
        return (
            <HeaderLayout
                children={
                    <div className="page-build card pb20">
                        <div className="title">建筑管理</div>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Tree: {
                                        titleHeight: 42,
                                    },
                                },
                            }}
                        >
                            <Tree
                                showLine
                                // defaultExpandedKeys={[2]}
                                defaultExpandAll
                                // defaultExpandParent
                                autoExpandParent
                                blockNode
                                treeData={treeData}
                            />
                        </ConfigProvider>
                        {/* 新增隧道 */}
                        <Modal
                            className='add-role-modal'
                            title="编辑隧道"
                            open={isAddTunnelModalOpen}
                            width={556}
                            onCancel={() => { setIsAddTunnelModalOpen(false) }}
                            footer={[
                                <Button onClick={() => { setIsAddTunnelModalOpen(false) }}>取消</Button>,
                                <Button
                                    type="primary"
                                    onClick={handleEditArchitecture}
                                >
                                    提交
                                </Button>,
                            ]}
                        >
                            <Row>
                                <Form form={form} >
                                    <Form.Item label="隧道名称" name="name" rules={[{ required: true, message: '请输入隧道名称' }]}>
                                        <Input placeholder="请输入隧道名称" />
                                    </Form.Item>
                                </Form>
                            </Row>
                        </Modal>
                        <Modal
                            className='add-role-modal'
                            title={actionType.current === EActionType.addRoom ? '新增房间' : '编辑房间'}
                            open={isAddRoomModalOpen}
                            width={700}
                            destroyOnClose={true}
                            onCancel={() => { 
                                setIsAddRoomModalOpen(false);
                                maker.current = null;
                            }}
                            footer={[
                                <Button onClick={() => { setIsAddRoomModalOpen(false) }}>取消</Button>,
                                <Button
                                    type="primary"
                                    onClick={actionType.current === EActionType.addRoom ? handleAddArchitecture : handleEditArchitecture}
                                >
                                    提交
                                </Button>,
                            ]}
                        >
                            <Row>
                                <Form form={form}>
                                    <Form.Item label="房间名称" name="name" rules={[{ required: true, message: '请输入房间名称' }]}>
                                        <Input placeholder="请输入房间名称" />
                                    </Form.Item>
                                </Form>
                            </Row>
                            <Row>
                                <QQMap
                                    // 地图初始中心点取隧道第一截的头坐标
                                    showSearchBar={true}
                                    height={500}
                                    initCenter={mapCenter as any}
                                    initMakerPoints={roomMarkerPoints}
                                    initPolylines={initPolylines as any}
                                    curMaker={initMarker as any}
                                    onAddMarker={handleAddMaker}
                                />
                            </Row>
                        </Modal>
                    </div >
                }
            />
        );
    }, [form, handleAddArchitecture, handleAddMaker, handleEditArchitecture, initMarker, initPolylines, isAddRoomModalOpen, isAddTunnelModalOpen, mapCenter, roomMarkerPoints, treeData]);

};

export default Build;