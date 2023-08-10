<template>
	<view class="content">
		<z-paging 
			ref="paging" 
			v-model="indexList" 
			:auto-show-system-loading="true"
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
			<u-card
				:head-border-bottom="false"
				:foot-border-top="false"
				:padding="15"
				margin="10rpx"
				:foot-style="{paddingTop:'0'}"
				v-for="(item, index) in indexList" :key="index"
				@click="itemClick(item)"
			>
				<view slot="head" class="card-header-container">
					<view class="card-body-item card-body-item-50">
						<text>订单号:{{ item.strOrderId }}</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>客订单号:{{ item.CusPoNo }}</text>
					</view>
				</view>
				<view slot="body" class="card-body-container">
					<view v-if="item.MatName" class="card-body-item card-body-item-50">
						<view class="card-body-txt">货品名称:{{ item.MatName }}</view>
					</view>
					<view class="card-body-item card-body-item-50">
						<view class="card-body-txt">材质:{{ item.BoardId }}</view>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt">
							客户:{{ item.CusId}}({{ item.CusShortName }})
						</view>
					</view>
					<view class="card-body-item card-body-item-50">
						<view class="card-body-txt">规格:{{ item.GuiGe }}</view>
					</view>
					<view class="card-body-item card-body-item-50">
						<view class="card-body-txt">压线:{{ item.ScoreInfo }}</view>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt blue-color">订单</view>/
						<view class="card-body-txt green-color">送货</view>/
						<view class="card-body-txt red-color">退货</view>:
						<view class="card-body-txt blue-color">{{ item.OrdQty }}</view>/
						<view class="card-body-txt green-color">{{ item.DeliQty }}</view>/
						<view class="card-body-txt red-color">{{ item.ReturnQty }}</view>
					</view>
				</view>
			</u-card>
		</z-paging>
		<webapp-popup-filter 
			:filterShow.sync="config.filter.show"
			:isTabbar="true"
			@reset="reset"
			@search="search"
		>
			<view>
				<webapp-cus-picker :cusId.sync="formData.cusId"></webapp-cus-picker>
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
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue'
	import WebappCusPicker from '@/components/webapp-cus-picker/webapp-cus-picker.vue'
	import WebappRangeDate from '@/components/webapp-range-date/webapp-range-date.vue'
	import WebappFilterBdSize from '@/components/webapp-filter-bd-size/webapp-filter-bd-size.vue'
	import WebappFilterBoxSize from '@/components/webapp-filter-box-size/webapp-filter-box-size.vue'
	import { getErpOrders, getErpConfig } from '@/api/staff/erpOrders.js'
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
				config:{
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
					},
					calendar: {
						show: false
					},
					filter: {
						show: false
					}
				},
				show:false,
				indexList: [],
				formData:{
					erpState: 0,
					//客户
					cusId: null,
					//订单编号
					cusOrderId: null,
					//订单数量
					ordQty:null,
					//纸箱尺寸
					boxL: null,
					boxW: null,
					boxH: null,
					//纸板尺寸
					bdL: null,
					bdW: null,
					//日期
					rangeDate: [ ],
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//日期类型
					dateType: 1, 
					//分页信息
					pageNo: 1,
					pageSize: 10,
					//可选日期范围
					maxDate: null,
					minDate: null,
					//页面是否需要重新请求参数
					pageInit: true,
				}
			}
		},
		onLoad() {
			
		},
		created() {
		
		},
		mounted() {
			
		},
		methods: {
			async queryList( pageNo, pageSize ){
				if( this.formData.pageInit ){
					const { result } = await getErpConfig();
					this.formData.minDate = result.Wap1GetOrdersMinDate
					this.formData.maxDate = result.Wap1GetOrdersMaxDate
					this.formData.beginDate = result.Wap1GetOrdersBeginDate
					this.formData.endDate = result.Wap1GetOrdersEndDate
					this.formData.rangeDate = [ this.formData.beginDate, this.formData.endDate ]
					this.formData.pageInit = false;
				}
				this.formData.pageNo = pageNo
				this.formData.pageSize = pageSize
				const { result } = await getErpOrders(this.formData)
				this.$refs.paging.complete(result)
			},
			tabsChange( evt ){
				this.formData.erpState = evt.index
			},
			close(){
				this.config.filter.show = false
			},
			dateTypeChange( item ){
				this.formData.dateType = item[0].id
			},
			dateConfirm( dateList ) {
				this.config.calendar.show = false
				this.formData.beginDate = dateList[0]
				this.formData.endDate = dateList[ dateList.length - 1 ]
			},
			itemClick(index){
				console.log(index)
			},
			reset(){
				this.formData = this.$options.data().formData
				this.$refs.paging.reload()
			},
			search(){
				this.$refs.paging.reload()
			}
		},
		computed: {
			erpStatusChange(){
				return this.formData.erpState;
			}
		},
		watch: {
			erpStatusChange( newV, oldV ){
				this.$refs.paging.reload();
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>
