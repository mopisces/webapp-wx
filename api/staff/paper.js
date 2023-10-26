const http = uni.$u.http
//安全库存列表
export const fetchSafePaperList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/safePage/fetchList', 
	params
)
//原纸采购日期列表
export const fetchPaperProcureDateList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/paperProcure/fetchDateList', 
	params
)
//原纸采购列表
export const fetchPaperProcureList  = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/paperProcure/fetchList', 
	params
)
//原纸出库--查询信息
export const getStockOutInfo = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/stockOut/getInfo', 
	params
)
//原纸出库
export const doStockOut = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/stockOut/doStockOut', 
	params
)
//原纸库存模块--页面参数
export const getSStockConfig = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/paper/getSStockConfig'
)
//原纸库存模块--列表数据
export const getSStock = (params, config = {} ) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/paper/getSStock',
	params
)
//原纸日用量--日期
export const fetchDailyUsedDateList = (params, config = {} )=> http.post(
	'https://lpkj.leaper.ltd:50006/paper/dailyUsed/fetchDateList',
	params
)
//原纸日用量--列表
export const fetchDailyUsedList = (params, config = {} )=> http.post(
	'https://lpkj.leaper.ltd:50006/paper/dailyUsed/fetchList',
	params
)
//原纸日用量详情--列表
export const fetchDailyUsedDetailList = (params, config = {})=> http.post(
	'https://lpkj.leaper.ltd:50006/paper/dailyUsed/fetchDetailList',
	params
)
//原纸入库--查询信息
export const getStockInInfo = (params, config = {})=> http.post(
	'https://lpkj.leaper.ltd:50006/paper/stockIn/getInfo',
	params
)
export const doStockIn = (params, config = {})=> http.post(
	'https://lpkj.leaper.ltd:50006/paper/stockIn/doStockIn',
	params
)
//原纸收货模块--日期数据
export const fetchTakeDeliveryDateList = () => http.post(
	'https://lpkj.leaper.ltd:50006/paper/takeDelivery/fetchDateList',
)
//原纸收货模块--列表
export const fetchTakeDeliveryList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/takeDelivery/fetchList',
	params
)
//原纸收货、采购详细信息
export const fetchPaperBuyList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/paperBuy/fetchList',
	params
)
//直接入库--页面参数
export const getDirectInConfig = () => http.post(
	'https://lpkj.leaper.ltd:50006/paper/directIn/getConfig'
)
//直接入库--订单信息
export const getDirectInInfo = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/paper/directIn/getInfo',
	params
)
