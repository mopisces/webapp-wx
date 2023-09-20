<!-- 传单统计模块 -->
<template>
	<view>
		<!-- 筛选按钮 -->
		<liu-drag-button 
			v-show=" showMenu "
			:bottomPx=" pageHeight * 0.8 "
			@clickBtn="filterClick"
		>
			<text>筛选</text>
		</liu-drag-button>
		<!-- 列表数据 -->
		<z-paging 
			ref="schSum" 
			v-model="config.mock.mockList"
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryMock"
		>
			<uni-card
				:title="item.title" 
				:is-shadow="true"
				v-for="(item, index) in config.mock.mockList" 
				:key="index"
				@click="detailClick(item)"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>订单面积:
							<text class="mg-left-20">{{ item.sumOrdArea }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>合计长度:
							<text class="mg-left-20">{{ item.sumLength }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>平均修边:
							<text class="mg-left-20">{{ item.avgTrim }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>平均门幅:
							<text class="mg-left-20">{{ item.avgPW }}</text>
						</text>
					</view>
					<!-- <view class="card-body-item card-body-item-100">
						<text>合计款数:
							<text class="mg-left-20">{{ item.stockQty }}</text>
						</text>
					</view> -->
				</view>
			</uni-card>
		</z-paging>
		
		
		<!-- 筛选内容 -->
		<webapp-popup-filter
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>
			<!-- 完工状态 -->
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">完工状态</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.finState" 
						:localdata="config.filter.checkBox.finState">
					</uni-data-checkbox>
				</view>
			</view>
			<!-- 日期类型 -->
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">日期类型</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.dateType" 
						:localdata="config.filter.checkBox.dateType">
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
						v-model="formData.stateType" 
						:localdata="config.filter.checkBox.state">
					</uni-data-checkbox>
				</view>
			</view>
		</webapp-popup-filter>
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue'
	/* 自定义日期范围组件 */
	import WebappRangeDate from '@/components/webapp-range-date/webapp-range-date.vue'
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { fetchSchSumList } from "@/api/staff/statis.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappRangeDate
		},
		data() {
			return {
				/* 页面配置 */
				config: {
					/* 筛选配置 */
					filter: {
						show: false,
						/* 单选配置 */
						checkBox: {
							/* 统计维度 */
							state: [
								{
									text: '汇总',
									value: 0,
								},
								{
									text: '生产线',
									value: 1,
								},
								{
									text: '门幅',
									value: 2,
								},
								{
									text: '坑型',
									value: 3,
								}
							],
							/* 日期类型配置 */
							dateType: [
								{
									text: '生产日期',
									value: 5,
								}
							],
							/* 完工状态 */
							finState: [
								{
									text: '全部',
									value: 0,
								},
								{
									text: '已传',
									value: 1,
								},
								{
									text: '已提取',
									value: 2,
								}
							]
						}
					},
					/* 模拟上拉加载数据 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: []
					}
				},
				/* 筛选条件 */
				formData: {
					//完工状态 0->全部 1->已传 2->已提取
					finState: 0,
					//日期类型 5->生产日期
					dateType: 5,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//统计维度0->汇总 1->生产线 2->门幅 3->坑型
					stateType: 0,
					//最大日期
					maxDate: null,
					//最小日期
					minDate: null,
					//日期区间
					rangeDate: [],
				}
			}
		},
		mounted(){
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'schSumStatis' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				this.formData.rangeDate = JSON.parse(JSON.stringify([this.formData.beginDate, this.formData.endDate]))
				this.$refs.schSum.reload()
			},
			/* 获取列表数据 */
			async queryList(){
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await fetchSchSumList( this.formData )
				this.config.mock.indexList = result
			},
			/* 模拟上拉加载下拉刷新数据 */
			async queryMock( pageNo, pageSize ){
				if( pageNo == 1 ){
					await this.queryList()
				}
				var subList = []
				if( this.config.mock.indexList.length > 0 ){
					subList = this.config.mock.indexList.splice(0, pageSize )
				}
				setTimeout(()=>{
					this.$refs.schSum.complete(subList)
				}, 1500)
			},
			/* 筛选按钮点击 */
			filterClick(){
				this.config.filter.show = true
			},
			/* 筛选弹出点击重置 */
			reset(){
				this.formData = this.$options.data().formData
				this.getParams()
			},
			/* 筛选弹出点击筛选 */
			search(){
				this.$refs.schSum.reload()
			},
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight" 
			}),
			/* 监听是否有弹窗打开 */
			showMenu(){
				return !this.config.filter.show
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>