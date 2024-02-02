export const generateDomStr = (roomName, data, id, _tunnelId, isLoading = false) => {
    let domStr = `<div class='map-info-window'><div class='info-header'><div class='room-name flex flex-v-center'>${roomName}</div><div class='info-close-btn' onclick='handleCloseInfoWindow()'>×</div></div><ul class='info-center'>`;

    let total = 0;
    if (isLoading) {
        domStr += `<div class='no-type-tips'>数据加载中...</div>`
    } else {
        if (data.length) {
            data.forEach(item => {
                domStr += `<li class='type-name'>${item.deviceTypeName}：<span class='type-count'>${item.deviceCount}</span></li>`;
                total += item.deviceCount;
            });
        } else {
            domStr += `<div class='no-type-tips'>该房间下暂无设备</div>`
        }
    }


    domStr += `</ul><div class='flex flex-h-end'><button class='info-btn' onclick='handleToDevicePage(${id}, ${_tunnelId})'>查看全部(<span>${total}</span>)个＞</button></div></div>`;

    return domStr;
}