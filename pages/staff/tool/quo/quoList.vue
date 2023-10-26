<!-- 报价查询 -->
<template>
	<view>
		<!-- 骨架屏 -->
		<u-skeleton
			:rows="skeletonRowNum"
			:rowsHeight="skeletonRowHeight"
			:loading="config.skeleton.loading"
			:title="false"
		></u-skeleton>
		<!-- 列表信息 -->
		<z-paging
			ref="quoList" 
			v-model="config.mock.mockList" 
			:auto-show-system-loading="true"
			:default-page-size="20"
			@query="queryMock"
		>
			<view slot="top" style="background-color: #5677FC;">
				<u-search 
					v-model="formData.keyWord"
					shape="round"
					:showAction="false"
					placeholder="请输入客户信息"
					margin="30rpx"
					@search="search"
					@clear="clear"
				>
				</u-search>
			</view>
			<u-cell-group>
				<u-cell 
					:title="item.cusName"
					:value="item.cusId"
					:isLink="true"
					v-for="(item, index) in config.mock.mockList" :key="index"
					@click="itemClick(item)"
				></u-cell>
			</u-cell-group>
		</z-paging>
	</view>
</template>

<script>
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { fetchQuoList } from "@/api/staff/tool.js"
	
	export default {
		data() {
			return {
				config: {
					/* 骨架屏配置 */
					skeleton: {
						loading: true,
						rowNum: 14
					},
					/* 模拟上拉加载数据 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: [],
					},
				},
				/* 筛选条件 */
				formData: {
					/* 搜索关键词 */
					keyWord: null,
				}
			}
		},
		methods: {
			/* 获取列表数据 */
			async queryList(){
				this.config.skeleton.loading = true
				this.config.mock = this.$options.data().config.mock
				const { result } = await fetchQuoList( this.formData )
				this.config.mock.indexList = result
				setTimeout(()=>{
					this.config.skeleton.loading = false
				},200)
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
					this.$refs.quoList.complete(subList)
				}, 1500)
			},
			/* 搜索框搜索 */
			search( val ){
				this.$refs.quoList.reload()
			},
			/* 搜索框清楚 */
			clear(){
				this.$refs.quoList.reload()
			},
			/* 列表点击 */
			itemClick(row){
				uni.navigateTo({
					url: '/pages/staff/tool/quo/quoDetail?filterInfo=' 
						+ encodeURIComponent(JSON.stringify(row)) 
				})
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				skeletonRowNum: "page/skeletonRowNum",
				skeletonRowHeight: "page/skeletonRowHeight",
				pageHeight: "page/pageHeight",
				pageWidth: "page/pageWidth",
			})
		},
	}
</script>

<style>
</style>