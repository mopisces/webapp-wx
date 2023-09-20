<template>
	<u-popup 
		:show="show" 
		mode="center" 
		:closeOnClickOverlay="false"
		:safeAreaInsetBottom="false" 
		:zoom="false" 
		:customStyle="{width:'650rpx;'}" 
		:overlayStyle="{background:'rgba(3, 100, 219, 0.5)', touchAction:'none'}"
		:zIndex="10065"
		:overlayIndex="10065"
		@close="close" 
		@open="open">
		<view class="filter-container">
			<view class="filter-header">
				筛选条件
			</view>
			<view  class="filter-content" >
				<!-- 筛选内容滚动 -->
				<view class="filter-scroll">
					<slot></slot>
				</view>
				<!-- <scroll-view 
					:scroll-y="true" 
					class="filter-scroll" 
					style="overscroll-behavior-y: contain !important;"
					@touchmove.stop.prevent="() => {}" 
				>
					<slot></slot>
				</scroll-view> -->
				<view class="filter-footer">
					<view class="filter-footer-item filter-reset" @click="reset()">
						<view class="filter-footer-font">重置</view>
					</view>
					<view class="filter-footer-item filter-search" @click="search()">
						<view class="filter-footer-font">筛选</view>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'WebappPopupFilter',
		props: {
			filterShow:{
				type: Boolean,
				default: false
			},
			isTabbar:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				height: 500,
			}
		},
		methods:{
			reset(){
				this.$emit('reset')
				this.close()
			},
			search(){
				this.$emit('search')
				this.close()
			},
			close(){
				if( this.isTabbar ){
					uni.showTabBar()
				}
				this.$emit("update:filterShow", false)
			},
			open(){
				if( this.isTabbar ){
					uni.hideTabBar()
				}
			}
		},
		mounted() {
			
		},
		computed:{
			show:{
				get(){
					return this.$props.filterShow
				},
				set( value ){
					this.$emit("update:filterShow", value)
				}
			}
		}
	}
</script>

<style>
	.filter-container{
		width: 590rpx;
		height:700rpx;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		flex-direction:column;
		justify-content: space-between;
		background: #f1f1f1;
		overflow-x: hidden;
		/* padding-bottom:100rpx; */
	}
	
	.filter-header{
		font-size: 30rpx;
		font-weight: 600;
		line-height: 30rpx;
		padding:15rpx;
		height:60rpx;
		width:100%;
		text-align: center;
	}
	
	.filter-content{
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction:column;
		justify-content: space-between;
		min-height:640rpx;
	}
	
	.filter-scroll{
		height: 560rpx;
		overflow-y: scroll;
		overscroll-behavior-y: contain !important;
	}
	
	.filter-footer{
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		padding: 15rpx 30rpx;
	}
	
	.filter-footer-item{
		width: 240rpx;
		height: 50rpx;
		text-align: center;
		margin-left: 20rpx;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		border-radius: 30rpx;
	}
	
	.filter-footer-font{
		padding: 5rpx 0;
		line-height: 40rpx;
	}
	
	.filter-reset{
		background-color: #f9ae3d;
	}
	
	.filter-search{
		background-color: #3c9cff;
	}
	
	
</style>