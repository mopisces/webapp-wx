const http = uni.$u.http

export const getUserInfo = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/user/user/getUserInfo',
	params
)

