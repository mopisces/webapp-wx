<template>
	<view>
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
					<scroll-view 
						:scroll-y="true" 
						class="height100" 
						style="overscroll-behavior-y: contain !important;"
						@touchmove.stop.prevent="() => {}" 
					>
						<slot></slot>
					</scroll-view>
				</view>
				<view class="filter-footer">
					<view class="filter-footer-item">
						<u-button 
							type="error" 
							text="重置" 
							:customStyle="{height:'50rpx',width:'100%',borderRadius:'20rpx'}"
							@tap="reset()">
						</u-button>
					</view>
					<view class="filter-footer-item">
						<u-button
							type="primary" 
							text="筛选" 
							:customStyle="{height:'50rpx',width:'100%',borderRadius:'20rpx'}"
							@tap="search()">
						</u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
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
				this.$emit('reset');
				this.close();
			},
			search(){
				this.$emit('search');
				this.close();
			},
			close(){
				if( this.isTabbar ){
					uni.showTabBar();
				}
				this.$emit("update:filterShow", false);
			},
			open(){
				if( this.isTabbar ){
					uni.hideTabBar();
				}
			}
		},
		mounted() {
			
		},
		computed:{
			show:{
				get(){
					return this.$props.filterShow;
				},
				set( value ){
					this.$emit("update:filterShow", value);
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
		min-height:560rpx;
	}
	
	.filter-footer{
		/* padding-bottom: 80rpx; */
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
	}
	
	.filter-footer-item{
		width: 210rpx;
		height: 50rpx;
		padding: 15rpx 30rpx;
	}
	
	.height100{
		height:100%;
	}
</style>