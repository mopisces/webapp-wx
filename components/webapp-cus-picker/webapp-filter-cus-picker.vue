<template>
	<view>
		<view class="popup-filter-item" @tap="picker.show = true">
			<view class="popup-filter-title">客户</view>
			<view class="popup-filter-content popup-filter-input">
				<view >
					<u--input
						:value="cusName"
						placeholder="请选择客户" 
						:disableDefaultPadding="true" 
						inputAlign="center"
						border="bottom"
						readonly
					>
					</u--input>
				</view>
				<view>
					<u-icon name="arrow-right" color="#2979ff" size="15"></u-icon>
				</view>
			</view>
		</view>
		<u-picker 
			ref="cusPicker"
			:show="picker.show" 
			:title="picker.title"
			:loading="picker.loading"
			:columns="picker.columns" 
			keyName="value"
			:defaultIndex="picker.defaultIndex"
			:immediateChange="true"
			cancelText="清空"
			
			@close="onClose"
			@confirm="onConfirm"
			@cancel="onCancel">
		</u-picker>
	</view>
</template>

<script>
	import { fetchCusList } from '@/api/staff/common.js'
	export default {
		name: 'WebappCusPicker',
		props: {
			cusId: {
				type: String,
				default: ''
			}
		},
		data(){
			return {
				//picker配置
				picker:{
					show: false,
					title: '请选择客户',
					loading: false,
					columns:[],
					defaultIndex: []
				},
				//筛选条件
				formData: {
					//关键词
					keyWord: null,
				}
			}
		},
		methods:{
			/* picker关闭 */
			onClose(){
				this.picker.show = false;
			},
			/* picker确认 */
			onConfirm( arr ){
				console.log(arr)
				this.$emit("update:cusId", arr.value[0].key)
				this.onClose()
			},
			/* picker取消 */
			onCancel(){
				this.$emit("update:cusId", '')
				this.onClose()
			},
			async init(){
				try{
					const { result } = await fetchCusList( this.formData )
					this.picker.columns[0] = result
				}catch(e){
					console.log(e)
				}
			}
		},
		mounted() {
			this.init()
		},
		computed: {
			cusName: {
				get(){
					return this.$props.cusId
				},
				set( value ){
					this.$emit("update:cusId", value)
				}
			}
		},
		watch:{
			cusName( newV, oldV ) {
				if ( newV.length > 0 ) {
					this.picker.columns[0].forEach((item,idx)=>{
						if( item.key == newV ){
							this.picker.defaultIndex = [ idx ]
							this.picker.title = item.value
							
						}
					})
				} else {
					this.picker.defaultIndex = []
					this.picker.title = ''
					this.$refs.cusPicker.setIndexs(this.picker.defaultIndex, true)
				}
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