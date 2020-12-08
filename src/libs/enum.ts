// 预定义分组
export const enum PREDEFINED_GROUPING {
    admin = '管理员',
    generalAgent = '总代理商',
    regionalAgent = '地区代理商',
    sales = '销售'
}

// 关键页面路径，需要和 app.tsx 中保持一致
export const enum APP_PATH {
    login = '/pages/login/login',
    voucher = '/pages/voucher/voucher',
    discount = '/pages/discount/discount',
}
