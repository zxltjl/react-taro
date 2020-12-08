import Taro, { request } from '@tarojs/taro';
import config from '@/config';
import appStore from '@/store/app';
import { APP_PATH } from '@/libs/enum';

interface Service {
    <T = any, D = any>(options: request.Option<D>): Promise<T>,

    setToken(token: string): void,

    token?: string
}

const service: Service = function (options) {
    const auth = service.token && { Authorization: service.token };
    const requestOptions = {
        ...options,
        url: config.BASE_URL + options.url,
        header: { 'content-type': 'application/json;charset=UTF-8', ...auth, ...options.header },
        method: options.method || 'GET',
        mode: options.mode || 'cors'
    };
    return Taro.request(requestOptions).then(response => {
        replaceToken(response);
        const status = response.statusCode;
        if (status < 400) return response.data;
        if (status === 401) Taro.reLaunch({ url: APP_PATH.login });
        return Promise.reject(response.data);
    });
};

service.setToken = function (token) {
    service.token = token && `Bearer ${token}`;
    appStore.setToken(token);
};

export default service;

// 替换新 token
const replaceToken = function ({ header }: request.SuccessCallbackResult): void {
    const newToken = <string | undefined>header.Authorization;
    if (newToken) {
        const token = newToken.slice(7);
        service.setToken(token);
        Taro.setStorage({ key: 'token', data: token });
    }
};
