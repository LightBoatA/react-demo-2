import React, { useEffect, useMemo, useState } from 'react';
import './index.less';
import HeaderLayout from '@/components/HeaderLayout';
import { useRouter } from 'ym-web-view';
import QQMap from '@/components/QQMap';
import { useArchitecture } from '@/hooks/useArchitecture';
import { IArchitecture } from '@/model/architecture';
interface IProps {
}
export const MapPage: React.FC<IProps> = props => {
    const { history, match } = useRouter();
    const { params } = match;
    // @ts-ignore
    const { id } = params;

    const { archiData, getTunnelLatLng } = useArchitecture();
    // const curTunnelRef = useRef<IArchitecture | null>(null);
    const [curTunnel, setCurTunnel] = useState<IArchitecture | null>(null);

    useEffect(() => {
        if (archiData && archiData.children) {
            const _obj = archiData.children.find(item => item.id == id);
            if (_obj) {
                setCurTunnel(_obj);
            }
        }
    }, [archiData, id])

    const mapCenter = useMemo(() => { 
            return curTunnel ? getTunnelLatLng(curTunnel) : null;
    }, [curTunnel, getTunnelLatLng]);

    const roomMarkerPoints = useMemo(() => { 
        if (archiData && archiData.children) {
            const _tunnels = archiData.children;
            const _allRooms: IArchitecture[] = [];
            _tunnels.forEach(item => {
                if (item.children) {
                    _allRooms.push(...item.children)
                }
            }, [])
            // console.log('外层传入的房间数据：========', _allRooms);

            return _allRooms;
        } else return null;
    }, [archiData]);

    const polylines = useMemo(() => {
        if (archiData && archiData.children) {
            const _tunnels = archiData.children;
            const _lines: { lat: number, lng: number }[][] = []; // 多段
            _tunnels.forEach(item => {
                if (item.latLngs && item.latLngs.length) {
                    item.latLngs.forEach(_item => {
                        _lines.push([_item.from, _item.to]); 
                    })
                }
            })
            // console.log('隧道折线数据：========', _lines);
            return _lines;
        } else return null;
     }, [archiData]);
    // const mapCenter = useMemo(() => { }, []);
    return useMemo(() => {
        return (
            <HeaderLayout
                children={
                    <div className='page-dashboard  '>
                        <div className="map">
                            <QQMap
                                // 地图初始中心点取隧道第一截的头坐标
                                tunnelId={id}
                                initCenter={mapCenter}
                                initMakerPoints={roomMarkerPoints}
                                initPolylines={polylines}
                            // curMaker={initMarker}
                            // onAddMarker={handleAddMaker}
                            />
                        </div>
                    </div>
                }
            />
        )
    }, [id, mapCenter, polylines, roomMarkerPoints])

}

export default MapPage;
