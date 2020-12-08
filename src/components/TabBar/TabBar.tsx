import Taro, { Component } from '@tarojs/taro';
import { CoverImage, CoverView } from '@tarojs/components';

import './TabBar.less';

export interface ITab {
    key: number | string,
    title?: number | string,
    icon: any,
    activeIcon: any
}

interface IProps {
    tabList: ITab[],
    // 非受控组件
    defaultActiveKey?: number | string,
    // 受控组件
    activeKey?: number | string,
    onChange(key: number | string): void,
}
interface IState {
    activeTab: number | string
}

export default class TabBar extends Component<IProps, IState> {
    static options = {
        addGlobalClass: true
    };

    componentWillMount() {
        const { tabList, defaultActiveKey } = this.props;
        this.setState({
            activeTab: defaultActiveKey != null ? defaultActiveKey : (tabList[0] && tabList[0].key)
        });
    }

    changeTab = ({ target: { dataset } }): void => {
        if (dataset.key == null) return;
        const { activeTab } = this.state;
        const { activeKey } = this.props;
        if (activeKey == null) {
            if (dataset.key !== activeTab) {
                this.setState({ activeTab: dataset.key });
                this.props.onChange(dataset.key);
            }
        } else {
            if (dataset.key !== activeKey) {
                this.props.onChange(dataset.key);
            }
        }
    };

    render() {
        const { tabList, activeKey } = this.props;
        const { activeTab } = this.state;
        const _activeKey = activeKey != null ? activeKey : activeTab;
        return (
            <CoverView className='tab-bar' onClick={this.changeTab}>
                <CoverView className='tab-bar-border' />
                {

                    tabList.map(tab =>
                        <CoverView key={tab.key} className='action' data-key={tab.key}>
                            <CoverImage
                                src={_activeKey === tab.key ? tab.activeIcon : tab.icon}
                                className='tab-bar-icon'
                                data-key={tab.key}
                            />
                            <CoverView
                                className={_activeKey === tab.key ? 'text-black' : 'text-gray'}
                                data-key={tab.key}
                            >
                                {tab.title}
                            </CoverView>
                        </CoverView>
                    )
                }
            </CoverView>
        );
    }
}
