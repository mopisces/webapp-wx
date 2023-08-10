const http = uni.$u.http

//统计模块
//退货统计列表
export const fetchReturnList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/statis/return/fetchList',
	params
)


//统计订单列表
export const fetchStatisOrderList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/statis/order/fetchList', 
	params
)
