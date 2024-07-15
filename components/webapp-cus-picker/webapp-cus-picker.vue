<template>
	<view>
		<view class="popup-filter-item"  @tap="picker.show = true">
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
			:showToolbar="true"
			cancelText="清空"
			:loading="picker.loading"
			:columns="picker.columns" 
			keyName="value"
			:defaultIndex="picker.defaultIndex"
			:immediateChange="true"
			:visibleItemCount="10"
			>
			<view slot="toolbar">
				<view>
					<view
						class="u-toolbar"
						@touchmove.stop.prevent="noop"
					>
						<view
							class="u-toolbar__cancel__wrapper"
							hover-class="u-hover-class"
						>
							<text
								class="u-toolbar__wrapper__cancel"
								@tap="onCancel"
								:style="{
									color: cancelColor
								}"
							>{{ cancelText }}</text>
						</view>
						<view class="u-toolbar__title u-line-1">
							<u-search 
								placeholder="请输入客户" 
								v-model="formData.keyWord" 
								:showAction="false"
								:inputStyle="{
									lineHeight: '42px'
								}"
								@search="onSearch"
								@clear="onClear"
							>
							</u-search>
						</view>
						<view
							class="u-toolbar__confirm__wrapper"
							hover-class="u-hover-class"
						>
							<text
								class="u-toolbar__wrapper__confirm"
								@tap="onConfirm"
								:style="{
								color: confirmColor
							}"
							>{{ confirmText }}</text>
						</view>
					</view>
				</view>
			</view>
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
			},
			// 取消按钮的文字
			cancelText: {
			    type: String,
			    default: uni.$u.props.toolbar.cancelText
			},
			// 确认按钮的文字
			confirmText: {
			    type: String,
			    default: uni.$u.props.toolbar.confirmText
			},
			// 取消按钮的颜色
			cancelColor: {
			    type: String,
			    default: uni.$u.props.toolbar.cancelColor
			},
			// 确认按钮的颜色
			confirmColor: {
			    type: String,
			    default: uni.$u.props.toolbar.confirmColor
			},
		},
		data(){
			return {
				//picker配置
				picker:{
					show: false,
					title: '请选择客户',
					loading: false,
					columns: [],
					defaultIndex: []
				},
				//客户信息列表
				cusList: [],
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
				this.picker.show = false
			},
			/* picker确认 */
			onConfirm(){
				const info = this.$refs.cusPicker.getConfirmInfo()
				this.$emit("update:cusId", info.value[0].key)
				this.onClose()
			},
			/* picker取消 */
			onCancel(){
				this.$emit("update:cusId", '')
				this.onClose()
			},
			/* 获取客户信息数据 */
			async fetchList(){
				try{
					this.picker.loading = true
					const { result } = await fetchCusList( this.formData )
					this.picker.columns[0] = result
					this.$refs.cusPicker.setColumnValues(0, result)
					this.$refs.cusPicker.setIndexs([0], true)
					uni.$u.sleep(2000).then(() => {
						this.picker.loading = false
					})
				}catch(e){
					console.log(e)
				}
			},
			/* 搜索客户信息 */
			onSearch(){
				this.fetchList()
			},
			/* 取消搜索 */
			onClear(){
				this.formData.keyWord = ""
				this.fetchList()
			},
		},
		mounted() {
			this.fetchList()
		},
		computed: {
			cusName: {
				get(){
					return this.$props.cusId
				},
				set( value ){
					this.$emit("update:cusId", value)
				}
			},
		},
		watch:{
			/* 监听cusName */
			cusName( newV, oldV ) {
				if ( newV.length > 0 ) {
					this.picker.columns[0].forEach((item,idx)=>{
						if( item.key == newV ){
							this.$refs.cusPicker.setIndexs([idx], true)
						}
					})
				} else {
					this.$refs.cusPicker.setIndexs([0], true)
				}
			},
			'formData.keyWord': {
				handler( newV, oldV ){
					this.formData.keyWord = newV.toUpperCase()
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
<style lang="scss" scoped>
	.u-toolbar {
		height: 42px;
		@include flex;
		justify-content: space-between;
		align-items: center;

		&__wrapper {
			&__cancel {
				color: $u-tips-color;
				font-size: 15px;
				padding: 0 15px;
			}
		}

		&__title {
			color: $u-main-color;
			font-size: 16px;
			flex: 1;
			text-align: center;
		}

		&__wrapper {
			&__confirm {
				color: $u-primary;
				font-size: 15px;
				padding: 0 15px;
			}
		}
	}
</style>