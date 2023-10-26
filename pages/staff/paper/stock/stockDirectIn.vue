<!-- 直接入库 -->
<template>
	<view>
		<!-- 数据列表 -->
		<z-paging
			ref="directInList" 
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
					<view class="card-body-container">
						<view class="card-body-item card-body-item-100">
							<text>客户信息: 
								<text class="mg-left-20">{{ packInfo.cusShortName }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>规格信息: 
								<text class="mg-left-20">{{ packInfo.orderDescr }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100" v-if="packInfo.matName">
							<text>货品名称: 
								<text class="mg-left-20">{{ packInfo.matName }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>传单库区: 
								<text class="mg-left-20">{{ packInfo.strSchArea }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>订单|已入库:
								<text class="mg-left-20">{{ packInfo.ordQty }}</text>
								<text class="mg-left-20">{{ packInfo.finishedQty }}</text>
							</text>
						</view>
					</view>
					<view
						slot="actions" 
						class="card-actions" 
					>
						<view class="card-actions-item" @click="config.modal.show=true">
							<u-icon name="arrow-downward" color="#3c9cff" size="18"></u-icon>
							<text class="card-actions-item-text">入库</text>
						</view>
					</view>
				</uni-card>
			</view>
			<!-- 数据卡片 -->
			<uni-card
				v-for="(item, index) in config.mock.mockList" 
				:key="index"
				:is-shadow="true"
				:border="false"
			>
				<view class="card-body-item card-body-item-100">
					<text>传单库区: 
						<text class="mg-left-20 red-color">{{ item.stockArea }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>未装信息: 
						<text class="mg-left-20 red-color">{{ item.leftQty }}</text>
						<text class="mg-left-20 yellow-color">{{ item.leftSArea }}㎡</text>
					</text>
				</view>
				<view
					slot="actions" 
					class="card-actions" 
				>
					<view class="card-actions-item" @click="doSchArea(item)">
						<u-icon name="list" color="#3c9cff" size="18"></u-icon>
						<text class="card-actions-item-text">传单库区</text>
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
			@confirm="doStockIn"
		>
			<view class="modal-container">
				<view class="modal-scroll">
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">入库数</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="formData.iQty"
								placeholder="请输入库数量" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								border="bottom"
								:disabled="true"
							>
							</u--input>
						</view>
					</view>
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">班次</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="formData.strWorkGorup"
								placeholder="请输入班次" 
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
						@click="config.picker.show=true"
					>
						<view class="popup-filter-title">库区选择</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="formData.strStockArea"
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
					
					<view
						class="popup-filter-item margin20" 
						@click="config.calendar.show=true"
					>
						<view class="popup-filter-title">入库日期</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="formData.dInDate"
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
						<view class="popup-filter-title">备注信息</view>
						<view class="popup-filter-content popup-filter-input">
							<u--textarea v-model="formData.strRemark" placeholder="请输入备注信息" >
							</u--textarea>
						</view>
					</view>
				</view>
			</view>
		</u-modal>
		<!-- 入库日期选择 -->
		<u-calendar 
			title="入库日期"
			:showTitle="false"
			:closeOnClickOverlay="false" 
			mode="single"
			:show="config.calendar.show"
			:minDate="formData.minDate"
			:maxDate="formData.maxDate"
			:defaultDate="formData.stockDate"
			:monthNum="6"
			@confirm="calendarConfirm"
			@close="config.calendar.show=false"
		></u-calendar>
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
			keyName="stockArea"
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
	import { getDirectInConfig, getDirectInInfo } from "@/api/staff/paper.js"
	
	export default {
		data() {
			return {
				/* 配置 */
				config: {
					/* 配置z-paging */
					zpaging: {
						refresher: false,
					},
					/* 模拟 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: []
					},
					/* 入库日期选择配置 */
					calendar: {
						show: false,
					},
					/* 单选弹窗配置 */
					picker: {
						show: false,
						/* 加载状态 */
						loading: false,
						/* 绑定列 */
						columns: [],
					},
					/* 入库弹窗 */
					modal: {
						show: false,
					},
					/* 库区是否可以选择 0->不可选择 1->可选择*/
					bSAreaControl: 0,
					/* 库区控制 */
					bMStockArea: 0,
				},
				formData: {
					/* 单号 */
					strOrderId: null,
					/* 班次 */
					strWorkGorup: '',
					/* 入库数量 */
					iQty: 0,
					/* 入库库区 */
					strStockArea: null,
					/* 入库日期 */
					dInDate: null,
					/* 备注 */
					strRemark: '',
					/* 最小日期 */
					minDate: null,
					/* 最大日期 */
					maxDate: null,
					/* 入库日期 */
					stockDate: null,
				},
				/* 订单信息 */
				packInfo: {
					/* 客户信息 */
					cusShortName: '',
					/* 规格信息 */
					orderDescr: '',
					/* 订单数量 */
					ordQty: 0,
					/* 已入库数 */
					finishedQty: 0,
					/* 传单库区 */
					strSchArea: '',
					/* 材质名称 */
					matName: null,
					/* 备注 */
					dnRemark: null,
				}
			}
		},
		async mounted() {
			await this.getParams()
		},
		methods: {
			/* 扫码点击 */
			scanCode(){
				let _this = this
				uni.scanCode({
					success: function (res) {
						_this.formData.strOrderId = res.result
					}
				});
			},
			/* 扫码清空 */
			scanClear(){
				this.formData.strOrderId = this.$options.data().formData.strOrderId
			},
			/* 获取参数 */
			async getParams(){
				this.config.picker.loading = true
				const { result } = await getDirectInConfig()
				this.formData.dInDate = result.config.dInDate
				this.formData.maxDate = result.config.maxDate
				this.formData.minDate = result.config.minDate
				
				this.config.bMStockArea = result.config.bMStockArea
				this.config.bSAreaControl = result.config.bSAreaControl
				if( result.stockArea.length > 0 ){
					this.config.picker.columns = [result.stockArea]
				} else {
					this.$refs.uNotify.show({
						type: 'error',
						message: '暂无可选库区',
						duration: 3000,
					})
				}
				setTimeout(()=>{
					this.config.picker.loading = false
				}, 1000)
			},
			/* 获取页面信息 */
			async queryPackInfo(){
				this.packInfo = this.$options.data().packInfo
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await getDirectInInfo(this.formData)
				if( result.ordSchArea.length > 0 && this.config.bSAreaControl == 1 ){
					this.config.zpaging.refresher = true
				} else {
					this.config.zpaging.refresher = false
				}
				this.config.mock.indexList = result.ordSchArea
				/* 默认传单库区 */
				if( result.ordSchArea.length > 0 ){
					this.packInfo.strSchArea = result.ordSchArea[0].stockArea
				}
				this.packInfo = result.ordInInfo
				/* 默认库区选择第一个 */
				if( result.lastSchArea.length > 0 ){
					this.formData.strStockArea = result.lastSchArea[0].stockArea
				}
			},
			//模拟上拉加载下拉刷新
			async queryMock(pageNo, pageSize){
				if( pageNo == 1 ){
					await this.queryPackInfo()
				}
				var subList = []
				
				if( this.config.mock.indexList.length > 0 ){
					subList = this.config.mock.indexList.splice( 0, pageSize )
				}
				
				setTimeout(()=>{
					this.$refs.directInList.complete(subList)
				}, 1500)
			},
			/* 传单库区点击 */
			doSchArea(item){
				this.packInfo.strSchArea = item.stockArea
			},
			/* 入库库区点击确认 */
			pickerConfirm(e){
				if( e.value.length > 0 ){
					this.formData.strStockArea = e.value[0].stockArea
				}
				this.config.picker.show = false
			},
			/* 入库日期点击确认 */
			calendarConfirm(e){
				let arr = JSON.parse(JSON.stringify(e))
				this.formData.dInDate = arr[0]
				this.config.calendar.show = false
			},
			/* 入库 */
			doStockIn(){
				
			},
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
					this.$refs.directInList.clear()
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
		height: 650rpx;
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
	
	.form-item-50 {
		width: 50%;
	}
</style>