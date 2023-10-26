<!-- 库存修改 -->
<template>
	<view>
		<!-- 列表数据 b2309110570-->
		<z-paging
			ref="stockDetailList" 
			v-model="config.mock.mockList"
			:auto-show-system-loading="true"
			:auto="false"
			:refresher-enabled="config.zpaging.refresher"
			@query="queryMock"
		>
			<view slot="top">
				<uni-card :is-shadow="true">
					<template v-slot:title>
						<view class="card-header-container">
							<u--input 
								v-model="formData.strOrderId"
								inputAlign="center"
								placeholder="请输入单号或者扫描条形码"
								:customStyle="{height: '64rpx'}"
								:clearable="true"
								@clear="scanClear"
							>
							</u--input>
							<view class="card-header-scan">
								<u-icon name="scan" color="#2979ff" size="32" @click="scanCode"></u-icon>
							</view>
						</view>
					</template>
					<view class="card-body-container" v-if="packInfo.cusId">
						<view class="card-body-item card-body-item-100">
							<text>客户信息: 
								<text class="mg-left-20">{{ packInfo.cusShortName }}({{packInfo.cusId}})</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>材质编号: 
								<text class="mg-left-20">{{ packInfo.boardId }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100" v-if="packInfo.matName">
							<text>材质编号: 
								<text class="mg-left-20">{{ packInfo.matName }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>尺寸信息: 
								<text class="mg-left-20">{{ packInfo.length }}×{{ packInfo.width }}</text>
								<text class="mg-left-20" v-if="packInfo.boxL>0">
									{{ packInfo.boxL }}×{{ packInfo.boxW }}×{{ packInfo.boxH }}
								</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>订单数量: 
								<text class="mg-left-20 blue-color">{{packInfo.ordQty}}</text>
							</text>
						</view>
					</view>
				</uni-card>
			</view>
			<!-- 数据卡片 -->
			<uni-card
				v-for="(item, index) in config.mock.mockList" 
				:key="index"
				:title=" item.effecttime " 
				:extra=" item.strStockArea "
				:is-shadow="true"
				:border="false"
			>
				<view class="card-body-item card-body-item-100">
					<text>库存数量: 
						<text class="mg-left-20 red-color">{{ item.iQty }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>操作类型: 
						<text class="mg-left-20 red-color">{{ item.opType }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>备注信息: 
						<text class="mg-left-20">{{ item.strRemark }}</text>
					</text>
				</view>
			
				<view
					slot="actions" 
					class="card-actions" 
				>
					<view class="card-actions-item" @click="doModify(item)">
						<u-icon name="edit-pen" color="#3c9cff" size="18"></u-icon>
						<text class="card-actions-item-text">修改</text>
					</view>
				</view>
			</uni-card>
		</z-paging>
		<!-- 修改弹窗 -->
		<u-modal
			:show="config.modal.show"
			width="690rpx"
			:showCancelButton="true"
			:asyncClose="true"
			@cancel="config.modal.show=false"
			@confirm="confirm"
		>
			<view class="modal-container">
				<view class="modal-scroll">
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">库存数量</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="rowData.iQty"
								placeholder="库存数量" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								border="bottom"
								:disabled="true"
							>
							</u--input>
						</view>
					</view>
					
					<view
						v-if="config.bMStockArea==1"
						class="popup-filter-item margin20" 
						@click="setStockArea"
					>
						<view class="popup-filter-title">库区选择</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="rowData.strStockArea"
									placeholder="请选择库区" 
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
					
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">送货备注</view>
						<view class="popup-filter-content popup-filter-input">
							<u--textarea v-model="rowData.strRemark" placeholder="请输入送货备注" >
							</u--textarea>
						</view>
					</view>
				</view>
			</view>
		</u-modal>
		<!-- 单选弹窗 -->
		<u-picker 
			ref="upicker" 
			:show="config.picker.show"
			title="请选择"
			:showToolbar="true"
			cancelText="取消"
			:immediateChange="true"
			:columns="config.picker.columns" 
			:loading="config.picker.loading"
			@confirm="pickerConfirm"
			@cancel="config.picker.show=false"
		>
		</u-picker>
		<!-- 表单验证 -->
		<u-notify ref="uNotify"></u-notify>
	</view>
</template>

<script>
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { getStowDetailRow, fetchStockDetailList, fetchStockAreaList } from "@/api/staff/tool.js"
	
	export default {
		data() {
			return {
				/* 配置 */
				config: {
					/* 配置z-paging */
					zpaging: {
						refresher: false
					},
					/* 模拟 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: []
					},
					/* 修改弹窗 */
					modal: {
						show: false
					},
					/* 单选弹窗配置 */
					picker: {
						show: false,
						/* 绑定列 */
						columns: [],
						/* 加载状态 */
						loading: false,
					},
					/* 库区是否可以选择 0->不可选择 1->可选择*/
					bMStockArea: 0
				},
				/* 筛选条件 */
				formData: {
					//订单号(包含订单类型)
					strOrderId: null,
					//库区
					strStockArea: null,
					//数量
					iQty: 0,
					//操作类型
					iOpType: null,
					//备注
					strRemark: null,
				},
				/* 订单信息 */
				packInfo: {
					//客户简称
					cusShortName: null,
					//客户编号
					cusId: null,
					//材质编号
					boardId: null,
					//货品名称
					matName: null,
					//板长
					length: null,
					//板宽
					width: null,
					//纸箱长
					boxL: null,
					//纸箱宽
					boxW: null,
					//纸箱高
					boxH: null,
					//数量
					ordQty: 0
				},
				/* 选中详细信息 */
				rowData: {
					//订单号
					strOrderId: null,
					//操作类型
					iOpType: null,
					//库存数量
					iQty: null,
					//库区
					strStockArea: null,
					//备注
					strRemark: null,
					
				}
			}
		},
		mounted() {
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'stowDetail' } )
				this.config.bMStockArea = result.bMStockArea
				this.config.bPackAddODefSQ = result.bPackAddODefSQ
			},
			/* 扫码点击 */
			scanCode(){
				let _this = this
				uni.scanCode({
					success: function (res) {
						_this.rowData.strOrderId = res.result
					}
				});
			},
			/* 扫码清空 */
			scanClear(){
				this.formData.strOrderId = this.$options.data().formData.strOrderId
			},
			//获取装货单详细信息列表
			async queryList(){
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await fetchStockDetailList(this.formData)
				this.config.mock.indexList = result
				this.config.zpaging.refresher = true
			},
			//模拟上拉加载下拉刷新
			async queryMock(pageNo, pageSize){
				if( pageNo == 1 ){
					await this.queryList()
				}
				var subList = []
				
				if( this.config.mock.indexList.length > 0 ){
					subList = this.config.mock.indexList.splice( 0, pageSize )
				}
				
				setTimeout(()=>{
					this.$refs.stockDetailList.complete(subList)
				}, 1500)
			},
			/* 获取订单信息 */
			async queryPackInfo(){
				this.packInfo = this.$options.data().packInfo
				const { result } = await getStowDetailRow( this.formData )
				Object.assign(this.packInfo, result)
				this.config.zpaging.refresher = true
				this.$refs.stockDetailList.reload()
			},
			/* 库区选择确认 */
			pickerConfirm(e){
				this.rowData.strStockArea = e.value[0].value
			},
			/* 修改点击 */
			doModify( item ){
				Object.assign(this.rowData, item)
				this.rowData.strOrderId = this.formData.strOrderId
				this.config.modal.show = true
			},
			/* 修改弹窗点击确认 */
			confirm(){
				this.config.modal.show = false
			},
			/* 设置库区 */
			async setStockArea(){
				this.config.picker.columns = this.$options.data().config.picker.columns
				const { result } = await fetchStockAreaList(this.rowData)
				if( result.length == 0 ){
					this.$refs.uNotify.show({
						type: 'error',
						message: '暂无可选库区',
						duration: 3000,
					})
				} else {
					this.config.picker.columns = [result]
					if( !this.rowData.strStockArea ){
						this.rowData.strStockArea = this.config.picke.columns[0][0].value
					}
					this.config.picker.show = true
				}
			}
		},
		computed: {
			//监听订单号变化
			showStrOrderId(){
				return this.formData.strOrderId
			},
		},
		watch: {
			/* 订单号变化后触发 */
			async showStrOrderId( newV, oldV ){
				if( newV && newV.length == 11 ){
					if( /^[a-z]{1}\d{10}/.test(newV) )
						await this.queryPackInfo()
				} else {
					this.packInfo = this.$options.data().packInfo
					this.config.zpaging.refresher = false
					this.$refs.stockDetailList.clear()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
	
	.modal-container {
		display: flex;
		align-items: center;
		flex-direction:column;
		justify-content: space-between;
		background: #f1f1f1;
		overflow-x: hidden;
	}
	
	.modal-scroll {
		height: 440rpx;
		overflow-y: scroll;
		overscroll-behavior-y: contain !important;
	}
	
	.card-header-container {
		padding: 20rpx 20rpx 0 20rpx;
		height: 84rpx;
	}
	
	.card-header-scan{
		padding-left: 20rpx;
	}
	
	.card-form-row {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.card-form-row-input-width {
		width: 400rpx;
	}
</style>