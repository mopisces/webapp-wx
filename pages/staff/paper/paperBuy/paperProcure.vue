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
			ref="procureList" 
			v-model="config.mock.mockList" 
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryMock"
		>
			<view slot="top">
				<!-- 头部选择 -->
				<webapp-prv-next
					ref="prvNext"
					:popupShow.sync="config.prevNext.popupShow"
					:value.sync="formData.poDate"
					:key="Math.random()"
					@radioConfirm="radioConfirm"
				/>
			</view>
			<uni-card
				:title="item.poNo" 
				:extra="item.poDate"
				:is-shadow="true"
				v-for="(item, index) in config.mock.mockList" :key="index"
				@click="detailClick(item)"
			>
				<view class="card-body-container">
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
							<text class="mg-left-20">{{ item.inQty }}</text>
							<text class="mg-left-20">{{ item.poQty }}</text>
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
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { fetchPaperProcureDateList, fetchPaperProcureList } from "@/api/staff/paper.js"
	
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
					//采购日期
					poDate: null,
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
					//分页信息
					pageNo: 1,
					//当前页数量
					pageSize: 10,
				}
			}
		},
		onReady(){
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'paperBuyProcure' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				this.formData.rangeDate = JSON.parse(
					JSON.stringify([this.formData.beginDate, this.formData.endDate])
				)
				await this.queryDateList()
			},
			/* 获取日期列表 */
			async queryDateList(){
				this.$refs.prvNext.complete([])
				const { result } = await fetchPaperProcureDateList( this.formData )
				this.$refs.prvNext.complete(result)
			},
			/* 获取列表数据 */
			async queryList(){
				this.config.mock = this.$options.data().config.mock
				const { result } = await fetchPaperProcureList( this.formData )
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
					this.$refs.procureList.complete(subList)
				}, 1500)
			},
			/* 筛选按钮点击 */
			filterClick(){
				this.config.filter.show = true
			},
			/* 头部选择选中后触发 */
			radioConfirm( val ){
				this.formData.poDate = val
				if( val ){
					this.$refs.procureList.reload()
				}else{
					this.$refs.procureList.complete([])
				}
			},
			/* 列表详细信息 */
			detailClick( row ){
				const data = {
					//数据类型 0->原纸收货 1->原纸采购
					dataType: 1,
					//供应商 
					shortName: row.shortName,
					//显示日期
					date: row.poDate,
					//对应的收货单号或者采购单号
					keyWord: row.poNo
				}
				uni.navigateTo({
					url: '/pages/staff/paper/paperBuy/detail?filterInfo='
						+ encodeURIComponent(JSON.stringify(data))
				})
			},
			/* 筛选重置 */
			async reset(){
				await this.getParams()
			},
			/* 筛选点击 */
			async search(){
				await this.queryDateList()
			}
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