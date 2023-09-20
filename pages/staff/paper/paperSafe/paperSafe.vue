<!-- 安全库存 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<!-- 头部选项卡 -->
		<view id="paperSafeSubsection">
			<u-subsection 
				:list="config.subsection.list" 
				:current="formData.dataType"
				@change="sectionChange"
			>
			</u-subsection>
		</view>
		<!-- 表格 -->
		<view :style=" 'height:' + config.table.height + 'px;width:100%;' ">
			<zb-table
				:show-header="true" 
				:columns="config.table.column"
				:stripe="true"
				:fit="false"
				:border="true"
				:data="config.table.data"
			></zb-table>
		</view>
		<!-- 筛选按钮 -->
		<liu-drag-button 
			v-show=" !config.filter.show "
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
			<!-- 日期类型 -->
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">纸种类型</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.paperType" 
						:localdata="config.filter.checkBox.paperType">
					</uni-data-checkbox>
				</view>
			</view>
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">原纸代码</view>
				<view class="popup-filter-content popup-filter-input">
					<u--input
						v-model="formData.paperCode" 
						placeholder="原纸代码" 
						:disableDefaultPadding="true" 
						inputAlign="center" 
						>
					</u--input>
				</view>
			</view>
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">门幅</view>
				<view class="popup-filter-content popup-filter-input">
					<u--input
						v-model="formData.paperWidth" 
						placeholder="门幅" 
						:disableDefaultPadding="true" 
						inputAlign="center" 
						>
					</u--input>
				</view>
			</view>
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">纸种名称</view>
				<view class="popup-filter-content popup-filter-input">
					<u--input
						v-model="formData.paperName" 
						placeholder="纸种名称" 
						:disableDefaultPadding="true" 
						inputAlign="center" 
						>
					</u--input>
				</view>
			</view>
		</webapp-popup-filter>
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from "@/components/webapp-popup-filter/webapp-popup-filter.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { fetchSafePaperList } from "@/api/staff/paper.js"
	
	export default {
		components:{
			WebappPopupFilter,
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
							/* 纸种类型 */
							paperType: [
								{
									text: '全部',
									value: 100,
								},
								{
									text: '无',
									value: 0,
								},
								{
									text: '牛皮挂面',
									value: 1,
								},
								{
									text: '涂布白板',
									value: 2,
								},
								{
									text: '瓦纸',
									value: 3,
								},
							]
						}
					},
					/* 头部分段器配置 */
					subsection: {
						/* 头部标签 */
						list: [
							'全部',
							'小于安全',
							'大于安全',
							'有库存'
						]
					},
					/* 表格配置 */
					table: {
						/* 表格高度 */
						height: null,
						/* 表格字段 */
						column: [
							{ name: 'paperCode', label: '原纸代码', fixed: true, width: 80 },
							{ name: 'paperWidth', label: '门幅', fixed: true, width: 80 },
							{ name: 'paperName', label: '纸种名称', width: 120 },
							{ name: 'pCount', label: '库存件数', width: 80 },
							{ name: 'safeCount', label: '安全库存', width: 80 },
							{ name: 'maxCount', label: '上限库存', width: 80 },
							{ name: 'paperType', label: '纸种类型', width: 80 }
						],
						/* 表格数据 */
						data: []
					}
				},
				/* 筛选条件 */
				formData: {
					//类型 0->全部 1->小于安全库存 2->大于安全库存 3->有库存
					dataType: 0,
					//纸种类型 0->无 1->牛皮挂面 2->涂布白板 3->瓦纸 100->全部
					paperType: 100,
					//原纸代码
					paperCode: '',
					//门幅
					paperWidth: '',
					//纸种名称
					paperName: '',
					//生产备注
					pRemark: ''
				}
			}
		},
		mounted(){
			
		},
		async onReady() {
			await this.setTable()
			this.queryList()
		},
		methods: {
			/* 设置表格 */
			setTable(){
				let that = this
				uni.createSelectorQuery().in(this).select("#paperSafeSubsection").boundingClientRect( data =>{
					that.config.table.height = that.pageHeight - data.height - 25
				}).exec()
			},
			/* 头部切换选中标签 */
			sectionChange(index){
				this.formData.dataType = index
				this.queryList()
			},
			/* 点击筛选按钮 */
			filterClick(){
				this.config.filter.show = true
			},
			/* 获取表格数据 */
			async queryList(){
				this.config.table.data = this.$options.data().config.table.data
				const { result } = await fetchSafePaperList( this.formData )
				this.config.table.data = result
			},
			/* 筛选弹出点击重置 */
			reset(){
				this.formData = this.$options.data().formData
				this.queryList()
			},
			/* 筛选弹窗点击筛选 */
			search(){
				this.queryList()
			},
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight" 
			})
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>