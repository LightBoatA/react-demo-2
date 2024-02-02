// 账户-登录
export const getOauthToken = '/oauth2/token';
// 账号- 修改密码
// export const editPassword = '/api/accounts/-:password';

// 登录
// export const login = '/login-customize';
// 账户-登录
export const getUserLogin = '/login-customize';
// 账号-获取当前登录账号详情
export const getPersonDetail = '/api/current/account';
// 账号-获取当前泰政通用户登录账号详情
export const getTaizhengtongStaffDetail = '/api/taizhengtong/staff/current';
// 账号-泰政通登录
export const taizhengtongLogin = '/public/taizhengtong/login';
// 账号- 修改密码
export const editPassword = '/api/current/account';
// 账户-列表
// export const userList = '/api/account';
export const userList = '/api/taizhengtong/staff/all';
// 账户-添加
export const userAdd = '/api/account';
// 账户-编辑
export const userEdit = '/api/account/';
// 账户-重置密码
export const userPassowrdReset = '/api/account/';
// 账户-停用
export const userStatus = '/api/account/';
// 账户-绑定角色
export const bindingRole = '/api/taizhengtong/staff/';


// 角色-列表
export const roleList = '/api/role';
// 角色-添加
export const roleAdd = '/api/role';
// 角色-编辑
export const roleEdit = '/api/role/';
// 角色-删除
export const roleDelete = '/api/role/';

// 设备-列表
export const deviceList = '/api/device';
// 设备-添加设备
export const deviceAdd = '/api/device';
// 设备-编辑
export const deviceEdit = '/api/device/';
// 设备-详情
export const deviceDetail = '/api/device/';
// 设备-保养记录
export const maintainRecord = '/api/maintenancerecord'
// 设备-维修记录
export const repairRecord = '/api/repairrecord'
// 设备-保养详情
export const maintainRecordDetail = '/api/maintenancerecord/'
// 设备-维修详情
export const repairRecordDetail = '/api/repairrecord/'
// 设备-报废信息
export const deviceDiscardRecord = '/public/workorder/'


// 设备报废-列表
export const discardList = '/api/workorder';
// 设备报废-报废登记
export const discardAdd = '/api/workorder';
// 设备报废-报废审核
export const discardExamine = '/api/workorder/';


// 设备类型-获取全部设备类型
export const deviceTypeAll = '/api/dictionary/type/all';
// 设备类型-列表
export const deviceTypeList = '/api/dictionary/type';
// 设备类型-新增
export const deviceTypeAdd = '/api/dictionary/type';
// 设备类型-修改
export const deviceTypeEdit = '/api/dictionary/type/';
// 获取某一房间下的各种设备类型数量
export const deviceTypeReport = '/api/report/architecture/';


// 建筑-获取全部建筑数据
export const architectureAll = '/public/architecture';
// 建筑-添加
export const addArchitecture = '/api/architecture';
// 建筑-修改
export const editArchitecture = '/api/architecture/';
// 建筑-删除
export const deleteArchitecture = '/api/architecture/';
