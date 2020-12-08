interface IConfig {
    [key: string]: string;
}

const config: Readonly<IConfig> = {
    /** 请求基础路径 */
    // BASE_URL: 'https://www.cwsun.cn/api/',
    BASE_URL: 'http://tame_swan_admin.cn/api/',
    /** app 标题 */
    APP_TITLE: 'Swan 业务通'
};

export default config;
