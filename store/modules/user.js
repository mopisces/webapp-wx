import { tokenName, tokenTableName, messageDuration, userInfoName, authMapName } from '@/config/settings.js'
import { login } from '@/api/login/index.js'
import { getUserInfo } from '@/api/user/index.js'

const state = () => ({
	accessToken: uni.getStorageSync(tokenTableName),
	userInfo: uni.getStorageSync(userInfoName),
	authMap: uni.getStorageSync(authMapName),
})

const getters = {
	accessToken: (state) => state.accessToken,
	userInfo: (state) => state.userInfo,
	authMap: (state) => state.authMap,
}

const mutations = {
	setAccessToken( state, accessToken ){
		state.accessToken = accessToken
		uni.setStorageSync(tokenTableName, accessToken)
	},
	setUserInfo( state, info ){
		state.userInfo = info
		uni.setStorageSync(userInfoName, info)
	},
	setAuthMap( state, auth ){
		state.authMap = auth
		uni.setStorageSync(authMapName, auth)
	}
}

const actions = {
	async login({ commit }, userInfo){
		const { result } = await login(userInfo)
		if (result) {
			commit("setAccessToken", result)
		} else {
			uni.showToast({
				title: `登录接口异常，未正确返回${tokenName}...`, 
				icon: 'error', 
				mask: true,
				duration: messageDuration,
			})
		}
	},
	async getUserInfo( { commit } ){
		const { result } = await getUserInfo()
		if (result) {
			commit("setUserInfo", result['userInfo'])
			commit("setAuthMap", result['auth'])
		} else {
			uni.showToast({
				title: '用户信息接口异常，未正确返回', 
				icon: 'error', 
				mask: true,
				duration: messageDuration,
			})
		}
	}
}

export default { state, getters, mutations, actions }