// 不显示菜单导航的页面路径
export const hiddenMenuPaths = ['/home'];

// 是否不显示导航栏
export const isShowMenuNav = (_pathname: string) => {
    return !hiddenMenuPaths.some(path => _pathname.startsWith(path));
}