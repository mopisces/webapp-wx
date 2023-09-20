<!-- 客户每日订单 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+( showMenu ?'hidden':'visible')"></page-meta>
	<view>
		<!-- 骨架屏 -->
		<u-skeleton
			:rows="skeletonRowNum"
			:rowsHeight="skeletonRowHeight"
			:loading="config.skeleton.loading"
			:title="false"
		></u-skeleton>
		<!-- 菜单按钮 -->
		<liu-rotating-menu
			v-show=" showMenu "
			ref="dailyOrderMenu"
			:btnObj="config.menu.options"
			:bottomPct="0.8"
			@click="menuClick">
		</liu-rotating-menu>
		<!-- 列表信息 -->
		<z-paging
			ref="dailyOrderList" 
			v-model="config.mock.mockList" 
			:auto-show-system-loading="true"
			:auto="false"
			:default-page-size="20"
			@query="queryMock"
		>
			<u-cell-group>
				<u-cell 
					:title="item.title"
					:value="item.value"
					:isLink="true"
					v-for="(item, index) in config.mock.mockList" :key="index"
					@click="itemClick(item)"
				></u-cell>
			</u-cell-group>
		</z-paging>
		<!-- 员工信息弹窗 -->
		<u-popup
			:show="config.popup.show" 
			:round="10"
			:safeAreaInsetBottom="false" 
			:zoom="false"
			:customStyle="{width:'650rpx'}" 
			:overlayStyle="{background:'rgba(3, 100, 219, 0.5)', touchAction:'none'}"
			mode="center" 
			@close="close" 
		>
			<uni-card
				:title="staffInfo.name" 
				:is-shadow="true"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>日期区间: 
							<text class="mg-left-20">{{ staffInfo.rangeDate }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>下单金额: 
							<text class="mg-left-20">{{ staffInfo.ordAmt }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>下单米数: 
							<text class="mg-left-20">{{ staffInfo.tLength }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>下单平方: 
							<text class="mg-left-20">{{ staffInfo.salesArea }}</text>
						</text>
					</view>
				</view>
			</uni-card>
		</u-popup>
		<!-- 筛选 -->
		<webapp-popup-filter
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>
			<view>
				<webapp-cus-picker 
					:cusId.sync="formData.cusId"
				/>
				<webapp-range-date
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
					:rangeDate.sync="formData.rangeDate"
				/>
			</view>
		</webapp-popup-filter>
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from "@/components/webapp-popup-filter/webapp-popup-filter.vue"
	/* 自定义客户选择组件 */
	import WebappCusPicker from "@/components/webapp-cus-picker/webapp-cus-picker.vue"
	/* 自定义日期区间组件 */
	import WebappRangeDate from "@/components/webapp-range-date/webapp-range-date.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	import { 
		fetchDailyOrderList,
		getDailyOrderStaffInfo,
	} from "@/api/staff/customer.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappCusPicker,
			WebappRangeDate
		},
		data() {
			return {
				config: {
					//菜单配置
					menu: {
						show: true,
						options: {
							id: 'dailyOrderMenu',
							name: '菜单',
							childs: [
								{
									id: '1',
									name: '筛选'
								},
								{
									id: '2',
									name: '员工'
								}
							]
						}
					},
					//员工信息弹窗配置
					popup: {
						show: false
					},
					//筛选配置
					filter: {
						show: false
					},
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
				listData: [],
				//员工信息
				staffInfo: {
					//员工姓名
					name: null,
					//日期区间
					rangeDate: null,
					//下单金额
					ordAmt: null,
					//下单米数
					tLength: null,
					//下单平方
					salesArea: null
				},
				formData: {
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
					//客户
					cusId: null,
					//是否过滤员下单
					addErpId: false
				}
			}
		},
		mounted() {
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'dailyOrder' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				this.formData.rangeDate = JSON.parse(JSON.stringify([this.formData.beginDate, this.formData.endDate]))
				this.$refs.dailyOrderList.reload()
			},
			/* 菜单点击 */
			menuClick( e ){
				if( e.id == '1' ){
					this.config.filter.show = true;
				}
				if( e.id == '2' ){
					this.getStaffInfo()
				}
			},
			/* 获取列表 */
			async queryList(){
				this.config.skeleton.loading = true
				this.config.mock = this.$options.data().config.mock
				const { result } = await fetchDailyOrderList( this.formData )
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
					this.$refs.dailyOrderList.complete(subList)
				}, 1500)
			},
			/* 列表点击 */
			itemClick( row ){
				this.$refs.dailyOrderMenu.closeMenu()
				const data = Object.assign({}, this.formData, {cusId: row.CusId})
				uni.navigateTo({
					url: '/pages/staff/customer/dailyOrder/dailyOrderDetail?filterInfo=' 
						+ encodeURIComponent(JSON.stringify(data)) 
				})
			},
			/* 获取员工信息 */
			async getStaffInfo(){
				const { result } = await getDailyOrderStaffInfo( this.formData )
				this.staffInfo = result
				this.config.popup.show = true
			},
			/* 员工信息弹窗关闭 */
			close(){
				this.config.popup.show = false
			},
			/* 筛选重置 */
			reset(){
				this.formData = this.$options.data().formData
				this.getParams()
			},
			/* 筛选点击 */
			search(){
				this.$refs.dailyOrderList.reload()
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				skeletonRowNum: "page/skeletonRowNum",
				skeletonRowHeight: "page/skeletonRowHeight",
				pageHeight: "page/pageHeight",
				pageWidth: "page/pageWidth",
			}),
			/* 监听是否有弹窗打开 */
			showMenu(){
				return !this.config.popup.show && !this.config.filter.show
			}
		},
		watch: {
			/* 监听是否有弹窗打开 */
			showMenu( newV, oldV ){
				if( !newV ){
					//关闭菜单
					this.$refs.dailyOrderMenu.closeMenu()
				}
				this.config.menu.show = newV
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>