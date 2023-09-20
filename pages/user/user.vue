<template>
	<view class="user-container">
		<view class="top-container">
			<image class="bg-img" src="/static/img/user/mine_bg.png"></image>
			<view class="top-header-center">
				<image class="top-header-avatar" src="/static/img/user/mine_touxiang.png" ></image>
				<view class="top-header-info">
					<view class="top-header-nickname">{{ userInfo.ChiName }}</view>
					<view class="top-header-explain">{{ userInfo.PhoneNum }}</view>
					<view class="top-header-explain">{{ userInfo.FactoryName }}--{{ userInfo.SShortName }}</view>
				</view>
				<view class="top-header-btn-edit">
					<u-button 
						type="primary" 
						color="#6e98fc" 
						:hairline="true" 
						shape="circle" 
						size="small" 
						icon="setting" 
						text="设置" 
						:custom-style="{background:'transparent'}">
					</u-button>
				</view>
			</view>
		</view> 
		
		<view class="karry-content-box">
			
			<!-- 客户管理 -->
			<view class="karry-box karry-tool-box" v-if="authMap.customerManage">
				<view class="karry-box-header">
					<view class="box-header-title">客户管理</view>
					<view class="box-header-sub"></view>
				</view>
				<view class="karry-order-list karry-flex-wrap">
					<view class="karry-paper-item" 
						v-for="(item,idx) in authMap.customerManage" 
						:key="idx"
						@click="openPage(item)"
					>
						<view class="karry-icon-box">
							<image
								class="karry-paper-icon" 
								:src="item.icon"
							/>
							<!-- <view class="karry-badge karry-badge-red">3</view> -->
						</view>
						<view class="karry-order-text">
							{{item.title}}
						</view>
					</view>
				</view>
			</view>
			
			<!-- 统计信息 -->
			<view class="karry-box karry-statis-box" v-if="authMap.statisManage">
				<view class="karry-box-header">
					<view class="box-header-title">统计信息</view>
					<view class="box-header-sub"></view>
				</view>
				<view class="karry-order-list">
					<view 
						v-for="(item,idx) in authMap.statisManage"  
						:key="idx" 
						@click="openPage( item )"
						class="karry-order-item" 
					>
						
						<view class="karry-icon-box">
							<image
								class="karry-order-icon" 
								:src="item.icon"
							/>
						</view>
						<view class="karry-order-text">
							{{item.title}}
						</view>
					</view>
				</view>
			</view>
			
			
			<!-- 原纸管理 -->
			<view class="karry-box karry-paper-box" v-if="authMap.paperManage">
				<view class="karry-box-header">
					<view class="box-header-title">原纸管理</view>
					<view class="box-header-sub"></view>
				</view>
				<view class="karry-order-list karry-flex-wrap">
					<view class="karry-paper-item"  
						v-for="(item,idx) in authMap.paperManage" 
						:key="idx" 
						@click="openPage(item)"
					>
						<view class="karry-icon-box">
							<image
								class="karry-paper-icon" 
								:src="item.icon"
							/>
							<!-- <view class="karry-badge">3</view> -->
						</view>
						<view class="karry-order-text">
							{{item.title}}
						</view>
					</view>
				</view>
			</view>
			
			<!-- 我的工具 -->
			<view class="karry-box karry-tool-box" v-if="authMap.toolManage">
				<view class="karry-box-header">
					<view class="box-header-title">我的工具</view>
					<view class="box-header-sub"></view>
				</view>
				<view class="karry-order-list karry-flex-wrap">
					<view class="karry-paper-item"  
						v-for="(item,idx) in authMap.toolManage" 
						:key="idx"
						@click="openPage(item)"
					>
						<view class="karry-icon-box">
							<image
								class="karry-paper-icon" 
								:src="item.icon"
							/>
						</view>
						<view class="karry-order-text">
							{{item.title}}
						</view>
					</view>
				</view>
			</view>
			
			
		</view>
		
		<u-action-sheet 
			:actions="config.actionSheet.actions" 
			:title="config.actionSheet.title" 
			:show=" config.actionSheet.show "
			:closeOnClickOverlay="true" 
			:closeOnClickAction="true"
			@select="actionSheetClick"
			@close="actionSheetClose"
		>
		</u-action-sheet>
	</view>
</template>

