<!-- 订单统计1模块 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<!-- 列表数据 -->
		<z-paging
			ref="ordSum1" 
			v-model="config.mock.mockList"
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryMock"
		>
			<uni-card
				:title="item.title" 
				:extra="item.extra"
				:is-shadow="true"
				v-for="(item, index) in config.mock.mockList" :key="index"
				@click="detailClick(item)"
			>
				<view class="card-body-item card-body-item-100">
					<text>合计面积:
						<text class="mg-left-20">{{ item.sumArea }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>订单面积:
							<text class="mg-left-20">{{ item.sumOrdArea }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>订单体积:
							<text class="mg-left-20">{{ item.sumOrdVol }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>合计长度:
							<text class="mg-left-20">{{ item.sumLength }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>合计金额:
							<text class="mg-left-20">{{ item.sumAmt }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>订单总数:
							<text class="mg-left-20">{{ item.sumQty }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>合计款数:
							<text class="mg-left-20">{{ item.sumCount }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>单坑面积:
							<text class="mg-left-20">{{ item.sumArea1 }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>单坑长度:
							<text class="mg-left-20">{{ item.sumLength1 }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>单坑金额:
							<text class="mg-left-20">{{ item.sumAmt1 }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>单坑款数:
							<text class="mg-left-20">{{ item.sumCount1 }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>双坑面积:
							<text class="mg-left-20">{{ item.sumArea2 }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>双坑长度:
							<text class="mg-left-20">{{ item.sumLength2 }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>双坑金额:
							<text class="mg-left-20">{{ item.sumAmt2 }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>双坑款数:
							<text class="mg-left-20">{{ item.sumCount2 }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>三坑面积:
							<text class="mg-left-20">{{ item.sumArea3 }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>三坑长度:
							<text class="mg-left-20">{{ item.sumLength3 }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>三坑金额:
							<text class="mg-left-20">{{ item.sumAmt3 }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>三坑款数:
							<text class="mg-left-20">{{ item.sumCount3 }}</text>
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
				:isTabbar="false"
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
	import WebappPopupFilter from "@/components/webapp-popup-filter/webapp-popup-filter.vue"
	/* 自定义日期范围组件 */
	import WebappRangeDate from "@/components/webapp-range-date/webapp-range-date.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { fetchOrdSum1List } from "@/api/staff/statis.js" 
	
	export default {
		components:{
			WebappPopupFilter,
			WebappRangeDate
		},
		data() {
			return {
				/* 配置信息 */
				config: {
					/* 筛选弹窗配置 */
					filter: {
						show: false,
						/* 单选配置 */
						checkBox: {
							/* 日期类型 */
							dateType: [
								{
									text: '订单日期',
									value: 1,
								},
								{
									text: '交货日期',
									value: 2,
								}
							],
							/* 统计维度 */
							state: [
								{
									text: '汇总',
									value: 0,
								},
								{
									text: '坑型',
									value: 1,
								},
								{
									text: '客户',
									value: 2,
								},
								{
									text: '业务员',
									value: 3,
								},
							]
						}
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
					//日期类型 1->订单日期 2->交货日期
					dateType: 1,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//统计维度0->汇总 1->坑型 2->客户 3->业务员
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
		mounted() {
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'ordSum1Statis' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				this.formData.rangeDate = JSON.parse(JSON.stringify([this.formData.beginDate, this.formData.endDate]))
				this.$refs.ordSum1.reload()
			},
			/* 获取列表数据 */
			async queryList(){
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await fetchOrdSum1List(this.formData)
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
					this.$refs.ordSum1.complete(subList)
				}, 1500)
			},
			/* 列表点击 */
			detailClick( row ){
				const data = {
					//存储过程GetOrders的类型 1->GetOrderSum 2->GetOrdReturnSum 3->GetOrdStock
					getOrdersType: 1, 
					//筛选条件 1->门幅 2->客户 3->业务员
					filterName: null,
					//筛选内容
					filterVal: null,
					//1->显示退货数 2->显示库存数
					showQtyType: 1
				}
				if( this.formData.stateType == 1 ){
					data.filterName = 1
					data.filterVal = row.flutes
				}
				if( this.formData.stateType == 2 ){
					data.filterName = 2
					data.filterVal = row.cusId
				}
				if( this.formData.stateType == 3 ){
					data.filterName = 3
					data.filterVal = row.taskId
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
				this.$refs.ordSum1.reload()
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