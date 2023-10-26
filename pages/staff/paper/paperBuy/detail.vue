<!-- 原纸收货/采购详细信息 -->
<template>
	<view>
		<view id="paperBuyDetailHeader">
			<u-cell-group>
				<u-cell
					:title="formData.dataType == 0 ? '收货日期' : '采购日期'"
					:value="formData.date"
				>
				</u-cell>
				<u-cell
					:title="formData.dataType == 0 ? '收货单号' : '采购单号'"
					:value="formData.keyWord"
				>
				</u-cell>
				<u-cell
					title="供应商"
					:value="formData.shortName"
				>
				</u-cell>
			</u-cell-group>
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
	</view>
</template>

<script>
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { fetchPaperBuyList } from "@/api/staff/paper.js"
	
	export default {
		data() {
			return {
				/* 配置 */
				config: {
					/* 表格配置 */
					table: {
						/* 表格高度 */
						height: null,
						/* 表格字段配置 */
						columns:{
							/* 原纸收货表格字段 */
							takeDelivery: [
								{ name: 'paperCode', label: '纸类', fixed: true, width: 80 },
								{ name: 'paperWidth', label: '门幅', width: 80 },
								{ name: 'paperWt', label: '克重', width: 80 },
								{ name: 'inWt', label: '收货重量(kg)', width: 120 },
								{ name: 'dPrice', label: '单价', width: 120 }
							],
							/* 原纸采购表格字段 */
							procure: [
								{ name: 'paperCode', label: '纸类', fixed: true, width: 80 },
								{ name: 'paperWidth', label: '门幅', width: 80 },
								{ name: 'actWeight', label: '克重', width: 80 },
								{ name: 'sumWeight', label: '重量(kg)', width: 100 },
								{ name: 'poPrice', label: '单价', width: 80 },
								{ name: 'ratio', label: '收货/采购', width: 100 }
							]
						},
						/* 表格当前字段 */
						column: [],
						/* 表格数据 */
						data: []
					}
				},
				/* 筛选条件 */
				formData: {
					//数据类型 0->原纸收货 1->原纸采购 
					dataType: 0,
					//供应商 
					shortName: null,
					//显示日期
					date: null,
					//对应的收货单号或者采购单号
					keyWord: null
				}
			}
		},
		onLoad(options) {
			/* 获取传递的参数 */
			this.formData = Object.assign(
				this.formData, 
				JSON.parse(decodeURIComponent(options.filterInfo))
			)
			this.config.table.column = this.formData.dataType == 0 ?
			 this.config.table.columns.takeDelivery : this.config.table.columns.procure
		},
		mounted(){
			this.setTable()
			this.$nextTick(()=>{
				this.queryList()
			})
		},
		methods: {
			/* 设置表格 */
			setTable(){
				let that = this
				uni.createSelectorQuery().in(this).select("#paperBuyDetailHeader").boundingClientRect( data =>{
					that.config.table.height = that.pageHeight - data.height  - 25
				}).exec()
			},
			/* 获取表格数据 */
			async queryList(){
				const { result } = await fetchPaperBuyList( this.formData )
				this.config.table.data = result
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight",
			})
		}
	}
</script>

<style>
</style>