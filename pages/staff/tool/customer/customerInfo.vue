<!-- 客户查询 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view>
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
			<webapp-cus-picker ref="cusId" :cusId.sync="formData.cusId"></webapp-cus-picker>
		</webapp-popup-filter>
		<!-- 列表数据 -->
		<z-paging
			ref="customerInfoList" 
			v-model="config.mock.mockList"
			:auto-show-system-loading="true"
			@query="queryMock"
		>
			<uni-card
				:title="item.title" 
				:extra="item.extra"
				:is-shadow="true"
				v-for="(item, index) in config.mock.mockList" :key="index"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>子公司信息: 
							<text class="mg-left-20">{{ item.cusSubInfo }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>子公司全称: 
							<text class="mg-left-20">{{ item.zName }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>联系人信息: 
							<text class="mg-left-20">{{ item.subContactPerson }}</text>
							<text class="mg-left-20">{{ item.subTelNo }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>送货地址: 
							<text class="mg-left-20">{{ item.subDNAddress }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>业务员信息: 
							<text class="mg-left-20">{{ item.taskInfo }}</text>
							<text class="mg-left-20">{{ item.telNo }}</text>
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
	/* 自定义客户选择组件 */
	import WebappCusPicker from "@/components/webapp-cus-picker/webapp-cus-picker.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { fetchCustomerInfoList } from "@/api/staff/tool.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappCusPicker
		},
		data() {
			return {
				/* 配置 */
				config: {
					/* 筛选配置 */
					filter: {
						show: false
					},
					/* 模拟 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: []
					}
				},
				/* 筛选条件 */
				formData: {
					//客户
					cusId: null
				}
			}
		},
		methods: {
			/* 获取列表数据 */
			async queryList(){
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await fetchCustomerInfoList(this.formData)
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
					this.$refs.customerInfoList.complete(subList)
				}, 1500)
			},
			/* 点击筛选按钮 */
			filterClick(){
				this.config.filter.show = true
			},
			/* 筛选弹出点击重置 */
			async reset(){
				await this.$refs.cusId.onClear()
				this.$refs.customerInfoList.reload()
			},
			/* 筛选弹窗点击筛选 */
			search(){
				this.$refs.customerInfoList.reload()
			}
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