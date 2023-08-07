const http = uni.$u.http

//原纸库存模块
export const getSStockConfig = (params, config = {}) => http.post('https://lpkj.leaper.ltd:50006/paper/paper/getSStockConfig')
export const getSStock = (params, config = {} ) => http.post('https://lpkj.leaper.ltd:50006/paper/paper/getSStock',params)