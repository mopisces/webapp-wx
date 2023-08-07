const http = uni.$u.http

export const login = (params, config = {}) => http.post(
	'https://lpkj.leaper.ltd:50006/login/login/login',
	params
)