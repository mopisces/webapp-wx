module.exports = {
	//token名称
	tokenName: "Authentication",
	//token在localStorage、sessionStorage、cookie存储的key的名称
	tokenTableName: "jp-webapp",
	//消息框消失时间
	messageDuration: 3000,
	//最长请求时间
	requestTimeout: 5000,
	//操作正常code，支持String、Array、int多种类型
	successCode: [ 200 ],
	//登录失效code
	invalidCode: 402,
	//无权限code
	noPermissionCode: 401,
	//用户信息本地存储key值
	userInfoName: 'karry-2023-user',
	//用户权限本地存储key值
	authMapName:'karry-2023-auth'
}