const http = uni.$u.http

//统计模块
export const fetchReturnList = (params, config = {}) => http.post('https://lpkj.leaper.ltd:50006/statis/return/fetchList', params)
