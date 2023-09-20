const http = uni.$u.http

//客户每日送货--获取客户、员工及客户列表
export const fetchDeliveryDailyInfo = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/deliveryDaily/info', 
	params
)
//客户每日送货--获取日期列表
export const fetchDeliveryDailyDetailDateList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/deliveryDailyDetail/dateList', 
	params
)
//客户每日送货--对应日期列表
export const fetchDeliveryDailyDetailCusList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/deliveryDailyDetail/cusList', 
	params
)
//客户往来统计--列表
export const fetchCusContactList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/frec/fetchCusContactList', 
	params
)
//客户往来统计--合计
export const getCusContactSum = () => http.post(
	'https://lpkj.leaper.ltd:50006/customer/frec/getCusContactSum' 
)
//客户往来统计--调整金额
export const updateAdjust = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/frec/updateAdjust',
	params
)

//客户每日订单--列表
export const fetchDailyOrderList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/dailyOrder/list', 
	params
)
//客户每日订单--员工信息
export const getDailyOrderStaffInfo = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/dailyOrder/staffInfo', 
	params
)
//客户每日订单详情--获取日期列表
export const fetchDailyOrderDetailDateList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/dailyOrderDetail/dateList',
	params
)
//客户每日订单详情--获取数据列表
export const fetchDailyOrderDetailList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/dailyOrderDetail/list',
	params
)
//客户每日订单详情--客户信息
export const getDailyOrderDetailCusInfo = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/dailyOrderDetail/cusInfo',
	params
)
//客户信用余额--获取表格和统计数据
export const fetchCreditBalList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/credit/creditBal',
	params
)
//客户信用余额--获取客户详细信息
export const getCreditBalDetail = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/credit/creditBalDetail',
	params
)
//收款调账参数
export const getRecAdjustConfig = () => http.post(
	'https://lpkj.leaper.ltd:50006/customer/recAdjust/getConfig'
)
//收款调账列表
export const fetchRecAdjustList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/recAdjust/fetchList',
	params
)
//收款调账审核
export const doRecAdjustCheck = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/recAdjust/doCheck',
	params
)
//收款调账删除
export const doRecAdjustDel = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/recAdjust/doDel',
	params
)
//收款调账修改
export const doRecAdjustModify = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/customer/recAdjust/doModify',
	params
)