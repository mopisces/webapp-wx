<!-- ERP订单 -->
<template>
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view class="content">
		<!-- 订单列表 -->
		<z-paging 
			ref="erpOrder" 
			v-model="indexList" 
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryList"
		>
			<view slot="top">
				<u-tabs 
					:current="formData.erpState" 
					:list="config.tabs.list" 
					keyName="name"
					@change="tabsChange"
				>
					<view
						slot="right"
						style="padding-left: 8rpx;"
						@tap="config.filter.show = true"
					>
						<u-icon
							name="list"
							size="21"
							bold
						></u-icon>
					</view>
				</u-tabs>
			</view>
			<!-- 数据卡片 -->
			<uni-card
				v-for="(item, index) in indexList" :key="index"
				:title=" item.strOrderId " 
				:extra=" item.cusPoNo "
				:is-shadow="true"
				:border="false"
				@click="itemClick(item)"
			>
				<view class="card-body-container">
					<view v-if="item.MatName" class="card-body-item card-body-item-50">
						<text>货品名称:
							<text class="mg-left-20">{{ item.matName }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>客户信息:
							<text class="mg-left-20">{{ item.cusId }}({{ item.cusShortName }})</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>规格信息:
							<text class="mg-left-20">{{ item.boardId }}</text>
							<text class="mg-left-20">{{ item.guiGe }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>压线信息:
							<text class="mg-left-20">{{ item.scoreInfo }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt blue-color">订单</view>/
						<view class="card-body-txt green-color">送货</view>/
						<view class="card-body-txt red-color">退货</view>:
						<view class="card-body-txt blue-color mg-left-20">{{ item.ordQty }}</view>/
						<view class="card-body-txt green-color">{{ item.deliQty }}</view>/
						<view class="card-body-txt red-color">{{ item.returnQty }}</view>
					</view>
				</view>
			</uni-card>
		</z-paging>
		<!-- 筛选弹窗 -->
		<webapp-popup-filter 
			:filterShow.sync="config.filter.show"
			:isTabbar="true"
			@reset="filterReset"
			@search="filterSearch"
		>
			<view>
				<webapp-cus-picker ref="cusId" :cusId.sync="formData.cusId"></webapp-cus-picker>
				<view class="popup-filter-item margin20">
					<view class="popup-filter-title">订单编号</view>
					<view class="popup-filter-content popup-filter-input">
						<view class="width100">
							<u--input
								v-model="formData.cusOrderId" 
								placeholder="订单编号" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								>
							</u--input>
						</view>
					</view>
				</view>
					
				<view class="popup-filter-item margin20">
					<view class="popup-filter-title">订单数量</view>
					<view class="popup-filter-content popup-filter-input">
						<view class="width100">
							<u--input
								v-model="formData.ordQty" 
								placeholder="订单数量" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								>
							</u--input>
						</view>
					</view>
				</view>
				<!-- 纸箱尺寸 -->
				<webapp-filter-box-size
					:boxL.sync="formData.boxL"
					:boxW.sync="formData.boxW"
					:boxH.sync="formData.boxH"
				/>
				<!-- 纸板尺寸 -->
				<webapp-filter-bd-size
					:bdL.sync="formData.bdL"
					:bdW.sync="formData.bdW"
				/>
				<!-- 日期区间 -->
				<webapp-range-date 
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
					:rangeDate.sync="formData.rangeDate"
				/>
					
				<view class="popup-filter-checkbox margin20">
					<view class="popup-filter-title">日期类型</view>
					<view class="popup-filter-content popup-filter-input">
						<uni-data-checkbox
							mode="tag"
							v-model="formData.dateType" 
							:localdata="config.checkBox.options">
						</uni-data-checkbox>
					</view>
				</view>
				
			</view>
		</webapp-popup-filter>
		
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from "@/components/webapp-popup-filter/webapp-popup-filter.vue"
	/* 自定义客户选择组件 */
	import WebappCusPicker from "@/components/webapp-cus-picker/webapp-cus-picker.vue"
	/* 自定义日期区间组件 */
	import WebappRangeDate from "@/components/webapp-range-date/webapp-range-date.vue"
	/* 自定义纸板尺寸组件 */
	import WebappFilterBdSize from "@/components/webapp-filter-bd-size/webapp-filter-bd-size.vue"
	/* 自定义纸箱尺寸组件 */
	import WebappFilterBoxSize from "@/components/webapp-filter-box-size/webapp-filter-box-size.vue"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { fetchList } from "@/api/staff/erpOrders.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappCusPicker,
			WebappRangeDate,
			WebappFilterBdSize,
			WebappFilterBoxSize
		},
		data() {
			return {
				//页面组件配置
				config:{
					//头部标签配置
					tabs:{
						list:[
							{
								name:'全部'
							},
							{
								name:'未审核'
							},
							{
								name:'已审核'
							},
							{
								name:'已传单'
							},
							{
								name:'已入库'
							},
							{
								name:'已送货'
							},
							{
								name:'有退货'
							}
						]
					},
					//筛选配置
					filter: {
						show: false
					},
					//筛选日期类型配置
					checkBox: {
						options: [
							{
								text: '订单日期',
								value:1,
							},
							{
								text: '交货日期',
								value:2,
							}
							
						]
					}
				},
				//筛选条件
				formData:{
					//订单类型
					erpState: 0,
					//客户
					cusId: null,
					//订单编号
					cusOrderId: null,
					//订单数量
					ordQty:null,
					//纸箱长
					boxL: null,
					//纸箱宽
					boxW: null,
					//纸箱高
					boxH: null,
					//纸板长
					bdL: null,
					//纸板高
					bdW: null,
					//日期区间
					rangeDate: [],
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//可选日期范围最大
					maxDate: null,
					//可选日期范围最小
					minDate: null,
					//日期类型
					dateType: 1, 
					//分页信息
					pageNo: 1,
					//当前页数量
					pageSize: 10,
				},
				//数据列表
				indexList: []
			}
		},
		onLoad() {
			
		},
		mounted() {
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'erpOrder' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				//测试
				/* this.formData.beginDate = '2023-04-01'
				this.formData.endDate = '2023-06-30' */
				
				this.formData.rangeDate = JSON.parse(
					JSON.stringify([this.formData.beginDate, this.formData.endDate])
				)
				this.$refs.erpOrder.reload()
			},
			/* 获取订单列表 */
			async queryList( pageNo, pageSize ){
				this.formData.pageNo = pageNo
				this.formData.pageSize = pageSize
				const { result } = await fetchList(this.formData)
				this.$refs.erpOrder.complete(result)
			},
			/* 头部切换选中标签 */
			tabsChange( evt ){
				this.formData.erpState = evt.index
				this.$refs.erpOrder.reload()
			},
			/* 列表点击 */
			itemClick(rowData){
				//this.config.filter.show = true
				uni.navigateTo({
					url: '/pages/common/orderDetail/index?filterInfo='
						+ encodeURIComponent(JSON.stringify(rowData))
				})
			},
			/* 筛选重置 */
			async filterReset(){
				this.formData = this.$options.data().formData
				this.$refs.cusId.onClear()
				await this.getParams()
			},
			/* 筛选搜索 */
			filterSearch(){
				this.$refs.erpOrder.reload()
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>
