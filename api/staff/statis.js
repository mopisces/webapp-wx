const http = uni.$u.http

//统计模块
//退货统计列表
export const fetchReturnList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/statis/return/fetchList',
	params
)
//库存统计列表
export const fetchStockList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/statis/stock/fetchList',
	params
)

//统计订单列表
export const fetchStatisOrderList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/statis/order/fetchList', 
	params
)

//传单统计列表
export const fetchSchSumList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/statis/sch/fetchList', 
	params
)

//接单统计列表
export const fetchSaleStatisList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/statis/sale/fetchList', 
	params
)

//订单统计1列表
export const fetchOrdSum1List = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/statis/ordSum1/fetchList', 
	params
)

//订单统计2列表
export const fetchOrdSum2List = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/statis/ordSum2/fetchList', 
	params
)