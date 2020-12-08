import Taro, { Component } from '@tarojs/taro';
import { Icon, Picker, Text, View } from '@tarojs/components';
import { ITouchEvent, CommonEventFunction } from '@tarojs/components/types/common';
import { formatDate } from '@/libs/util';

import './YearSearchPicker.less';


interface IProps {
    onSearch: ({ date: string }) => void,
    onNavigate?: (e: ITouchEvent) => void,
    isNavigate?: boolean
}

interface IState {
    date: string
}

export default class YearSearchPicker extends Component<IProps, IState> {
    static options = {
        addGlobalClass: true,
    };

    change: CommonEventFunction<{value: string}> = e => {
        const value = e.detail.value;
        this.setState({ date: value });
        // setState 为异步，不会立即修改 this.state.date
        this.props.onSearch({ date: value });
    };

    navigate = (e: ITouchEvent): void => {
        e.stopPropagation();
        const onNavigate = this.props.onNavigate;
        if (onNavigate) onNavigate(e);
    };

    render() {
        const { isNavigate } = this.props;
        const { date } = this.state;
        const [year, month] = date ? date.split('-') : ['', ''];

        return (
            <View className='year-search-picker'>
                <Picker
                    mode='date'
                    onChange={this.change}
                    fields='month'
                    value={date}
                    end={formatDate()}
                >
                    <View className='picker-view'>
                        {year && month
                            ? `${year} 年 ${month} 月`
                            : <Text style='color: #b7b7b7'>请选择日期</Text>
                        }
                    </View>
                </Picker>
                {
                    isNavigate && <Icon
                        type='search'
                        color='#b7b7b7'
                        size='18'
                        className='search'
                        onClick={this.navigate}
                    />
                }
            </View>
        );
    }
}
