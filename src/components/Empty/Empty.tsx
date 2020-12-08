import Taro from '@tarojs/taro';
import { Image, View } from '@tarojs/components';

import './Empty.less';

import iconEmpty from './empty.png';

interface IProps {
    description?: string,
    image?: boolean | string
}

export default function Empty(props: IProps) {
    return (
        <View className='empty'>
            {props.image !== false && <Image src={props.image || iconEmpty} mode='aspectFit' />}
            <View>{props.description || '暂无数据'}</View>
        </View>
    );
}
