import Taro, { Component } from '@tarojs/taro';
import { Image, View } from '@tarojs/components';

import logoSwan from '@/assets/img/logo_swan.png';
import logoSwanOrange from '@/assets/img/logo_swan_orange.png';

import './LogoHeader.less';

interface IProps {
    color?: 'blue' | 'orange'
}

interface IState {
    statusBarHeight: number,
    color?: 'blue' | 'orange'
}

export default class LogoHeader extends Component<IProps, IState> {
    static options = {
        addGlobalClass: true
    };

    static colorMap = {
        blue: {
            bg: 'linear-gradient(rgba(85, 255, 248, 1), rgba(65, 127, 241, 1))',
            logo: logoSwan,
        },
        orange: {
            bg: 'linear-gradient(rgba(254,203,64,1), rgba(254,135,27,1))',
            logo: logoSwanOrange
        }
    };

    state = {
        statusBarHeight: 24
    };

    componentWillMount() {
        Taro.getSystemInfo().then(res => this.setState({
            statusBarHeight: res.statusBarHeight
        }));
    }

    render() {
        const { statusBarHeight } = this.state;
        const colorData = LogoHeader.colorMap[this.props.color || 'blue'];

        return (
            <View
                style={{ background: colorData.bg, height: 380 + statusBarHeight + 'rpx' }}
                className='logo-header'
            >
                <Image src={colorData.logo} mode='aspectFit' className='logo-header-image' />
                <View />
                <View />
                <View />
                <View />
                <View />
                <View style={{ position: 'relative', marginTop: statusBarHeight + 'rpx' }}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}
