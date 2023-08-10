<template>
	<view>
		<view :style=" 'height:' + pageHeight + 'px;width:100%;' ">
			<zb-table
				:show-header="true" 
				:columns="config.table.column"
				:stripe="true"
				:fit="false"
				:border="true"
				:data="config.table.data"
			></zb-table>
		</view>
		<liu-drag-button
			:bottomPx=" pageHeight * 0.8 "
			@clickBtn="filterClick"
		>
			<text>筛选</text>
		</liu-drag-button>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				config: {
					table: {
						data: [],
						column: []
					}
				},
			}
		},
		methods: {
			filterClick(){}
			
		},
		computed: {
			...mapGetters({
				pageHeight: 'page/pageHeight',
			})
		}
	}
</script>
