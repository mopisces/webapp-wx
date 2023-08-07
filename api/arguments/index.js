const http = uni.$u.http

export const getWebCustomerConfig = (params, config = {}) => http.get(
	'https://lpkj.leaper.ltd:50006/arguments/arguments/getWebCustomerConfig'
)