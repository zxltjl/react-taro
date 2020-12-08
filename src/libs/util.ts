/**
 * 数据类型校验
 * @param {*} obj 需要校验的数据，推荐同时使用第二个参数 type
 * @param {string|string[]} [type] - 目标类型，可以包含可能类型的数组
 * @returns {string|boolean} - 数据类型(全小写)或校验结果
 */
export function typeOf(obj, type: string | string[]): string | boolean {
    const toString = Object.prototype.toString;
    const result = toString.call(obj).slice(8, -1).toLowerCase();
    if (type) {
        if (typeof type === 'string') {
            return result.search(type.toLowerCase()) !== -1;
        }
        if (Array.isArray(type)) {
            return type.some(i => result.search(i.toLowerCase()) !== -1);
        }
    }
    return result;
}

const formatNumber = function (n: number): string {
    const _n = String(n);
    return _n[1] ? _n : '0' + _n;
};

/**
 * 转化为时间字符串
 * @param {Date|number} [date] - Date 对象或时间戳(ms)
 * @param {boolean} [isFull=false] - 是否为完整日期时间
 * @param {string} [connector='-'] - 连接符
 * @returns {string} - yyyy-MM-dd
 */
export function formatDate(date: Date | number = new Date(), isFull = false, connector = '-'): string {
    let __date: Date;
    if (typeOf(date, 'number')) __date = new Date(date);
    else if (typeOf(date, 'date')) __date = date as Date;
    else return '';

    let str = [__date.getFullYear(), __date.getMonth() + 1, __date.getDate()].map(formatNumber).join(connector);
    if (isFull) {
        str += ' ' + [__date.getHours(), __date.getMinutes(), __date.getSeconds()].map(formatNumber).join(':');
    }
    return str;
}

declare function setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number;

declare function clearTimeout(handle?: number): void;

/**
 * 节流函数: 执行节流期间最后一次触发的函数
 * @param {Function} fn 需要节流的函数
 * @param {number} [interval=0] 间隔 ms, 默认 0
 * @param {boolean} [resetInterval=false] 节流后是否立即重置间隔 默认 false, 设置 true 时为防抖函数
 * @returns {Function} 已节流函数
 */
export function throttle<T extends (...args: unknown[]) => any>(fn: T, interval = 300, resetInterval = false): T {
    let isFirst = true;
    let timer: number | undefined;

    return function(...rest: any[]) {
        if (isFirst && !resetInterval) {
            fn.apply(this, rest);
            isFirst = false;
            return;
        }

        if (timer) {
            if (!resetInterval) return;
            clearTimeout(timer);
            timer = undefined;
        }

        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = undefined;
            fn.apply(this, rest);
        }, interval);
    } as any;
}
