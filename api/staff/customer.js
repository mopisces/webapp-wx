const http = uni.$u.http

//客户每日送货--获取客户、员工及客户列表
export const fetchDeliveryDailyInfo = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/deliveryDaily/info', 
	params
)

export const fetchDeliveryDailyDetailDateList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/deliveryDailyDetail/dateList', 
	params
)

export const fetchDeliveryDailyDetailCusList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/deliveryDailyDetail/cusList', 
	params
)
