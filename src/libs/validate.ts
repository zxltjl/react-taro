import { typeOf } from './util';
import { BaseEventOrig } from '@tarojs/components/types/common';

export interface Rule {
    type?: string | string[],
    message?: string,
    pattern?: RegExp,
    min?: number,
    max?: number,
}

export interface Validator {
    (value: any, rule: Rule): boolean
}

export interface Valid {
    status: boolean,
    message: string
}

export interface Decorators {
    [key: string]: Rule[]
}

interface CommonValues {
    [key: string]: any
}

export const validators: Readonly<Validator[]> = [
    (value, { type = 'string' }) => typeOf(value, type) as boolean,
    (value, { pattern }) => pattern ? pattern.test(value) : true,
    (value, { min }) => !(min != null && min > (typeof value === 'number' ? value : value.length)),
    (value, { max }) => !(max != null && max < (typeof value === 'number' ? value : value.length)),
];

// value: 表单值，rules: 自定义规则
export function validateFields(value, rules: Rule[]) {
    const valid: Valid = { status: true, message: '' };
    rules.every(rule => {
        if (validators.every(fn => fn(value, rule))) return true;
        [valid.status, valid.message] = [false, rule.message || ''];
        return false;
    });
    return valid;
}

// values: 表单数据集合，decorators: 自定义规则对象
export function validateFieldsAll<T = CommonValues>(values: T, decorators: Decorators) {
    const result = { status: true, errors: {} as { [key in keyof T]?: string } };
    Object.entries(values).forEach(([key, value]) => {
        const valid = validateFields(value, decorators[key]);
        if (!valid.status) result.status = false;
        result.errors[key] = valid.message;
    });
    return result;
}

export default function validate<T = any>(decorators: Decorators, name: string) {
    return function (key: string, e: BaseEventOrig<{ value: T }>) {
        const fields = this.state[name];
        fields[key] = validateFields(e.detail.value, decorators[key]).message;
        this.setState({ [name]: fields });
    }
}

export function validateAll<T = CommonValues>(decorators: Decorators, name: string) {
    return function (values: T): boolean {
        const { status, errors } = validateFieldsAll<T>(values, decorators);
        if (!status) return this.setState({ [name]: errors });
        return status;
    }
}
