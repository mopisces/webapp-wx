const http = uni.$u.http
//获取订单详情
export const getOrderDetail = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/pub/order/getOrderDetail', 
	params
)