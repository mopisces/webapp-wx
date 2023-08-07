<template>
	<view>
		<view class="popup-filter-item" @tap="picker.show = true">
			<view class="popup-filter-title">客户</view>
			<view class="popup-filter-content popup-filter-input">
				<view >
					<u--input
						:value="defaultValue"
						placeholder="请选择客户" 
						:disableDefaultPadding="true" 
						inputAlign="center"
						 border="bottom"
						>
					</u--input>
				</view>
				<view>
					<u-icon name="arrow-right" color="#2979ff" size="15"></u-icon>
				</view>
			</view>
		</view>
		<u-picker 
			:show="picker.show" 
			:title="picker.title"
			:loading="picker.loading"
			:columns="picker.columns" 
			keyName="CusName"
			:defaultIndex="picker.defaultIndex"
			:immediateChange="true"
			@close="onClose"
			@confirm="onConfirm"
			@change="onChange"
			@cancel="onCancel">
		</u-picker>
	</view>
</template>

<script>
	//import { getSF } from '@/api/staff/erpOrders.js'
	export default {
		name: 'WebappCusPicker',
		props: {
			defaultValue:{
				type: String,
				default: ''
			}
		},
		data(){
			return {
				picker:{
					show:false,
					title:'请选择客户',
					loading:false,
					columns:[[
						{
							CusId:'MWK*',
							CusName: '米微可*'
						},
						{
							CusId:'NB',
							CusName: '诺博纸板'
						},
						{
							CusId:'NCW',
							CusName: '甘春武'
						}
					]],
					defaultIndex: []
				}
			}
		},
		methods:{
			onClose(){
				this.picker.show = false;
				//this.$emit('cusChange',this.)
			},
			onConfirm( arr ){
				this.picker.title = arr.value[0].CusName;
				this.$emit('cusConfirm',arr.value[0]);
				this.onClose();
			},
			onChange( arr ){
				
			},
			onCancel(){
				this.onClose();
			},
			init(){
				try{
					let that = this;
					//const result = await getSF();
					this.picker.columns[0].forEach((item,idx)=>{
						if( item.CusId == that.defaultValue ){
							that.picker.defaultIndex = [ idx ]
						}
					});
				}catch(e){
					//console.log(e)
				}
			}
		},
		mounted() {
			this.init()
		},
		computed:{
			
		},
		watch:{
			defaultValue:{
				handler( newValue, oldValue ){
					console.log(newValue)
				},
				deep: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-filter-item{
		background: #fff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		border-radius: 10rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15rpx;
		font-size: 30rpx;
		height:60rpx;
		width: 560rpx;
	}
	
	.popup-filter-title{
		font-weight: 700;
		width: 120rpx;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
	}
	
	.popup-filter-content{
		padding-left:10px;
		width: 430rpx;
	}
	
	.popup-filter-input{
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>