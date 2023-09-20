<!-- 生产分析总计 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<!-- 列表数据 -->
		<z-paging
			ref="proInfo" 
			v-model="config.indexList"
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryList"
		>
			<!-- 头部标签 -->
			<view slot="top">
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
				v-for="(item, index) in config.indexList" :key="index"
				:title=" item.title " 
				:is-shadow="true"
				:border="false"
			>
				<view class="card-body-container">
					<template v-if="formData.dataType == 0">
						<view class="card-body-item card-body-item-100">
							<text>订单面积:
								<text class="mg-left-20">{{ item.sumOrdArea }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>合计金额:
								<text class="mg-left-20">{{ item.sumAmt }}</text>
							</text>
						</view>
					</template>
					<template v-else>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-item card-body-item-50">
								<text>订单平方:
									<text class="mg-left-20">{{ item.tOrdArea }}</text>
								</text>
							</view>
							<view class="card-body-item card-body-item-50">
								<text>订单米数:
									<text class="mg-left-20">{{ item.tOrdLen }}</text>
								</text>
							</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>订单金额:
								<text class="mg-left-20">{{ item.ordAmt }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-item card-body-item-50">
								<text>排产平方:
									<text class="mg-left-20">{{ item.schArea }}</text>
								</text>
							</view>
							<view class="card-body-item card-body-item-50">
								<text>排产米数:
									<text class="mg-left-20">{{ item.schLen }}</text>
								</text>
							</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-item card-body-item-50">
								<text>入库平方:
									<text class="mg-left-20">{{ item.ordInArea }}</text>
								</text>
							</view>
							<view class="card-body-item card-body-item-50">
								<text>入库金额:
									<text class="mg-left-20">{{ item.ordInAmt }}</text>
								</text>
							</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-item card-body-item-50">
								<text>送货平方:
									<text class="mg-left-20">{{ item.dNArea }}</text>
								</text>
							</view>
							<view class="card-body-item card-body-item-50">
								<text>送货金额:
									<text class="mg-left-20">{{ item.dNAmt }}</text>
								</text>
							</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-item card-body-item-50">
								<text>退货平方:
									<text class="mg-left-20">{{ item.reArea }}</text>
								</text>
							</view>
							<view class="card-body-item card-body-item-50">
								<text>退货金额:
									<text class="mg-left-20">{{ item.reAmt }}</text>
								</text>
							</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>车资运费:
								<text class="mg-left-20">{{ item.transAmt }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-item card-body-item-50">
								<text>本期收款:
									<text class="mg-left-20">{{ item.cusPayAmt }}</text>
								</text>
							</view>
							<view class="card-body-item card-body-item-50">
								<text>折扣调账:
									<text class="mg-left-20">{{ item.adjustAmt }}</text>
								</text>
							</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-item card-body-item-50">
								<text>原纸用量:
									<text class="mg-left-20">{{ item.sUseWt }}</text>
								</text>
							</view>
							<view class="card-body-item card-body-item-50">
								<text>原纸金额:
									<text class="mg-left-20">{{ item.sUseAmt }}</text>
								</text>
							</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>入库重量比例(%):
								<text class="mg-left-20">{{ item.sInWtRate }}</text>
							</text>
						</view>
					</template>
				</view>
			</uni-card>
		</z-paging>
		<!-- 筛选按钮 -->
		<liu-drag-button 
			v-if=" !config.filter.show "
			:bottomPx=" pageHeight*0.8 " 
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
			<view v-if="formData.dataType==1" class="popup-filter-item margin20">
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
	
	import { fetchProInfoList } from "@/api/staff/tool.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappRangeDate
		},
		data() {
			return {
				/* 配置 */
				config: {
					/* 筛选弹窗配置 */
					filter: {
						show: false,
						/* 单选配置 */
						checkBox: {
							/* 日期类型配置 */
							dateType: [
								{
									text: '退货日期',
									value: 3,
								},
								{
									text: '生效日期',
									value: 4,
								}
							]
						}
					},
					/* 头部标签配置 */
					subsection: {
						/* 头部标签 */
						list: [
							'简单统计',
							'全部统计'
						]
					},
					/* 原始数据 */
					indexList: []
				},
				/* 筛选条件 */
				formData: {
					//类型0->简单统计 1->全部统计
					dataType: 0,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最大日期
					maxDate: null,
					//最小日期
					minDate: null,
					//日期区间
					rangeDate: [],
					//日期类型 3->退货日期 4->生效日期
					dateType: 3,
				}
			}
		},
		onReady() {
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'proInfoTool' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				this.formData.rangeDate = JSON.parse(
					JSON.stringify([this.formData.beginDate, this.formData.endDate])
				)
				this.$refs.proInfo.reload()
			},
			/* 头部切换选中标签 */
			sectionChange(index){
				this.formData.dataType = index
				this.$refs.proInfo.reload()
			},
			/* 点击筛选按钮 */
			filterClick(){
				this.config.filter.show = true
			},
			/* 获取列表数据 */
			async queryList( pageNo, pageSize ){
				const { result } = await fetchProInfoList( this.formData )
				this.$refs.proInfo.complete( result )
			},
			/* 筛选弹出点击重置 */
			reset(){
				this.formData = this.$options.data().formData
				this.getParams()
			},
			/* 筛选弹窗点击筛选 */
			search(){
				this.$refs.proInfo.reload()
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