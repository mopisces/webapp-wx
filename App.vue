<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
</style>
<script>
	export default {
		methods:{
			// 程序更新
			updateSys(){
				//#ifdef MP-WEIXIN
				const updateManager = uni.getUpdateManager()
				updateManager.onCheckForUpdate((res)=>{
					if(res.hasUpdate) {
						uni.showModal({
							content: '新版本已经准备好，是否重启应用？',
							showCancel: false,
							confirmText: '确定',
							success: (res) => {
								if (res.confirm) {
									// 新版本下载完成
									updateManager.onUpdateReady((res)=>{
										// 强制当前小程序应用上新版本并重启
										updateManager.applyUpdate()
									})
									// 新版本下载失败
									updateManager.onUpdateFailed((res)=>{
										uni.showModal({
											content: '下载失败，请删除当前小程序后重新打开',
											showCancel: false,
											confirmText: '知道了'
										})
									})
								}
							}
						})
					}
				})
				//#endif
			},
			checkLogin(){
				if( !this.$store.getters ){
					console.log('需要登录')
				}
				
			}
		},
		onLaunch: function() {
			this.updateSys()
			console.log('App Launch')
		},
		onShow: function() {
			this.checkLogin()
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		async mounted() {
			let that = this;
			await uni.getSystemInfo({
				success: res => {
					that.$store.dispatch('page/setPageInfo',res);
				}	
			}); 
		}
	}
</script>

<style>
	page{
		background-color: #f1f1f1;
	}
	/*每个页面公共css */
</style>
