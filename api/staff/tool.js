const http = uni.$u.http

//我的工具模块
//报价查询列表
export const fetchQuoList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/quo/fetchQuoList',
	params
)
//报价查询详情
export const fetchQuoDetailList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/quo/fetchQuoDetailList',
	params
)
//订单试算--自动获取箱舌和封箱调整
export const getTonLenAndULen = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/calc/getTonLenAndULen',
	params
)
//订单试算--自动获取修边和面积
export const getTrimAndArea = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/calc/getTrimAndArea',
	params
)
//订单试算--获取单选列表
export const fetchCalcOrdList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/calc/fetchCalcOrdList',
	params
)
//客户查询列表
export const fetchCustomerInfoList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/customer/fetchList',
	params
)
//库存修改--装货单详情
export const fetchStockDetailList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/stockDetail/fetchList',
	params
)
//库区面积列表
export const fetchDeliveryAreaList = () =>  http.post(
	'https://lpkj.leaper.ltd:50006/tool/deliveryArea/fetchList',
)
//扫描装货列表
export const fetchStowList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/stow/fetchStowList',
	params
)
//新增|修改装货单必要参数
export const getOperateStowInfo = (config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/stow/getOperateStowInfo'
)
//修改装货单
export const updateStow = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/stow/updateStow',
	params
)
//扫描装货详情列表
export const fetchStowDetailList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/stow/fetchDetailList',
	params
)
//扫描装货详情--获取订单信息
export const getStowDetailRow = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/stow/getStowDetailRow',
	params
)
//扫描装货详情--库区面积
export const fetchStockAreaList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/stow/fetchStockAreaList',
	params
)
//扫描装货详情--送货公司
export const fetchCusDnList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/stow/fetchCusDnList',
	params
)
//生产分析总计列表
export const fetchProInfoList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/proInfo/fetchList',
	params
)
//用户管理列表
export const fetchCusManageList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/cusManage/fetchList',
	params
)
//用户管理权限列表
export const fetchCusAuthList = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/cusManage/fetchAuthList',
	params
)
//用户权限修改
export const doCusManageModify = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/tool/cusManage/doModify',
	params
)