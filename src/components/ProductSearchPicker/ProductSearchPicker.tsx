import Taro, { Component } from '@tarojs/taro';
import { PickerView, PickerViewColumn, View } from '@tarojs/components';
import { CommonEventFunction } from '@tarojs/components/types/common';

import { getCategories, getProductList, getVersionList } from '@/api/product';

import './ProductSearchPicker.less';

type list = { id: number, name: string }[];
type ChangeParams = [number, number, number];

interface IProps {
    onChange?(data: ChangeParams): void
}

interface IState {
    categoryList: list,
    productList: list,
    versionList: list
}

export default class ProductSearchPicker extends Component<IProps, IState> {
    static options = {
        addGlobalClass: true
    };

    private value: ChangeParams = [0, 0, 0];

    componentWillMount(): void {
        getCategories().then(({ data }) => this.setState({ categoryList: data }));
    }

    changeProduct: CommonEventFunction<{ value: ChangeParams }> = e => {
        const { categoryList, productList, versionList } = this.state;
        const value = e.detail.value;
        // value 为选中项的索引值结合, 修正索引（第一项被填充，需要修正）
        const newVal = value.map(item => item - 1) as ChangeParams;
        const realValue = getRealValue([categoryList, productList, versionList], newVal, 0);
        const position = compare(value, this.value);

        this.value = value;
        this.changeOtherColumns(position, realValue);
        if (this.props.onChange) this.props.onChange(realValue);
    };

    // 修改其他列的数据
    changeOtherColumns(position: number, realValue: ChangeParams): void {
        const changedId = realValue[position];
        if (position === 0) {
            this.setState({ versionList: [] });
            if (!changedId) this.setState({ productList: [] });
            else getProductList(changedId).then(({ data }) => this.setState({ productList: data }));
        }

        if (position === 1) {
            if (!changedId) this.setState({ versionList: [] });
            else getVersionList(changedId).then(({ data }) => {
                // 过滤无法使用代金券的产品版本
                const enableData = data.filter(({ enable_voucher }) => enable_voucher);
                this.setState({ versionList: enableData });
            });
        }
    }

    render() {
        const { categoryList, productList, versionList } = this.state;

        return (
            <PickerView
                value={this.value}
                className='product-search-picker'
                onChange={this.changeProduct}
            >
                <PickerViewColumn>
                    <View key={0}>全部</View>
                    {categoryList.map(item => <View key={item.id}>{item.name}</View>)}
                </PickerViewColumn>
                <PickerViewColumn>
                    <View key={0}>不限</View>
                    {productList.map(item => <View key={item.id}>{item.name}</View>)}
                </PickerViewColumn>
                <PickerViewColumn>
                    <View key={0}>不限</View>
                    {versionList.map(item => <View key={item.id}>{item.name}</View>)}
                </PickerViewColumn>
            </PickerView>
        )
    }
}

// 比较差异，返回差异值首次出现的位置
const compare = function (newVal: number[], oldVal: number[]) {
    return newVal.findIndex((v, i) => v !== oldVal[i]);
};


// 根据索引值集合（values），在 source 找出对应的 id 值集合
const getRealValue = function <T>(source: list[], values: T, initialValue: number): T {
    // @ts-ignore
    return values.map((value, index) => value > -1 ? source[index][value].id : initialValue);
};
