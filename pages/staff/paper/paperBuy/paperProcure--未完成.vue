<!-- 原纸采购 -->
<template>
	<view>
		<!-- 筛选按钮 -->
		<liu-drag-button 
			v-show=" showMenu "
			:bottomPx="pageHeight*0.8"
			@clickBtn="filterClick"
		>
			<text>筛选</text>
		</liu-drag-button>
		<!-- 筛选框 -->
		<webapp-popup-filter
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>
			<!-- 日期区间 -->
			<webapp-range-date 
				:beginDate.sync="formData.beginDate"
				:endDate.sync="formData.endDate"
				:maxDate.sync="formData.maxDate"
				:minDate.sync="formData.minDate"
				:rangeDate.sync="formData.rangeDate"
			/>
		</webapp-popup-filter>
		<!-- 列表数据 -->
		<z-paging 
			ref="procure" 
			v-model="config.mock.mockList" 
			:auto-show-system-loading="true"
			@query="queryMock"
		>
			<view slot="top">
				<!-- 头部标签配置 -->
				<u-subsection
					:list="config.subsection.list"
					mode="subsection" 
					:current="formData.dataType"
					@change="sectionChange"
				>
				</u-subsection>
				<template v-if="formData.dataType == 1">
					<!-- 头部选择 -->
					<webapp-prv-next 
						:popupShow.sync="config.prevNext.popupShow"
						:radioData="config.prevNext.radioData" 
						:key="Math.random()"
						@radioConfirm="radioConfirm"
					/>
				</template>
			</view>
			<uni-card
				:title="item.title" 
				:is-shadow="true"
				v-for="(item, index) in config.mock.mockList" :key="index"
				@click="detailClick(item)"
			>
				<view class="card-body-container">
					<view v-if="formData.dataType == 0" class="card-body-item card-body-item-100">
						<text>采购日期:
							<text class="mg-left-20">{{ item.shortName }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>供应商:
							<text class="mg-left-20">{{ item.shortName }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>纸质种类: 
							<text class="mg-left-20">{{ item.sumPaper }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>收货/采购: 
							<text class="mg-left-20">{{ item.inQty }}/{{ item.pOQty }}</text>
						</text>
					</view>
				</view>
			</uni-card>
		</z-paging>
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from "@/components/webapp-popup-filter/webapp-popup-filter.vue"
	/* 自定义日期区间组件 */
	import WebappRangeDate from "@/components/webapp-range-date/webapp-range-date.vue"
	/* 自定义头部选择组件 */
	import WebappPrvNext from "@/components/webapp-prv-next/webapp-prv-next.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappRangeDate,
			WebappPrvNext
		},
		data() {
			return {
				/* 配置 */
				config: {
					/* 头部选择配置 */
					prevNext: {
						popupShow: false,
						radioData: [],
						
					},
					/* 筛选弹窗配置 */
					filter: {
						show: false,
						
					},
					/* 头部标签配置 */
					subsection: {
						list: ['全部', '按日期']
					},
					/* 模拟上拉加载数据 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: []
					},
				},
				/* 筛选条件 */
				formData: {
					//类型0->全部 1->按日期
					dataType: 0,
					//开始日期
					beginDate: '2023-06-01',
					//结束日期
					endDate: '2023-06-05',
					//最大日期
					maxDate: '2023-10-01',
					//最小日期
					minDate: '2023-04-01',
					//日期区间
					rangeDate: ['2023-06-01', '2023-06-05']
				}
			}
		},
		methods: {
			/* 筛选按钮点击 */
			filterClick(){
				this.config.filter.show = true
			},
			/* 头部选择选中后触发 */
			radioConfirm( val ){
				this.$refs.procure.reload()
			},
			/* 列表详细信息 */
			detailClick( row ){
				const data = {
						//数据类型 0->原纸收货 1->原纸采购
						dataType: 1,
						//供应商 
						shortName: row.shortName,
						//显示日期
						date: row.date,
						//对应的收货单号或者采购单号
						keyWord: row.title
					}
					uni.navigateTo({
						url: '/pages/staff/paper/paperBuy/detail?filterInfo='
							+ encodeURIComponent(JSON.stringify(data))
					})
				}
			},
			/* 筛选重置 */
			reset(){},
			/* 筛选点击 */
			search(){}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight",
			}),
			/* 监听是否有弹窗打开 */
			showMenu(){
				return !this.config.filter.show && !this.config.prevNext.popupShow
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>