const http = uni.$u.http

//客户每日送货--获取客户、员工及客户列表
export const fetchCusList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/common/customer/fetchList', 
	params
)

//页面参数
export const getWebConfig = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/common/param/getWebConfig',
	params
)