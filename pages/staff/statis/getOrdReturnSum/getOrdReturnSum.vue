<template>
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<view>
			<uni-card
				:title="item.title" 
				:extra="'总数:' + item.sumCount"
				:is-shadow="true"
				v-for="(item, index) in listData" :key="index"
				@click="detailClick(item)"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>退货数量: 
							<text class="mg-left-20">{{ item.ReturnQty }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>退货费用:
							<text class="mg-left-20">{{ item.ReturnFee }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>销售面积:
							<text class="mg-left-20">{{ item.TSalesArea }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>合计金额:
							<text class="mg-left-20">{{ item.Amt }}</text>
						</text>
					</view>
				</view>
			</uni-card>
		</view>
		<liu-drag-button 
			v-if=" !config.filter.show "
			:bottomPx="pageHeight*0.8" 
			@clickBtn="filterClick"
		>
			<text>筛选</text>
		</liu-drag-button>
		<webapp-popup-filter
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>
			<!-- 日期类型 -->
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">日期类型</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.dateType" 
						:localdata="config.checkBox.dateType">
					</uni-data-checkbox>
				</view>
			</view>
			<!-- 日期区间 -->
			<webapp-range-date 
				:beginDate.sync="formData.beginDate"
				:endDate.sync="formData.endDate"
				:maxDate.sync="formData.maxDate"
				:minDate.sync="formData.minDate"
				:rangeDate.sync="formData.rangeDate"
			/>
			<!-- 统计类型 -->
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">统计类型</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.statReturnType" 
						:localdata="config.checkBox.state">
					</uni-data-checkbox>
				</view>
			</view>
		</webapp-popup-filter>
	</view>
</template>

<script>
	import { fetchReturnList } from '@/api/staff/statis.js'
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue'
	import WebappRangeDate from '@/components/webapp-range-date/webapp-range-date.vue'
	import { mapGetters } from "vuex"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappRangeDate
		},
		data(){
			return {
				config: {
					scroll: {
						refresher: {
							triggered: false
						}
					},
					filter: {
						show: false
					},
					calendar: {
						show: false
					},
					checkBox: {
						dateType: [
							{
								text: '退货日期',
								value: 3,
							},
							{
								text: '生效日期',
								value: 4,
							}
						],
						state: [
							{
								text: '汇总',
								value: 0,
							},
							{
								text: '原因',
								value: 1,
							},
							{
								text: '客户',
								value: 2,
							}
						],
					}
				},
				listData: [],
				formData: {
					//日期类型 3->退货日期 4->生效日期
					dateType: 4,
					//开始日期
					beginDate: '2023-06-01',
					//结束日期
					endDate: '2023-06-29',
					//退货统计类型 0->汇总 1->按退货原因 2->客户
					statReturnType: 0
				},
			}
		},
		mounted() {
			
		},
		onReady(){
			this.queryList();
		},
		methods:{
			async queryList(){
				this.listData = []
				const { result } = await fetchReturnList(this.formData)
				this.listData = result
			},
			detailClick( row ){
				const data = {
					//存储过程GetOrders的类型 1->GetOrderSum 2->GetOrdReturnSum 3->GetOrdStock
					getOrdersType: 2, 
					//筛选条件 1->门幅 2->客户 3->业务员 4->退货原因
					filterName: null,
					//筛选内容
					filterVal: null,
					//1->显示退货数 2->显示库存数
					showQtyType: 1
				}
				if( this.formData.statReturnType == 1 ){
					data.filterName = 4
					data.filterVal = row.ReturnCause
				}
				if( this.formData.statReturnType == 2 ){
					data.filterName = 2
					data.filterVal = row.CusId
				}
				uni.navigateTo({
					url: '/pages/staff/statis/statisOrderList/statisOrderList?filterInfo='
						+ encodeURIComponent(JSON.stringify(Object.assign( this.formData, data)))
				})
			},
			filterClick(){
				this.config.filter.show = true;
			},
			search(){
				this.queryList();
			},
			onPullDownRefresh(){
				this.queryList();
				uni.stopPullDownRefresh();
			}
		},
		computed: {
			...mapGetters({
				pageHeight: "page/pageHeight" 
			}),
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>