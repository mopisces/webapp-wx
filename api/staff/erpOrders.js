const http = uni.$u.http

//erp订单模块
export const fetchList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/erp/erp/fetchList', 
	params
)

