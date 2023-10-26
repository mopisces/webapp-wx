<!-- 扫描装货详情 -->
<template>
	<view>
		<!-- 新增按钮 -->
		<liu-drag-button 
			v-show="formData.carState==0 && !showModal"
			:bottomPx="pageHeight*0.8"
			@clickBtn="doAdd"
		>
			<text>新增</text>
		</liu-drag-button>
		<!-- 数据列表 -->
		<z-paging
			ref="detailList" 
			v-model="config.mock.mockList" 
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryMock"
		>
			<!-- 数据卡片 -->
			<uni-card
				v-for="(item, index) in config.mock.mockList" 
				:key="index"
				:title=" item.orderId " 
				:extra=" item.cusPoNo "
				:is-shadow="true"
				:border="false"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>客户信息: 
							<text class="mg-left-20">{{ item.cusShortName }}({{ item.cusId }})</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>附加费用: 
							<text class="mg-left-20">{{ item.otherFee }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>当前库区: 
							<text class="mg-left-20">{{ item.stockArea }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>销售信息: 
							<text class="mg-left-20">{{ item.salesLength }}×{{ item.salesWidth }}</text>
							<text class="mg-left-20">{{ item.tSalesArea }}(㎡)</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>纸板信息: 
							<text class="mg-left-20">{{ item.length }}×{{ item.width }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>纸箱信息: 
							<text class="mg-left-20">
								{{ item.boxL }}×{{ item.boxW }}×{{ item.boxH }}
							</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>材质编号: 
							<text class="mg-left-20">{{ item.boardId }}</text>
						</text>
					</view>
					<view v-if="item.matName" class="card-body-item card-body-item-100" >
						<text>货品名称: 
							<text class="mg-left-20">{{ item.matName }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>送货公司: 
							<text class="mg-left-20">{{ item.subDNAddress }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>送货备注: 
							<text class="mg-left-20">{{ item.dnRemark }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>送货备注: 
							<text class="mg-left-20">{{ item.dnHint }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt">订单</view>||
						<view class="card-body-txt">库存</view>||
						<view class="card-body-txt">送货</view>||
						<view class="card-body-txt">赠品</view>:
						<view class="card-body-txt mg-left-20">{{ item.ordQty }}</view>
						<view class="card-body-txt mg-left-20">{{ item.stockQty }}</view>
						<view class="card-body-txt mg-left-20">{{ item.deliQty }}</view>
						<view class="card-body-txt mg-left-20">{{ item.freeQty }}</view>
					</view>
				</view>
				<view 
					v-if="formData.carState==0" 
					slot="actions" 
					class="card-actions" 
				>
					<view class="card-actions-item" @click="doModify(item, index)">
						<u-icon name="edit-pen" color="#3c9cff" size="18"></u-icon>
						<text class="card-actions-item-text">修改</text>
					</view>
					<view class="card-actions-item" @click="doDel(item, index)">
						<u-icon name="close-circle" color="#fa3534" size="18"></u-icon>
						<text class="card-actions-item-text">删除</text>
					</view>
				</view>
			</uni-card>
		</z-paging>
		<!-- 删除弹窗 -->
		<u-modal 
			:show="config.del.show" 
			title="删除提示" 
			:content='config.del.content'
			:asyncClose="true"
			:showCancelButton="true"
			@cancel="config.del.show=false"
			@confirm="delConfirm"
		>
		</u-modal>
		<!-- 修改|新增弹窗 -->
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
						<view class="popup-filter-title">条形编码</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="rowData.strOrderId"
									placeholder="请扫码或者输入订单号" 
									:disableDefaultPadding="true" 
									inputAlign="center"
									border="bottom"
									:disabled="config.modal.type==1?true:false"
								>
								</u--input>
							</view>
							<view v-if="config.modal.type==0">
								<u-icon name="scan" color="#2979ff" size="15" @click="scanCode"></u-icon>
							</view>
						</view>
					</view>
					
					<webapp-cus-picker 
						v-if="rowData.orderType=='x'"
						ref="cusId" 
						:cusId.sync="rowData.cusId"
					>
					</webapp-cus-picker>
					
					<view 
						v-if="config.bMStockArea==1"
						class="popup-filter-item margin20" 
						@click="setStockArea"
					>
						<view class="popup-filter-title">库区选择</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="rowData.stockArea"
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
						<view class="popup-filter-title">库存数量</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="rowData.stockQty"
								placeholder="库存数量" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								border="bottom"
								:disabled="true"
							>
							</u--input>
						</view>
					</view>
					
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">送货数量</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="rowData.strDeliQty"
								placeholder="请输入送货数量" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								border="bottom"
								type="number"
							>
							</u--input>
						</view>
					</view>
					
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">赠品数量</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="rowData.freeQty"
								placeholder="请输入赠品数量" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								border="bottom"
								type="number"
							>
							</u--input>
						</view>
					</view>
					
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">附加费用</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="rowData.otherFee"
								placeholder="请输入附加费" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								border="bottom"
								type="digit"
							>
							</u--input>
						</view>
					</view>
					
					<view class="popup-filter-item margin20" @click="setCusDn">
						<view class="popup-filter-title">送货公司</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="rowData.cusSubNo"
									placeholder="请选择送货公司" 
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
							<u--textarea v-model="rowData.dnRemark" placeholder="请输入送货备注" >
							</u--textarea>
						</view>
					</view>
				</view>
			</view>
		</u-modal>
		<!-- 表单验证 -->
		<u-notify ref="uNotify"></u-notify>
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
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
	</view>
</template>

<script>
	/* 自定义客户选择组件 */
	import WebappCusPicker from "@/components/webapp-cus-picker/webapp-cus-picker.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { fetchStowDetailList, fetchStockAreaList, fetchCusDnList, getStowDetailRow } from "@/api/staff/tool.js"
	
	export default {
		components:{
			WebappCusPicker
		},
		data() {
			return {
				/* 配置 */
				config: {
					/* 模拟上拉加载数据 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: []
					},
					/* 修改或者新增弹窗 */
					modal: {
						show: false,
						//弹窗类型 0->新增 1->修改 3->删除
						type: 0,
					},
					/* picker配置 */
					picker: {
						show: false,
						/* 加载状态 */
						loading: false,
						/* 选择弹窗类型 0->库区 1->送货公司 */
						type: 0,
						/* 绑定列 */
						columns: [],
						/* 库区 */
						stockArea: []
					},
					/* 修改弹窗配置 */
					modify: {
						/* 修改验证规则 */
						rules: {
							
						}
					},
					/* 删除弹窗 */
					del: {
						show: false,
						//删除弹窗内容
						content: '',
					},
					/* 库区是否可以选择 0->不可选择 1->可选择*/
					bMStockArea: 0,
					/* 送货数量计算方式 0->订单数-打包数 1->库存数量 */
					bPackAddODefSQ: 0
				},
				/* 筛选信息 */
				formData: {
					/* 装货单号 */
					pListNo: null,
					/* 装货单状态 */
					carState: 0
				},
				/* 修改或者新增字段 */
				rowData: {
					//删除必须，当前索引
					index: null,
					//装货单号(修改必须)
					pListNo: null,
					//订单类型
					orderType: null,
					//订单号
					strOrderId: null,
					//库区
					stockArea: null,
					//客户编号(纸箱)
					cusId: null,
					//附加费
					otherFee: null,
					//真实库存数
					stockQty: 0,
					//真实送货数
					deliQty: 0,
					//根据参数计算的送货数量
					strDeliQty: 0,
					//赠品数
					freeQty: 0,
					//装货数
					packQty: 0,
					//订单数量
					ordQty: 0,
					//送货公司
					cusSubNo: null,
					//送货备注
					dnRemark: '',
					//删除|修改必要参数
					dnId: null,
				}
			}
		},
		onReady(){
			this.getParams()
		},
		onLoad(options) {
			Object.assign(
				this.formData, 
				JSON.parse(decodeURIComponent(options.filterInfo))
			)
			this.$refs.detailList.reload()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'stowDetail' } )
				this.config.bMStockArea = result.bMStockArea
				this.config.bPackAddODefSQ = result.bPackAddODefSQ
			},
			/* 获取列表数据 */
			async queryList(){
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await fetchStowDetailList(this.formData)
				this.config.mock.indexList = result
			},
			/* 模拟上拉加载下拉刷新 */
			async queryMock(pageNo, pageSize){
				if( pageNo == 1 ){
					await this.queryList()
				}
				var subList = []
				
				if( this.config.mock.indexList.length > 0 ){
					subList = this.config.mock.indexList.splice( 0, pageSize )
				}
				
				setTimeout(()=>{
					this.$refs.detailList.complete(subList)
				}, 1500)
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
			/* 新增点击 */
			doAdd(){
				this.config.modal.type = 0
				this.config.modal.show = true
			},
			/* 修改点击 */
			async doModify( rowData ){
				this.config.modal.type = 1
				await Object.assign(this.rowData, rowData)
				this.rowData.deliQty = this.config.bPackAddODefSQ==1?
					this.rowData.stockQty : this.rowData.ordQty - this.rowData.packQty
				this.config.modal.show = true
			},
			/* modal弹窗取消 */
			cancel(){
				this.config.modal.show = false
			},
			/* modal弹窗点击确认 */
			confirm(){
				this.config.modal.show = false
			},
			/* 获取订单对应信息 */
			async queryStowDetail(){
				const { result } = await getStowDetailRow(this.rowData)
				await Object.assign(this.rowData, result)
				this.rowData.deliQty = this.config.bPackAddODefSQ==1?
					this.rowData.stockQty : this.rowData.ordQty - this.rowData.packQty
			},
			/* 设置库区信息 */
			async setStockArea(){
				this.config.picker.type = 0
				this.config.picker.columns = this.$options.data().config.picker.columns
				this.config.picker.show = true
				this.config.picker.loading = true
				if( /^[a-z]{1}\d{10}/.test(this.rowData.strOrderId) ){
					const { result } = await fetchStockAreaList(this.rowData)
					this.config.picker.columns = [result]
					/* 新增时设置默认库区 */
					if( this.config.modal.type == 0 && result.length > 0 ){
						this.rowData.stockArea = result[0].value
					}
				} else {
					this.$refs.uNotify.show({
						type: 'error',
						message: '请先输入正确的订单号',
						duration: 3000,
					})
				}
				this.config.picker.loading = false	
			},
			/* 设置送货公司 */
			async setCusDn(){
				this.config.picker.type = 1
				this.config.picker.columns = this.$options.data().config.picker.columns
				this.config.picker.show = true
				this.config.picker.loading = true
				if( this.rowData.cusId ){
					const { result } = await fetchCusDnList(this.rowData)
					this.config.picker.columns = [result]
				} else {
					this.$refs.uNotify.show({
						type: 'error',
						message: '请先选择客户',
						duration: 3000,
					})
				}
				this.config.picker.loading = false
			},
			/* picker点击确认 */
			pickerConfirm(e){
				if( this.config.picker.type == 0 )
					this.rowData.stockArea = e.value[0].value
				if( this.config.picker.type == 1 )
					this.rowData.cusSubNo = e.value[0].value
				this.config.picker.show = false
			},
			/* 点击删除 */
			doDel( rowData, idx ){
				this.config.modal.type = 3
				Object.assign(this.rowData, rowData, {index: idx})
				this.config.del.content = '确定删除订单'+rowData.strOrderId+'?'
				this.config.del.show = true
			},
			/* 删除弹窗点击确认 */
			delConfirm(){
				this.config.mock.mockList.splice(this.rowData.index, 1)
				setTimeout(()=>{
					this.config.del.show = false
				}, 2000)
			},
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight",
			}),
			/* 监听修改或者新增弹窗是否打开 */
			showModal(){
				return this.config.modal.show || this.config.del.show
			},
			//监听订单号变化
			showStrOrderId(){
				return this.rowData.strOrderId
			},
		},
		watch: {
			showModal( newV, oldV ){
				if( newV ){
					//设置装货单号
					this.rowData.pListNo = this.formData.pListNo
				} else {
					//新增或者修改字段重置
					this.rowData = this.$options.data().rowData
				}
			},
			
			/* 订单号变化后触发 */
			async showStrOrderId( newV, oldV ){
				if( newV && newV.length == 11 && this.config.modal.type == 0){
					if( /^[a-z]{1}\d{10}/.test(newV) )
						await this.queryStowDetail()
				}
			}
		}
	}
</script>

<!-- 样式引入 -->
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
		height: 760rpx;
		overflow-y: scroll;
		overscroll-behavior-y: contain !important;
	}
</style>