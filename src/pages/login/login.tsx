import Taro, { Component, Config } from '@tarojs/taro';
import { BaseEventOrig } from '@tarojs/components/types/common';
import { Button, Form, Image, Input, Text, View } from '@tarojs/components';

import { inject, observer } from '@tarojs/mobx';
import { AppStore } from '@/store/app';

import { APP_PATH, PREDEFINED_GROUPING } from '@/libs/enum';
import { throttle } from '@/libs/util';
import validate, { validateAll } from '@/libs/validate';
import service from '@/libs/service';
import { login } from '@/api/user';

import './login.less';

interface IProps {
    appStore: AppStore;
}

type IForm<T> = {
    username: T,
    password: T
}

interface IState {
    focusPwd: boolean,
    loading: boolean,
    errors: IForm<string>
}

@inject('appStore')
@observer
class Login extends Component<IProps, IState> {
    config: Config = {
        navigationStyle: 'custom',
        navigationBarTextStyle: 'white',
    };

    static readonly decorators = {
        username: [
            { pattern: /^[0-9a-zA-Z_]+$/, message: '请输入账号(字母、数字、下划线)' },
            { min: 2, max: 12, message: '2 ~ 12个字符' },
        ],
        password: [
            { message: '请输入密码' },
            { min: 6, max: 45, message: '6 ~ 45个字符' },
        ],
    };

    state = {
        focusPwd: false,
        loading: false,
        errors: {
            username: '',
            password: '',
        },
    };

    componentDidMount() {
        Taro.getSetting({
            success(res) {
                console.log(res)
              if (!res.authSetting['scope.userInfo']) { 
                Taro.authorize({
                  scope: 'scope.userInfo',  
                  success(res) {
                       console.log(res)
                  },
                  fail() {
                    // 用户点击不允许引导重新获取授权
                    console.log(2222)
                  }
                })
              }
            }
        });
        this.submit = throttle(this.submit, 200, true);
    }
    private validate = validate<string>(Login.decorators, 'errors');
    private validateAll = validateAll<IForm<string>>(Login.decorators, 'errors');

    private async submit(e: BaseEventOrig<{ value: IForm<string> }>): Promise<void> {
        const value = e.detail.value;
        if (this.state.loading || !this.validateAll(value)) return;
        this.setLoading(true);
        try {
            // const { code } = await Taro.login();
            // const res = await login({ ...value, code });
            // // 设置 token
            // service.setToken(res.access_token);
            // Taro.setStorage({ key: 'token', data: res.access_token });

            // const { role, url } = this.getRoleAndURL(res.roles);
            // // 保存用户信息
            // this.saveUserInfo(value, role);

            Login.navigate('/pages/home/home');
        } catch (err) {
            const title = err && (err.errors || err.msg);
            Taro.showToast({ title, icon: 'none', mask: true });
        }
        this.setLoading(false);
    };

    setLoading(bool: boolean): void {
        if (bool) Taro.showNavigationBarLoading();
        else Taro.hideNavigationBarLoading();
        this.setState({ loading: bool })
    }

    setFocusPwd(bool: boolean): void {
        this.setState({
            focusPwd: bool,
        })
    };

    saveUserInfo(value: IForm<string>, role?: string): void {
        const userInfo = { nickname: value.username, role };
        this.props.appStore.setUserInfo(userInfo);
        Taro.setStorage({ key: 'user-info', data: userInfo });
    }

    getRoleAndURL(roles: string[]): { url?: string, role?: string } {
        const sales = PREDEFINED_GROUPING.sales;
        const generalAgent = PREDEFINED_GROUPING.generalAgent;
        const regionalAgent = PREDEFINED_GROUPING.regionalAgent;
        let url: string | undefined;
        let userRole: string | undefined;
        roles.forEach(role => {
            if (role === sales) [url, userRole] = [APP_PATH.voucher, role];
            if (role === generalAgent || role === regionalAgent) [url, userRole] = [APP_PATH.discount, role];
        });
        return { url, role: userRole };
    };

    static navigate(url?: string): void {
        if (url) {
            Taro.redirectTo({ url });
            Taro.setStorage({ key: 'url', data: url });
        } else {
            Taro.showModal({
                title: '使用提示',
                content: '抱歉，你没有使用权限，请联系管理员',
            });
        }
    }
    
    tobegin = (res)=>{
        console.log(res)
    }
    render() {
        const { focusPwd, loading, errors } = this.state;

        return (
            <View className='login'>
                <View className='login-bg-top' />
                <Form onSubmit={this.submit.bind(this)} className='login-form'>
                    <View className='form-input'>
                        <Input
                            name='username'
                            disabled={loading}
                            onFocus={this.setFocusPwd.bind(this, false)}
                            onConfirm={this.setFocusPwd.bind(this, true)}
                            onInput={this.validate.bind(this, 'username')}
                            placeholder-class='placeholder'
                            placeholder='请输入账号'
                        />
                        <View className='form-errors'>{errors.username}</View>
                    </View>
                    <View className='form-input'>
                        <Input
                            name='password'
                            disabled={loading}
                            focus={focusPwd}
                            onInput={this.validate.bind(this, 'password')}
                            password
                            placeholder-class='placeholder'
                            placeholder='请输入密码'
                        />
                        <View className='form-errors'>{errors.password}</View>
                    </View>

                    
                    <Button
                        type="primary"
                        open-type="getUserInfo"
                        onGetUserInfo={this.tobegin}
                    >
                        <Text>授权</Text>
                    </Button>
                </Form>
            </View>
        );
    }
}

export default Login;
