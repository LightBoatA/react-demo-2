import { TOKEN_KEY, USERLOGININFO } from '@/utils/constant';
import { message } from 'antd';
import { RequestHelper } from 'ym-web-view';

const request = new RequestHelper('').jsonRequest();
const requestBlob = new RequestHelper('', 'blob').jsonRequest();
const requestTimeout15 = new RequestHelper('', 'json', {}, 15000).jsonRequest();
const requestFormData = new RequestHelper('', 'blob', {
  'Content-Type': 'multipart/form-data;charset=UTF-8'
}).jsonRequest();

// 针对401状态没登录进行处理
// request.setStatusCodeCallback(HttpRequestStatusCode.CODE_401, () => {
//   // TODO  删除登录态 跳转到login

// });

const formatRequest = <T>(type: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'getTimeout15', url: string, data?: any, hasMessage?: boolean, timeout?: number): Promise<T> => {
  let req;
  if (type === 'get') {
    req = request.get(url, data);
  }
  if (type === 'post') {
    req = request.post(url, data);
  }
  if (type === 'put') {
    req = request.put(url, data);
  }
  if (type === 'delete') {
    req = request.delete(url, data);
  }
  if (type === 'patch') {
    req = request.patch(url, data);
  }
  if (type === 'getTimeout15') {
    req = requestTimeout15.get(url, data);
  }
  return req
    .then(res => {
      const responseData = res.data || res;
      return responseData.data || responseData;
    })
    .catch(error => {
      // TODO 需要针对不同的业务做处理
      const _hasMessage = hasMessage || true;
      const errorData = (error.response && error.response.data) || {};
      let alertMessage = '';
      try {
        // 非登录界面 跳转到登录页
        // if (url.indexOf('/oauth2/token') === -1 && errorData.status === 401) {
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
          if (url.indexOf('/login') === -1 && (errorData.status === 401 || errorData.status === 403)) {
            setTimeout(() => {
              localStorage.removeItem(USERLOGININFO);
              window.location.reload();
            }, 100);
          }
        }
      } catch (e) {
        console.info(e);
      }
      if (_hasMessage) {
        alertMessage = errorData.msg || errorData.detail || '服务器错误或请求超时';
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
          alertMessage = '请求超时';
        }
        message.destroy();
        message.error(alertMessage);
      }
      return Promise.reject(error);
    });
};

const get = (url: string, data?: any, hasMessage?: boolean) => {
  return formatRequest('get', url, data, hasMessage);
};
const post = (url: string, data?: any, hasMessage?: boolean) => {
  return formatRequest('post', url, data, hasMessage);
};
const put = (url: string, data?: any, hasMessage?: boolean) => {
  return formatRequest('put', url, data, hasMessage);
};
const dDelete = (url: string, data?: any, hasMessage?: boolean) => {
  return formatRequest('delete', url, data, hasMessage);
};
const getTimeout15 = (url: string, data?: any, hasMessage?: boolean, timeout?: number) => {
  return formatRequest('getTimeout15', url, data, hasMessage, timeout);
};
const patch = (url: string, data?: any, hasMessage?: boolean) => {
  return formatRequest('patch', url, data, hasMessage);
};

export const axios = {
  request,
  get,
  post,
  put,
  dDelete,
  patch,
  requestBlob,
  getTimeout15,
  requestFormData
};
export default axios;
