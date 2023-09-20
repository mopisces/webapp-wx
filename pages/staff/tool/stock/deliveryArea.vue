<!-- 库区面积 -->
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
	import { fetchDeliveryAreaList } from "@/api/staff/tool.js"
	
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
							{ name: 'sAreaCode', label: '库区', fixed: true, width: 80 },
							{ name: 'maxSArea', label: '库区面积', width: 120 },
							{ name: 'curSArea', label: '已用面积', width: 120 },
							{ name: 'leftArea', label: '剩余面积', width: 120 },
						],
						/* 表格数据 */
						data: []
					}
				}
			}
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
				this.config.table.height = this.pageHeight - 25
			},
			/* 获取表格数据 */
			async queryList(){
				this.config.table.data = this.$options.data().config.table.data
				const { result } = await fetchDeliveryAreaList();
				this.config.table.data = result
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight" 
			})
		}
	}
</script>

<style>
</style>