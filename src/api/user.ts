import service from '../libs/service';

export function login(data: { username: string, password: string, code: string }) {
    service.setToken('');
    return service<{ access_token: string, roles: string[], msg: string }>({
        url: 'business/login',
        method: 'POST',
        data
    });
}

// 刷新用户登录态
export function refresh(data: { code: string }) {
    return service<{msg: string}>({
        url: 'business/fresh',
        method: 'POST',
        data: { code: data.code }
    });
}
