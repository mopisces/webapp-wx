const http = uni.$u.http

//我的工具模块
//客户查询列表
export const fetchCustomerInfoList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/customer/fetchList',
	params
)
//库区面积列表
export const fetchDeliveryAreaList = () =>  http.post(
	'https://lpkj.leaper.ltd:50006/tool/deliveryArea/fetchList',
)
//生产分析总计列表
export const fetchProInfoList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/proInfo/fetchList',
	params
)
