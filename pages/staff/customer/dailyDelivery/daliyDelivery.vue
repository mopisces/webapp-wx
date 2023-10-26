<!-- 客户每日送货 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+(showMenu ?'hidden':'visible')"></page-meta>
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
			ref="deliveryDailyMenu"
			v-show=" showMenu " 
			:btnObj="config.menu.options"
			:bottomPct="0.8"
			@click="menuClick">
		</liu-rotating-menu>
		<!-- 列表信息 -->
		<z-paging
			ref="dailyDeliveryList" 
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
						<text>送货金额: 
							<text class="mg-left-20">{{ staffInfo.amt }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>销售面积: 
							<text class="mg-left-20">{{ staffInfo.salesArea }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>送货立方: 
							<text class="mg-left-20">{{ staffInfo.volume }}</text>
						</text>
					</view>
				</view>
			</uni-card>
		</u-popup>
		<!-- 筛选框 -->
		<webapp-popup-filter
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>
			<view>
				<!-- 客户信息 -->
				<webapp-cus-picker 
					:cusId.sync="formData.cusId"
				/>
				<!-- 日期区间 -->
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
	
	import { fetchDeliveryDailyInfo } from "@/api/staff/customer.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappCusPicker,
			WebappRangeDate
		},
		data(){
			return {
				config: {
					//菜单配置
					menu: {
						show: true,
						options: {
							id: 'dailyDelivery',
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
						show: false,
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
				//员工信息
				staffInfo: {
					//员工姓名
					name: null,
					//日期区间
					rangeDate: null,
					//送货立方
					volume: null,
					//销售面积
					salesArea: null,
					//送货金额
					amt: null
				},
				//筛选条件
				formData: {
					//客户
					cusId: null,
					//类型 1->获取列表信息 2->获取员工信息
					type: 1, 
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
				},
				listData: []
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
				this.$refs.dailyDeliveryList.reload()
			},
			/* 菜单按钮 */
			menuClick(e){
				if( e.id == '1' ){
					this.config.filter.show = true
				}
				if( e.id == '2' ){
					this.formData.type = 2
					this.queryInfo()
				}
			},
			/* 列表点击 */
			itemClick( row ){
				this.$refs.deliveryDailyMenu.closeMenu()
				const data = Object.assign({}, this.formData, {cusId: row.CusId})
				uni.navigateTo({
					url: '/pages/staff/customer/dailyDelivery/dailyDeliveryDetail?filterInfo=' 
						+ encodeURIComponent(JSON.stringify(data)) 
				})
			},
			/* 获取信息 */
			async queryInfo(){
				/* 获取列表信息时打开骨架屏 */
				if( this.formData.type == 1 ){
					this.config.mock = this.$options.data().config.mock
					this.config.skeleton.loading = true
				}
				const { result } = await fetchDeliveryDailyInfo( this.formData );
				if( this.formData.type == 1 ){
					this.config.mock.indexList = result
					setTimeout(()=>{
						this.config.skeleton.loading = false
					},200)
				}
				if( this.formData.type == 2 ){
					this.staffInfo = result
					this.config.popup.show = true
				}
			},
			/* 模拟上拉加载下拉刷新 */
			async queryMock( pageNo, pageSize ){
				this.formData.type == 1
				if( pageNo == 1 ){
					await this.queryInfo()
				}
				var subList = []
				
				if( this.config.mock.indexList.length > 0 ){
					subList = this.config.mock.indexList.splice( 0, pageSize )
				}
				
				setTimeout(()=>{
					this.$refs.dailyDeliveryList.complete(subList)
				}, 1500)
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
				this.formData.type = 1
				this.$refs.dailyDeliveryList.reload()
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				skeletonRowNum: 'page/skeletonRowNum',
				skeletonRowHeight: 'page/skeletonRowHeight',
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
					this.$refs.deliveryDailyMenu.closeMenu()
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