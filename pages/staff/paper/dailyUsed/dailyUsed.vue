<!-- 原纸日用量 -->
<template>
	<view>
		<!-- 菜单按钮 -->
		<liu-rotating-menu 
			ref="dailyUsedMenu"
			v-show=" showMenu " 
			:btnObj="config.menu.options"
			:bottomPct="0.8"
			@click="menuClick">
		</liu-rotating-menu>
		<!-- 显示总重量 -->
		<u-toast ref="total"></u-toast>
		<!-- 筛选弹窗 -->
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
		<!-- 列表 -->
		<z-paging 
			ref="dailyUsedList" 
			v-model="config.mock.mockList" 
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryMock"
		>
			<view slot="top">
				<!-- 头部分段器 -->
				<u-subsection
					:list="config.subsection.list" 
					mode="subsection" 
					:current="formData.dataType" 
					@change="sectionChange"
				></u-subsection>
				<!-- 头部选择 -->
				<webapp-prv-next 
					ref="prvNext"
					v-if="formData.dataType == 0"
					:popupShow.sync="config.prevNext.popupShow"
					:value.sync="formData.outDate"
					:key="Math.random()"
					@radioConfirm="radioConfirm"
				>
				</webapp-prv-next>
			</view>
			<uni-card
				:title="item.title" 
				:is-shadow="true"
				v-for="(item, index) in config.mock.mockList" :key="index"
				@click="detailClick(item)"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>纸类:
							<text class="mg-left-20">{{ item.paperCode }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>纸类名称:
							<text class="mg-left-20">{{ item.paperName }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>整卷件数:
							<text class="mg-left-20">{{ item.zJCount }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>残卷件数:
							<text class="mg-left-20">{{ item.cJCount }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>使用总重:
							<text class="mg-left-20">{{ item.sRWt }}</text>
							<text class="mg-left-20">kg</text>
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
	/* 自定义日期范围组件 */
	import WebappRangeDate from "@/components/webapp-range-date/webapp-range-date.vue"
	/* 自定义头部选择组件 */
	import WebappPrvNext from "@/components/webapp-prv-next/webapp-prv-next.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { fetchDailyUsedDateList, fetchDailyUsedList } from "@/api/staff/paper.js"
	
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
					/* 菜单按钮配置 */
					menu: {
						options: {
							id: 'dailyUsedMenu',
							name: '菜单',
							childs: [
								{
									id: '1',
									name: '筛选'
								},
								{
									id: '2',
									name: '总重量'
								}
							]
						}
					},
					/* 筛选配置 */
					filter: {
						show: false
					},
					/* 头部选择 */
					prevNext: {
						popupShow: false,
					},
					/* 头部选择 */
					subsection: {
						list:['日明细', '汇总'],
					},
					/* 模拟上拉加载数据 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: [],
						/* 总重量 */
						total: 0,
					},
				},
				/* 筛选条件 */
				formData: {
					//总重量
					total: "",
					//类型 0->日明细 1->汇总
					dataType: 0,
					//
					outDate: null,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最大日期
					maxDate: null,
					//最小日期
					minDate: null,
					//日期区间
					rangeDate: []
				}
			}
		},
		onReady(){
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'paperDailyUsed' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				this.formData.rangeDate = JSON.parse(
					JSON.stringify([this.formData.beginDate, this.formData.endDate])
				)
				this.queryDateList()
			},
			/* 分段器修改 */
			sectionChange(idx){
				this.formData.dataType = idx
				if( idx == 0 ){
					this.getParams()
				}else{
					this.$refs.dailyUsedList.reload()
				}
				
			}, 
			/* 头部选择选中后触发 */
			radioConfirm( val ){
				this.formData.outDate = val
				if( val ){
					this.$refs.dailyUsedList.reload()
				}else{
					this.$refs.dailyUsedList.complete([])
				}
			},
			/* 获取日期列表 */
			async queryDateList(){
				this.$refs.prvNext.complete([])
				const { result } = await fetchDailyUsedDateList( this.formData )
				this.$refs.prvNext.complete(result)
			},
			/* 获取列表数据 */
			async queryList(){
				this.config.mock = this.$options.data().config.mock
				const { result } = await fetchDailyUsedList( this.formData )
				this.config.mock.indexList = result.list
				this.config.mock.total = result.total
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
					this.$refs.dailyUsedList.complete(subList)
				}, 1500)
			},
			/* 点击菜单按钮 */
			menuClick(e){
				if( e.id == '1' ){
					this.config.filter.show = true
				}
				if( e.id == '2' ){
					this.$refs.total.show({
						message: this.config.mock.total + 'kg',
						type: 'default',
						duration: 3000,
					})
					this.$refs.dailyUsedMenu.closeMenu()
				}
			},
			/* 列表点击 */
			detailClick( row ){
				const data = {
					//门幅
					paperCode: row.paperCode
				}
				uni.navigateTo({
					url: '/pages/staff/paper/dailyUsed/detail?filterInfo='
						+ encodeURIComponent(JSON.stringify(Object.assign({}, this.formData, data)))
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
		},
		watch: {
			showMenu( newV, oldV ){
				if( !newV ){
					//关闭菜单
					this.$refs.dailyUsedMenu.closeMenu()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>