<script>
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getUserInfo } from '@/api/user/index.js'
	
	export default {
		data() {
			return {
				/* 页面配置信息 */
				config:{
					/* 底部弹出配置 */
					actionSheet: {
						//设置标题
						title: null,
						//按钮的文字数组
						actions: [],
						//是否显示
						show: false
					}
				},
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({ 
				userInfo: "user/userInfo", 
				authMap: "user/authMap", 
			}),
			/* 底部弹窗是否弹出 */
			actionSheetShow(){
				return this.config.actionSheet.show
			}
		},
		watch: {
			/* 监听底部弹出是否弹出 */
			actionSheetShow( newV, oldV ){
				if( !newV ){
					this.config.actionSheet = this.$options.data().config.actionSheet
				}
			}
		},
		async mounted(){
			await this.$store.dispatch('user/getUserInfo')
		},
		methods:{
			/* 页面跳转 */
			async openPage( item ){
				if( item.url.constructor === Array ){
					await item.url.forEach((row, idx)=>{
						this.config.actionSheet.actions.push({name: row.name, url: row.url })
					})
					uni.hideTabBar()
					this.config.actionSheet.show = true
				} else {
					uni.navigateTo({
						url: item.url
					})
				}
			},
			/* 底部弹出菜单点击 */
			actionSheetClick( item ){
				setTimeout(()=>{
					this.openPage( item )
				}, 200)
			},
			/* 底部弹出菜单关闭 */
			actionSheetClose(){
				this.config.actionSheet.show = false
				uni.showTabBar()
			}
		}
	}
</script>

<style lang="scss">
	.user-container{
		position: relative;
		/* padding-bottom: 100rpx; */
	}
	
	.top-container {
		width: 100%;
		height: 264rpx;
		position: relative;
	}
	
	.bg-img{
		width: 100%;
		height: 264rpx;
		display: block;
	}
	
	.top-header-center {
		position: absolute;
		width: 100%;
		height: 128rpx;
		left: 0;
		top: 18rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}
	
	.top-header-avatar {
		flex-shrink: 0;
		width: 128rpx;
		height: 128rpx;
		display: block;
	}
	
	.top-header-info {
		width: 60%;
		padding-left: 30rpx;
	}
	
	.top-header-nickname {
		font-size: 30rpx;
		font-weight: 500;
		color: #fff;
		display: flex;
		align-items: center;
	}
	
	.top-header-explain {
		width: 80%;
		font-size: 24rpx;
		font-weight: 400;
		color: #fff;
		opacity: 0.75;
		padding-top: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.top-header-btn-edit{
		flex-shrink: 0;
		padding-right: 22rpx;
	}
	
	.karry-content-box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: relative;
		top: -82rpx;
		z-index: 10;
	}

	.karry-box{
		width: 100%;
		background: #fff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		border-radius: 10rpx;
		overflow: hidden;
	}
	
	.karry-order-box{
		height: 208rpx;
	}
	
	.karry-box-header{
		height: 62rpx;
		padding: 20rpx 30rpx 10rpx 20rpx;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		font-size: 30rpx;
		color: #303133;
		align-items: center;
		border-bottom: 2rpx #f1f1f1 solid;
	}
	
	.box-header-title{
		flex:1;
		font-weight: 600;
		color: #333;
	}
	
	.box-header-sub{
		flex:1;
		text-align: right;
		font-size: 30rpx;
	}
	
	.karry-order-list{
		width: 100%;
		height: 146rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.karry-order-item{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.karry-icon-box{
		position: relative;
	}
	
	.karry-order-icon{
		width: 56rpx;
		height: 56rpx;
		display: block;
	}
	
	.karry-badge{
		position: absolute;
		font-size: 24rpx;
		height: 32rpx;
		min-width: 20rpx;
		padding: 0 6rpx;
		border-radius: 40rpx;
		right: 10rpx;
		top: -4rpx;
		-webkit-transform: scale(.8) translateX(60%);
		transform: scale(.8) translateX(60%);
		-webkit-transform-origin: center center;
		transform-origin: center center;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}
	
	.karry-badge-red{
		background: #f74d54;
		color: #fff;
	}
	
	.karry-order-text{
		font-size: 26rpx;
		font-weight: 400;
		color: #666;
		padding-top: 4rpx;
	}
	
	.karry-paper-box{
		margin-top: 20rpx;
	}
	
	.karry-flex-wrap{
		flex-wrap: wrap;
		height: auto;
		padding-bottom: 30rpx;
		justify-content: flex-start;
	}
	
	.karry-paper-item{
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 30rpx;
	}
	
	.karry-paper-text{
		font-size: 26rpx;
		font-weight: 400;
		color: #666;
		padding-top: 4rpx;
	}
	
	.karry-paper-icon{
		width: 64rpx;
		height: 64rpx;
		display: block;
	}
	
	.karry-statis-box{
		margin-top: 20rpx;
	}
	
	.karry-tool-box{
		margin-top: 20rpx;
	}
</style>
