<!-- 接单统计模块 -->
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
		
		<view>
			<!-- 分段器 -->
			<view id="subSectionHeader">
				<u-sticky offset-top="0">
					<u-subsection 
						:list="config.subSection.options" 
						:current="formData.subSection"
						@change="sectionChange"
					>
					</u-subsection>
				</u-sticky>
			</view>
			
			<template v-if="formData.subSection == 0">
				<!-- 表格 -->
				<view :style=" 'height:' + config.table.halfHeight + 'px;width:100%;' ">
					<zb-table
						:show-header="true" 
						:columns="config.table.columns.orderColumn"
						:stripe="true"
						:fit="false"
						:border="true"
						:data="config.table.data.ordSum"
					></zb-table>
				</view>
				<view :style=" 'height:' + config.table.halfHeight + 'px;width:100%;' ">
					<zb-table
						:show-header="true" 
						:columns="config.table.columns.metersColumn"
						:stripe="true"
						:fit="false"
						:border="true"
						:data="config.table.data.planSum"
					></zb-table>
				</view>
			</template>
			<template v-if="formData.subSection == 1">
				<view :style=" 'height:' + config.table.height + 'px;width:100%;' ">
					<zb-table
						:show-header="true" 
						:columns="config.table.columns.cusColumn"
						:stripe="true"
						:fit="false"
						:border="true"
						:data="config.table.data.cusOrdSum"
					></zb-table>
				</view>
			</template>
			<template v-if="formData.subSection == 2">
				<view :style=" 'height:' + config.table.height + 'px;width:100%;' ">
					<zb-table
						:show-header="true" 
						:columns="config.table.columns.taskColumn"
						:stripe="true"
						:fit="false"
						:border="true"
						:data="config.table.data.taskOrdSum"
					></zb-table>
				</view>
			</template>
		</view>
		
		<!-- 筛选内容 -->
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
	
	import { fetchSaleStatisList } from "@/api/staff/statis.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappRangeDate
		},
		data() {
			return {
				/* 页面配置 */
				config: {
					/* 筛选弹窗配置 */
					filter: {
						show: false
					},
					/* 头部分段器配置 */
					subSection: {
						options: [
							'接单',
							'客户',
							'业务员'
						]
					},
					/* 表格配置 */
					table: {
						//表格高度
						height: null,
						halfHeight: null,
						//表格字段配置
						columns: {
							//米数表格
							metersColumn: [
								{ name: 'lineId', label: '线别', fixed: true, width: 120 },
								{ name: 'workGroupN', label: '班组名称', width: 120, },
								{ name: 'pSLength', label: '米数', width: 135, }
							],
							//订单表格
							orderColumn: [
								{ name: 'fluteName', label: '类别', fixed: true, width: 80 },
								{ name: 'tLength', label: '总长', width: 80, },
								{ name: 'tOrdArea', label: '总面积', width: 120, },
								{ name: 'tAmt', label: '总金额', width: 120, }
							],
							//客户表格
							cusColumn: [
								{ name: 'cusShortName', label: '客户', fixed: true, width: 120 },
								{ name: 'tLength', label: '米数', width: 120, },
								{ name: 'amt', label: '金额', width: 135 }
							],
							//业务员表格
							taskColumn: [
								{ name: 'taskName', label: '业务员', fixed: true, width: 120 },
								{ name: 'tLength', label: '米数', width: 120, },
								{ name: 'amt', label: '金额', width: 135, }
							]
						},
						/* 表格数据 */
						data: {
							//米数表格数据
							planSum: [],
							//订单表格数据
							ordSum: [],
							//客户表格数据
							cusOrdSum: [],
							//业务员表格数据
							taskOrdSum: [],
						}
					}
				},
				/* 筛选条件 */
				formData: {
					// 分段器当前选择 0->接单 1->客户 2->业务员
					subSection: 1,
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
				}
			}
		},
		onReady() {
			this.setTable()
		},
		mounted(){
			this.$nextTick(()=>{
				this.getParams()
			})
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'saleStatis' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				this.formData.rangeDate = JSON.parse(JSON.stringify([this.formData.beginDate, this.formData.endDate]))
				this.queryList()
			},
			/* 设置表格 */
			setTable(){
				let that = this
				uni.createSelectorQuery().in(this).select("#subSectionHeader").boundingClientRect( data =>{
					that.config.table.height = that.pageHeight - data.height - 25
					that.config.table.halfHeight = (that.pageHeight - data.height - 25) * 0.5
				}).exec()
			},
			/* 获取表格数据 */
			async queryList(){
				const { result } = await fetchSaleStatisList( this.formData )
				this.config.table.data = result
			},
			/* 分段器值改变触发 */
			sectionChange( index ){
				this.formData.subSection = index
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
				this.queryList()
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
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>