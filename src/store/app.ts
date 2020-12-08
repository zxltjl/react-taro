import { observable } from 'mobx';

export interface IUserInfo {
    nickname?: string,
    lowDiscount?: number,
    limit?: number | undefined,
    role?: string
}

export interface AppStore {
    token: string;
    userInfo: IUserInfo;
    setToken: (token: string | undefined) => void;
    setUserInfo: (userInfo: IUserInfo) => void;
}

const appStore: AppStore = observable({
    token: '',
    userInfo: {},
    setToken(token) {
        this.token = token;
    },
    setUserInfo(userInfo) {
        this.userInfo = userInfo;
    }
});

export default appStore;
