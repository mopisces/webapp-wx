<!-- 信用余额模块 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+( config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<!-- 筛选按钮 -->
		<liu-drag-button
			v-show=" showMenu "
			:bottomPx=" pageHeight * 0.8 "
			@clickBtn="config.filter.show = true"
		>
			<text>筛选</text>
		</liu-drag-button>
		<!-- 订单列表 -->
		<z-paging 
			ref="creditBalList" 
			v-model="config.table.mock" 
			:auto-show-system-loading="true"
			@query="mockList"
		>
			<view slot="top">
				<!-- 员工信息 -->
				<u-alert 
					:title="'欠款合计:' + config.taskInfo.totalAmt" 
					type = "warning" 
				>
				</u-alert>
			</view>
			<!-- 客户信息列表 -->
			<uni-card
				v-for="(rowData, index) in config.table.mock" 
				:key="index"
				:title="rowData.cusName" 
				:extra="rowData.taskName"
				:is-shadow="true"
			>
				<view class="card-body-item card-body-item-100">
					<text>是否停单: 
						<text class="mg-left-20">{{ rowData.stopped }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>是否月结: 
						<text class="mg-left-20">{{ rowData.settleDay }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>下单未送: 
						<text class="mg-left-20">{{ rowData.ordNeedAmt }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-txt">额度信息:</view>
					<view class="card-body-txt green-color mg-left-20">{{ rowData.minAmtCond }}</view>
					<view class="card-body-txt red-color mg-left-20">{{ rowData.curAmt }}</view>
					<view class="card-body-txt yellow-color mg-left-20">{{ rowData.leftMinAmtCond }}</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>查询时间: 
						<text class="mg-left-20">{{ rowData.queryTime }}</text>
					</text>
				</view>
			</uni-card>
		</z-paging>
		<!-- 筛选内容 -->
		<webapp-popup-filter
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>
			<!-- 客户信息 -->
			<webapp-cus-picker 
				:cusId.sync="formData.cusId"
			/>
			<!-- 是否停单 -->
			<view class="popup-filter-checkbox margin20">
				<view class="popup-filter-title">是否停单</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.stopped" 
						:localdata="config.filter.checkBox.options.stopped">
					</uni-data-checkbox>
				</view>
			</view>
			<!-- 是否月结 -->
			<view class="popup-filter-checkbox margin20">
				<view class="popup-filter-title">是否月结</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.settleDay" 
						:localdata="config.filter.checkBox.options.settleDay">
					</uni-data-checkbox>
				</view>
			</view>
		</webapp-popup-filter>
		
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
	import { fetchCreditBalList } from "@/api/staff/customer.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappCusPicker
		},
		data() {
			return {
				/* 配置信息 */
				config: {
					/* 筛选弹窗配置 */
					filter: {
						show: false,
						/* 单选配置 */
						checkBox: {
							options: {
								/* 单选是否停单 */
								stopped: [
									{
										text: '全部',
										value: 2,
									},
									{
										text: '是',
										value: 0,
									},
									{
										text: '否',
										value: 1,
									},
								],
								/* 单选是否月结 */
								settleDay: [
									{
										text: '全部',
										value: 2,
									},
									{
										text: '是',
										value: 0,
									},
									{
										text: '否',
										value: 1,
									},
								]
							}
						}
					},
					/* 客户信息弹窗配置 */
					cusInfo: {
						show: false
					},
					/* 员工信息弹窗配置 */
					taskInfo: {
						show: false,
						/* 员工姓名 */
						taskName: null,
						/* 合计欠款 */
						totalAmt: 0,
						/* 查询时间 */
						queryTime: null,
					},
					/* 菜单配置 */
					menu: {
						show: true,
					},
					/* 列表详细信息 */
					rowData: {
						show: false
					},
					/* 表格配置 */
					table: {
						/* 表格模拟数据 */
						mock: [],
						/* 表格全部数据 */
						data: []
					}
				},
				/* 筛选条件 */
				formData: {
					//客户编号
					cusId: null,
					//是否停单
					stopped: 2,
					//是否月结
					settleDay: 2,
					//当前页面
					pageNo: 1,
					//数据条数
					pageSize: 25
				},
			}
		},
		methods: {
			/* 获取数据包含员工信息 */
			async queryInfo(){
				this.config.table = this.$options.data().config.table
				const { result } = await fetchCreditBalList( this.formData )
				this.config.table.data = result.list
				this.config.taskInfo = result.taskInfo
			},
			/* 表格模拟上拉加载 */
			async mockList( pageNo, pageSize ){
				if( pageNo == 1 ){
					await this.queryInfo()
				}
				uni.showLoading({title: '加载中',mask: true})
				const subList = this.config.table.data.splice((pageNo-1)*pageSize , pageSize)
				this.$refs.creditBalList.complete(subList)
				setTimeout(()=>{
					uni.hideLoading()
				},1500)
			},
			/* 筛选搜索 */
			search(){
				this.$refs.creditBalList.reload()
			},
			/* 点击重置 */
			reset(){
				this.formData = this.$options.data().formData
				this.$refs.creditBalList.reload()
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: 'page/pageHeight',
			}),
			/* 监听是否有弹窗打开 */
			showMenu(){
				return !this.config.filter.show && !this.config.rowData.show
			}
		},
		watch: {
			/* 监听是否有弹窗打开 */
			showMenu( newV, oldV ){
				this.config.menu.show = newV
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>