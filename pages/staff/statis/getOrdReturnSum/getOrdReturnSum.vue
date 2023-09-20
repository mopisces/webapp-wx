<!-- 退货统计模块 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<!-- 列表数据 -->
		<z-paging
			ref="returnSum" 
			v-model="config.mock.mockList"
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryMock"
		>
			<uni-card
				:title="item.title" 
				:extra="'总数:' + item.sumCount"
				:is-shadow="true"
				v-for="(item, index) in config.mock.mockList" :key="index"
				@click="detailClick(item)"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>退货数量: 
							<text class="mg-left-20">{{ item.returnQty }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>退货费用:
							<text class="mg-left-20">{{ item.returnFee }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>销售面积:
							<text class="mg-left-20">{{ item.tSalesArea }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>合计金额:
							<text class="mg-left-20">{{ item.amt }}</text>
						</text>
					</view>
				</view>
			</uni-card>
		</z-paging>
		<!-- 筛选按钮 -->
		<liu-drag-button 
			v-if=" !config.filter.show "
			:bottomPx="pageHeight*0.8" 
			@clickBtn="filterClick"
		>
			<text>筛选</text>
		</liu-drag-button>
		<!-- 筛选内容 -->
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
						v-model="formData.stateType" 
						:localdata="config.checkBox.state">
					</uni-data-checkbox>
				</view>
			</view>
		</webapp-popup-filter>
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from "@/components/webapp-popup-filter/webapp-popup-filter.vue"
	/* 自定义日期范围组件 */
	import WebappRangeDate from "@/components/webapp-range-date/webapp-range-date.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { fetchReturnList } from "@/api/staff/statis.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappRangeDate
		},
		data(){
			return {
				/* 配置信息 */
				config: {
					/* 筛选弹窗配置 */
					filter: {
						show: false
					},
					/* 单选配置 */
					checkBox: {
						/* 日期类型 */
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
						/* 统计维度 */
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
					},
					/* 模拟 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: []
					}
				},
				/* 筛选条件 */
				formData: {
					//日期类型 3->退货日期 4->生效日期
					dateType: 4,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//退货统计类型 0->汇总 1->按退货原因 2->客户
					stateType: 0,
					//最大日期
					maxDate: null,
					//最小日期
					minDate: null,
					//日期区间
					rangeDate: [],
				},
			}
		},
		mounted() {
			this.getParams()
		},
		methods:{
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'returnSumStatis' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				this.formData.rangeDate = JSON.parse(JSON.stringify([this.formData.beginDate, this.formData.endDate]))
				this.$refs.returnSum.reload()
			},
			/* 获取列表数据 */
			async queryList(){
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await fetchReturnList(this.formData)
				this.config.mock.indexList = result
			},
			/* 模拟上拉加载下拉刷新数据 */
			async queryMock( pageNo, pageSize ){
				if( pageNo == 1 ){
					await this.queryList()
				}
				var subList = []
				if( this.config.mock.indexList.length > 0 ){
					subList = this.config.mock.indexList.splice( 0, pageSize )
				}
				setTimeout(()=>{
					this.$refs.returnSum.complete(subList)
				}, 1500)
			},
			/* 列表点击 */
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
				if( this.formData.stateType == 1 ){
					data.filterName = 4
					data.filterVal = row.title
				}
				if( this.formData.stateType == 2 ){
					data.filterName = 2
					data.filterVal = row.cusId
				}
				uni.navigateTo({
					url: '/pages/staff/statis/statisOrderList/statisOrderList?filterInfo='
						+ encodeURIComponent(JSON.stringify(Object.assign( {}, this.formData, data)))
				})
			},
			/* 点击筛选按钮 */
			filterClick(){
				this.config.filter.show = true
			},
			/* 筛选弹出点击重置 */
			reset(){
				this.formData = this.$options.data().formData
				this.getParams()
			},
			/* 筛选弹窗点击筛选 */
			search(){
				this.$refs.returnSum.reload()
			},
		},
		computed: {
			/* store中getter数据 */
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