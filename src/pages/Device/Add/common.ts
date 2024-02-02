import { IDeviceFile } from "./DeviceInfo";

export const convertFileType = (files: IDeviceFile[]) => {
    if (!files) return [];
    return files.map(item => {
        return {
            name: item.fileName,
            url: item.location,
            status: 'done',
            response: { ...item },
        }
    })
}
