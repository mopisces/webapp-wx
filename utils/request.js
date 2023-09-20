import { isArray, clearAxiosEmptyParam } from '@/utils/validate.js'
import { 
	tokenName, 
	successCode, 
	invalidCode, 
	noPermissionCode, 
	messageDuration, 
	requestTimeout ,
} from  '@/config/settings.js'

module.exports = (vm) => {
	
	uni.$u.http.setConfig((config) => {
		config.header = {
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		}
		config.dataType = 'json'
		config.timeout = 60000
		// #ifdef H5
		config.withCredentials = false
		// #endif
		
		return config
	})
	
	// 请求拦截
	uni.$u.http.interceptors.request.use((config)=>{
		if( vm.$store.getters['user/accessToken'] ){
			config.header[tokenName] = vm.$store.getters['user/accessToken']
		}
		config.data = config.data || {}
		clearAxiosEmptyParam(config)
		uni.showLoading({title: '加载中',mask: true})
		return config
	}, config => { // 可使用async await 做异步操作
	    return Promise.reject(config)
	})
	
	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		uni.hideLoading()
		const { status, data, config } = response
		const { code, msg } = data
		const codeVerificationArray = isArray(successCode) ? [...successCode] : [...[successCode]]
		if (codeVerificationArray.includes(code)) {
			return data
		} else {
			handleCode(code, msg)
			return Promise.reject("请求异常拦截:" + JSON.stringify({ url: config.url, code, msg }) || "Error")
		}
	}, error => { 
		uni.hideLoading()
		const { response, message } = error
		if (error.response && error.response.data) {
			const { status, data } = response
			handleCode(status, data.msg || message)
			return Promise.reject(error)
		} else {
			let { message } = error
			if (message === "Network Error") {
				message = "后端接口连接异常"
			}
			if (message.includes("timeout")) {
				message = "后端接口请求超时"
			}
			if (message.includes("Request failed with status code")) {
				const code = message.substr(message.length - 3)
				message = "后端接口" + code + "异常"
			}
			return Promise.reject(error)
		}
	})
	
	const handleCode = (code, msg) => {
		console.log(code,invalidCode,noPermissionCode)
		switch (code) {
			case 400:
				uni.showToast({
					title: msg || `后端接口${code}异常`, 
					icon: 'error', 
					mask: true,
					duration: messageDuration,
				})
				break
			case invalidCode:
				 uni.showToast({
					title: msg || `后端接口${code}异常`, 
					icon: 'error', 
					mask: true,
					duration: messageDuration,
					complete: ()=>{
						uni.switchTab({
							url: '/pages/login/login',
						})
					}
				})
				break
			case noPermissionCode:
				console.log('noPermissionCode')
				break
			default:
				break
		}
	}
	
}	  