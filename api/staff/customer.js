const http = uni.$u.http

//客户每日送货
export const fetchDeliveryDailyInfo = (params, config = {}) => http.post('https://lpkj.leaper.ltd:50006/customer/deliveryDaily/info', params)
