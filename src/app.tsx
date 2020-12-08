import '@tarojs/async-await';
import Taro, { Component, Config } from '@tarojs/taro';
import { Provider } from '@tarojs/mobx';
import Login from '@/pages/login/login';

import appStore, { IUserInfo } from './store/app';

import service from '@/libs/service';
import { refresh } from '@/api/user';
import './app.less';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
    appStore
};

class App extends Component {
    config: Config = {
        pages: [
            'pages/login/login',
            'pages/home/home',
        ],
        window: {
            backgroundTextStyle: 'dark',
            navigationBarTitleText: 'mini program',
            navigationStyle: 'default',
            navigationBarBackgroundColor: '#f7f9ff',
            navigationBarTextStyle: 'black'
        }
    };

    componentWillMount() {
        Promise.all([
            Taro.checkSession(),
        ])
            .then(values => {
                service.setToken((values[1] as any).data);
                appStore.setUserInfo((values[2] as any).data as IUserInfo);
                // this.refreshStatus();
                Taro.navigateTo({
                    url:'pages/home/home'
                })
            })
    }

    refreshStatus() {
        Taro.checkSession().catch(() => Taro.login().then(refresh));
    }

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return (
            <Provider store={store}>
                <Login appStore={appStore} />
            </Provider>
        );
    }
}

Taro.render(<App />, document.getElementById('app'));
