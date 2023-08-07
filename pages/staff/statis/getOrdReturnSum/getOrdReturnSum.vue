<template>
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<view>
			<uni-card
				:title="item.title" 
				:extra="'总数:' + item.sumCount"
				:is-shadow="true"
				v-for="(item, index) in listData" :key="index"
				@click="fetchDetail(item)"
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
			<view class="popup-filter-item margin20" @click="config.calendar.show = true">
				<view class="popup-filter-title">日期区间</view>
				<view class="popup-filter-content popup-filter-input">
					<view>
						<u--input
							v-model="formData.beginDate" 
							placeholder="开始日期" 
							:disabled="true"
							:disableDefaultPadding="true" 
							inputAlign="center" 
						>
						</u--input>
					</view>
					<view>~</view>
					<view>
						<u--input
							v-model="formData.endDate" 
							placeholder="结束日期" 
							:disabled="true"
							:disableDefaultPadding="true" 
							inputAlign="center" 
						>
						</u--input>
					</view>
					<view>
						<u-icon name="arrow-right" color="#2979ff" size="15"></u-icon>
					</view>
				</view>
			</view>
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">统计类型</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.statisState" 
						:localdata="config.checkBox.state">
					</uni-data-checkbox>
				</view>
			</view>
			<!-- <view class="popup-filter-item margin20">
				<view class="popup-filter-title">统计方式</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.sWay" 
						:localdata="config.checkBox.sWay">
					</uni-data-checkbox>
				</view>
			</view>
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">图表类型</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.chartType" 
						:localdata="config.checkBox.chartType">
					</uni-data-checkbox>
				</view>
			</view>
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">图表属性</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.chartProp" 
						:localdata="config.checkBox.chartProp">
					</uni-data-checkbox>
				</view>
			</view> -->
		</webapp-popup-filter>
	</view>
</template>

<script>
	import { fetchReturnList } from '@/api/staff/statis.js';
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue';
	import { mapGetters } from "vuex";
	export default {
		components:{
			WebappPopupFilter
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
						sWay:[
							{
								text: '列表',
								value: 0,
							},
							{
								text: '图表',
								value: 1,
							},
						],
						chartType: [
							{
								text: '饼状图',
								value: 0,
							},
							{
								text: '柱状图',
								value: 1,
							},
							{
								text: '直线图',
								value: 2,
							},
						],
						chartProp: [
							{
								text: '退货数',
								value: 0,
							},
							{
								text: '退货附加费',
								value: 1,
							},
							{
								text: '销售面积',
								value: 2,
							},
							{
								text: '总金额',
								value: 3,
							},
							{
								text: '总款数',
								value: 4,
							}
						]
					},
					chart: {
						options: {
							padding: [5,5,5,5],
							enableScroll: false,
							extra: {
								pie: {
									activeOpacity: 0.5,
									activeRadius: 10,
									offsetAngle: 0,
									labelWidth: 15,
									border: false,
									borderWidth: 3,
									borderColor: "#FFFFFF"
								}
							}
						},
						chartData: {
							returnQty: {},
							returnFee: {},
							salesArea: {},
							amt: {},
							sumCount: {}
						}
					}
				},
				listData: [],
				formData: {
					//日期类型
					dateType: 4,
					//开始日期
					beginDate: '2023-06-01',
					//结束日期
					endDate: '2023-06-29',
					//统计类型
					statisState: 0,
					//统计方式
					sWay: 1,
					//图表类型
					chartType: 0,
					//图标属性
					chartProp: 0
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
				this.listData = [];
				const { result } = await fetchReturnList(this.formData);
				this.listData = result;
				/* if( this.formData.sWay == 0 ){
					this.listData = result;
				}else {
					this.config.chart.chartData.returnQty = JSON.parse(JSON.stringify(result.returnQty));
					this.config.chart.chartData.returnFee = JSON.parse(JSON.stringify(result.returnFee));
					this.config.chart.chartData.salesArea = JSON.parse(JSON.stringify(result.salesArea));
					this.config.chart.chartData.amt = JSON.parse(JSON.stringify(result.amt));
					this.config.chart.chartData.sumCount = JSON.parse(JSON.stringify(result.sumCount));
				} */
				
			},
			fetchDetail( row ){
				
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
</style>

<style>
	
	.card-body-container{
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-flow: wrap;
	}
	
	.card-body-item{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	
	.chart-container{
		width: 100%;
		height: 500rpx;
	}
</style>