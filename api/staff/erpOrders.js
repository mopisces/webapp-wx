const http = uni.$u.http

//erp订单模块
export const getErpConfig = (params, config = {}) => http.post('https://lpkj.leaper.ltd:50006/erp/erp/getErpConfig')

export const getErpOrders = (params, config = {}) => http.post('https://lpkj.leaper.ltd:50006/erp/erp/getErpOrders', params)

