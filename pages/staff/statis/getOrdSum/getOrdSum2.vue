<!-- 订单统计2 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<!-- 列表数据 -->
		<z-paging
			ref="ordSum2" 
			v-model="config.mock.mockList"
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryMock"
		>
			<view slot="top">
				<view class="amount-statis-card">
					<view class="bill-statis-list">
						<view class="bill-statis-item">
							<view class="bill-statis-text">
								下单金额
							</view>
							<view class="bill-statis-value">
								{{ statisData.ordSumAmt }}
							</view>
						</view>
						<view class="bill-statis-item">
							<view class="bill-statis-text">
								送货金额
							</view>
							<view class="bill-statis-value">
								{{ statisData.deliverSumAmt }}
							</view>
						</view>
						<view class="bill-statis-item">
							<view class="bill-statis-text">
								上月返点金额
							</view>
							<view class="bill-statis-value">
								{{ statisData.lastRebateSum }}
							</view>
						</view>
					</view>
				</view>
				<u-subsection 
					:list="config.subsection.list"
					mode="subsection" 
					:current="formData.dataType"
					@change="sectionChange"
				>
				</u-subsection>
			</view>
			<!-- 数据卡片 -->
			<uni-card
				v-for="(item, index) in config.mock.mockList" :key="index"
				:title=" item.title " 
				:extra=" item.extra "
				:is-shadow="true"
				:border="false"
			>
				<view class="card-body-container">
					<template v-if="formData.dataType == 1">
						<view class="card-body-item card-body-item-100">
							<text>订单尺寸:
								<text class="mg-left-20">{{ item.guige }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>退款金额:
								<text class="mg-left-20">{{ item.dNAmt }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>退款备注:
								<text class="mg-left-20">{{ item.returnProcess }}</text>
							</text>
						</view>
					</template>
					<template v-else>
						<view class="card-body-item card-body-item-100">
							<text>返利金额:
								<text class="mg-left-20">{{ item.amount }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>返利备注:
								<text class="mg-left-20">{{ item.remark }}</text>
							</text>
						</view>
					</template>
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
		<!-- 筛选弹窗 -->
		<webapp-popup-filter 
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>
			<view>
				<!-- 下单金额日期区间 -->
				<webapp-range-date 
					label="下单金额"
					:beginDate.sync="formData.beginOrderDate"
					:endDate.sync="formData.endOrderDate"
					:maxDate.sync="config.filter.rangeDate.orderDate.maxOrderDate"
					:minDate.sync="config.filter.rangeDate.orderDate.minOrderDate"
					:rangeDate.sync="config.filter.rangeDate.orderDate.rangeOrderDate"
				/>
				<!-- 收货金额日期区间 -->
				<webapp-range-date 
					label="收货金额"
					:beginDate.sync="formData.beginDNDate"
					:endDate.sync="formData.endDNDate"
					:maxDate.sync="config.filter.rangeDate.dNDate.maxDNDate"
					:minDate.sync="config.filter.rangeDate.dNDate.minDNDate"
					:rangeDate.sync="config.filter.rangeDate.dNDate.rangeDNDate"
				/>
			</view>
		</webapp-popup-filter>
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue'
	/* 自定义日期区间组件 */
	import WebappRangeDate from '@/components/webapp-range-date/webapp-range-date.vue'
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { fetchOrdSum2List } from '@/api/staff/statis.js'
	
	export default {
		components:{
			WebappPopupFilter,
			WebappRangeDate
		},
		data() {
			return {
				/* 配置 */
				config: {
					/* 模拟 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: []
					},
					/* 头部标签配置 */
					subsection: {
						/* 头部标签 */
						list: [
							'退货汇总',
							'返利汇总'
						]
					},
					/* 筛选弹窗 */
					filter: {
						show: false,
						/* 日期区间 */
						rangeDate: {
							orderDate: {
								//最大日期
								maxOrderDate: '2023-12-31',
								//最小日期
								minOrderDate: '2023-06-01',
								//日期区间
								rangeOrderDate: ['2023-06-01', '2023-06-29'],
							},
							dNDate: {
								//最大日期
								maxDNDate: '2023-12-31',
								//最小日期
								minDNDate: '2023-06-01',
								//日期区间
								rangeDNDate: ['2023-06-01', '2023-06-29'],
							}
						}
					}
				},
				/* 头部统计数据 */
				statisData: {
					/* 下单金额 */
					ordSumAmt: 0,
					/* 送货金额 */
					deliverSumAmt: 0,
					/* 上月返点金额 */
					lastRebateSum: 0
				},
				/* 筛选条件 */
				formData: {
					//类型0->退货汇总 1->返利汇总
					dataType: 0,
					//下单金额开始日期
					beginOrderDate: '2023-06-01',
					//下单金额结束日期
					endOrderDate: '2023-06-29',
					//开始日期
					beginDNDate: '2023-06-01',
					//结束日期
					endDNDate: '2023-06-29',
				}
			}
		},
		mounted() {
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'ordSum2Statis' } )
				this.formData.beginOrderDate = result.beginOrderDate
				this.formData.endOrderDate = result.endOrderDate
				this.config.filter.rangeDate.orderDate.minOrderDate = result.minOrderDate
				this.config.filter.rangeDate.orderDate.maxOrderDate = result.maxOrderDate
				this.config.filter.rangeDate.orderDate.rangeOrderDate = JSON.parse(
					JSON.stringify([this.formData.beginOrderDate, this.formData.endOrderDate])
				)
				
				this.formData.beginDNDate = result.beginDNDate
				this.formData.endDNDate = result.endDNDate
				
				this.config.filter.rangeDate.dNDate.minDNDate = result.minOrderDate
				this.config.filter.rangeDate.dNDate.maxDNDate = result.maxOrderDate
				this.config.filter.rangeDate.dNDate.rangeDNDate = JSON.parse(
					JSON.stringify([this.formData.beginDNDate, this.formData.endDNDate])
				)
				
				this.$refs.ordSum2.reload()
			},
			/* 头部切换选中标签 */
			sectionChange( index ){
				this.formData.dataType = index
				this.$refs.ordSum2.reload()
			},
			/* 点击筛选按钮 */
			filterClick(){
				this.config.filter.show = true
			},
			/* 获取列表数据 */
			async queryList(){
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await fetchOrdSum2List(this.formData)
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
					this.$refs.ordSum2.complete(subList)
				}, 1500)
			},
			/* 筛选弹出点击重置 */
			reset(){
				this.formData = this.$options.data().formData
				this.config.filter.rangeDate = this.$options.data().config.filter.rangeDate
				this.getParams()
			},
			/* 筛选弹窗点击筛选 */
			search(){
				this.$refs.ordSum2.reload()
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
	
	.amount-statis-card{
		padding: 5rpx 10rpx;
		width: 730rpx;
		height: 150rpx;
	}
	
	.bill-statis-list{
		width: 100%;
		height: 140rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 16rpx;
		padding-top: 2rpx;
	}
	
	.bill-statis-item{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.bill-statis-text{
		padding-bottom: 6rpx;
	}
	
	.bill-statis-value{
		font-size: 32rpx; 
	}
</style>
