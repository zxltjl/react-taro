import Taro,{ Component, Config } from '@tarojs/taro';
import './home.less';

class HomePage extends Component {
    config: Config = {
        navigationStyle: 'default',
    };
    render() {
        return (
            <View className='home'>
                首页
            </View>
        )
    }
}

export default HomePage;
