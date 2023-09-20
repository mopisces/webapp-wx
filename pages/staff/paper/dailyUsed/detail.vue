<!-- 原纸日用量详情 -->
<template>
	<view>
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
	import { fetchDailyUsedDetailList } from "@/api/staff/paper.js"
	
	export default {
		data() {
			return {
				/* 配置 */
				config: {
					/* 表格配置 */
					table: {
						/* 表格高度 */
						height: null,
						/* 表格字段 */
						column: [
							{ name: 'paperCode', label: '纸类', fixed: true, width: 80 },
							{ name: 'paperWidth', label: '门幅', width: 80 },
							{ name: 'paperWt', label: '克重', width: 80 },
							{ name: 'sRWt', label: '使用总重(kg)', width: 120 },
							{ name: 'strZJ', label: '类型', width: 80 },
							{ name: 'stockNo', label: '收货编号', width: 120 },
						],
						/* 表格数据 */
						data: []
					}
				},
				/* 筛选条件 */
				formData: {
					//类型 0->日明细 1->汇总
					dataType: null,
					//门幅
					paperCode: null,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//
					outDate: null
				}
			}
		},
		onLoad(options) {
			/* 获取传递的参数 */
			this.formData = Object.assign(
				this.formData, 
				JSON.parse(decodeURIComponent(options.filterInfo))
			)
			this.queryList()
		},
		methods: {
			/* 获取表格数据 */
			async queryList(){
				this.config.table.data = this.$options.data().config.table.data
				const { result } = await fetchDailyUsedDetailList( this.formData )
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