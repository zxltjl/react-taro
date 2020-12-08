import { CSSProperties } from 'react';
import Taro, { Component } from '@tarojs/taro';
import { ScrollView, View } from '@tarojs/components';

import './Card.less';

type IKey = string | number;

interface IProps {
    title?: string,
    children?: any,
    tabList?: { key: IKey, tab: string, style?: string | CSSProperties }[],
    activeKey?: IKey,
    theme?: 'blue' | 'orange',
    onChange?: (key: IKey) => void,
    renderExtra?: JSX.Element,
    cardStyle?: CSSProperties,
    bodyStyle?: CSSProperties
}

export default class Card extends Component<IProps> {
    static options = {
        addGlobalClass: true
    };

    change = (key: IKey): void => {
        if (this.props.activeKey === key) return;
        if (this.props.onChange) this.props.onChange(key);
    };

    render() {
        const { title, tabList, activeKey, theme, cardStyle, bodyStyle } = this.props;

        const titleElement = title && (
            <View className='card-title'>
                {title}
                <View className='card-extra'>
                    {this.props.renderExtra}
                </View>
            </View>
        );
        const tabElement = tabList && (<ScrollView
            scrollX
            scrollWithAnimation
            scrollIntoView={'view' + activeKey}
            className='card-tab'
        >
            <View className='card-tab-border' />
            {
                tabList.map(item =>
                    <View
                        id={'view' + item.key}
                        key={item.key}
                        onClick={this.change.bind(this, item.key)}
                        style={item.style}
                        className={
                            activeKey === item.key
                                ? `card-tab-item ${'card-tab-item-active-' + (theme || 'blue')}`
                                : 'card-tab-item'
                        }
                    >
                        {item.tab}
                    </View>
                )
            }
        </ScrollView>);

        return (
            <View className='card' style={cardStyle}>
                {titleElement}
                {tabElement}
                <View className='card-body' style={bodyStyle}>{this.props.children}</View>
            </View>
        );
    }
}
