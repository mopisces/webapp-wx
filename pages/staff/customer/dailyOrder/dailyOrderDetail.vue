<!-- 客户每日订单详情 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+( showMenu ?'hidden':'visible')"></page-meta>
	<view>
		<!-- 头部选择 -->
		<webapp-prv-next
			id="dailyDetail"
			ref="prvNext"
			:popupShow.sync="config.prevNext.popupShow"
			:key="Math.random()"
			:value.sync="formData.ordDate"
			@radioConfirm="radioConfirm"
		>
		</webapp-prv-next>
		<!-- 表格 -->
		<view :style=" 'height:' + config.table.height + 'px;width:100%;' ">
			<zb-table
				:show-header="true" 
				:columns="config.table.column"
				:stripe="true"
				:fit="false"
				:border="true"
				:data="config.table.data"
				@rowClick="rowClick"
			></zb-table>
		</view>
		<!-- 菜单按钮 -->
		<liu-rotating-menu
			ref="dailyOrderDetail"
			v-show=" showMenu "
			:btnObj="config.menu.options"
			:bottomPct="0.8"
			@click="menuClick">
		</liu-rotating-menu>
		
		<!-- 筛选内容 -->
		<webapp-popup-filter
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>
			<view>
				<view class="popup-filter-item margin20">
					<view class="popup-filter-title">订单编号</view>
					<view class="popup-filter-content popup-filter-input">
						<view class="width100">
							<u--input
								v-model="formData.cusOrderId" 
								placeholder="订单编号" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								>
							</u--input>
						</view>
					</view>
				</view>
				
				<view class="popup-filter-item margin20">
					<view class="popup-filter-title">客订单号</view>
					<view class="popup-filter-content popup-filter-input">
						<view class="width100">
							<u--input
								v-model="formData.cusPoNo" 
								placeholder="客订单号" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								>
							</u--input>
						</view>
					</view>
				</view>
				
				<webapp-filter-bd-size
					:bdL.sync="formData.bdL"
					:bdW.sync="formData.bdW"
				/>
				
				<view class="popup-filter-item margin20">
					<view class="popup-filter-title">压线信息</view>
					<view class="popup-filter-content popup-filter-input">
						<view class="width100">
							<u--input
								v-model="formData.scoreInfo" 
								placeholder="压线信息" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								>
							</u--input>
						</view>
					</view>
				</view>
				
				<view class="popup-filter-item margin20">
					<view class="popup-filter-title">订单数量</view>
					<view class="popup-filter-content popup-filter-input">
						<view class="width100">
							<u--input
								v-model="formData.ordQty" 
								placeholder="订单数量" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								>
							</u--input>
						</view>
					</view>
				</view>
				
				<!-- 日期区间 -->
				<webapp-range-date 
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
					:rangeDate.sync="formData.rangeDate"
				/>
				
				<view class="popup-filter-checkbox margin20">
					<view class="popup-filter-title">日期类型</view>
					<view class="popup-filter-content popup-filter-input">
						<uni-data-checkbox
							mode="tag"
							v-model="formData.ordState" 
							:localdata="config.checkBox.options">
						</uni-data-checkbox>
					</view>
				</view>
			</view>
		</webapp-popup-filter>
		<!-- 客户信息 -->
		<u-popup
			:show="config.popup.show" 
			:round="10"
			:safeAreaInsetBottom="false" 
			:zoom="false"
			:customStyle="{width:'650rpx'}" 
			:overlayStyle="{background:'rgba(3, 100, 219, 0.5)', touchAction:'none'}"
			mode="center" 
			@close="cusInfoClose" 
		>
			<uni-card
				:title="cusInfo.cusName" 
				:extra="cusInfo.taskName"
				:is-shadow="true"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>日期区间: 
							<text class="mg-left-20">{{ cusInfo.rangeDate }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>跟单人员: 
							<text class="mg-left-20">{{ cusInfo.merchandiser }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt blue-color">下单信息:</view>
						<view class="card-body-txt blue-color mg-left-20">{{ cusInfo.ordCount }}笔</view>
						<view class="card-body-txt blue-color mg-left-20">{{ cusInfo.tOrdVol }}m³</view>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt yellow-color">未排信息:</view>
						<view class="card-body-txt yellow-color mg-left-20">{{ cusInfo.unSelCount }}笔</view>
						<view class="card-body-txt yellow-color mg-left-20">{{ cusInfo.tProVol }}m³</view>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt green-color">已排信息:</view>
						<view class="card-body-txt green-color mg-left-20">{{ cusInfo.selCount }}笔</view>
						<view class="card-body-txt green-color mg-left-20">{{ cusInfo.tStockVol }}m³</view>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt red-color">未送信息:</view>
						<view class="card-body-txt red-color mg-left-20">{{ cusInfo.tUnDeliVol }}m³</view>
						<view class="card-body-txt red-color mg-left-20">{{ cusInfo.ordAmt }}元</view>
					</view>
				</view>
			</uni-card>
		</u-popup>
		<!-- 列表详细信息 -->
		<u-popup
			:show="config.rowData.show" 
			:round="10"
			:safeAreaInsetBottom="false" 
			:zoom="false"
			:customStyle="{width:'650rpx'}" 
			:overlayStyle="{background:'rgba(3, 100, 219, 0.5)', touchAction:'none'}"
			mode="center" 
			@close="rowDataClose" 
		>
			<uni-card
				:title="rowData.orderId" 
				:extra="rowData.cusPoNo"
				:is-shadow="true"
			>
				<view class="card-body-item card-body-item-100">
					<text>规格信息: 
						<text class="mg-left-20">{{ rowData.guige }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-txt">订单信息:</view>
					<view 
						v-if="rowData.scoreInfo" 
						class="card-body-txt mg-left-20"
					>
						{{ rowData.scoreInfo }}
					</view>
					<view class="card-body-txt mg-left-20">{{ rowData.boardName }}</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>订单数量: 
						<text class="mg-left-20">{{ rowData.ordQty }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>下单日期: 
						<text class="mg-left-20">{{ rowData.orderDate }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>订单状态: 
						<text class="mg-left-20">{{ rowData.sstate }}</text>
					</text>
				</view>
				<view v-if="rowData.inTime" class="card-body-item card-body-item-100">
					<text>完工时间: 
						<text class="mg-left-20">{{ rowData.inTime }}</text>
					</text>
				</view>
				<view v-if="rowData.confQty" class="card-body-item card-body-item-100">
					<text>回签数量: 
						<text class="mg-left-20">{{ rowData.confQty }}</text>
					</text>
				</view>
				<view v-if="rowData.timeToGo" class="card-body-item card-body-item-100">
					<text>送货时间: 
						<text class="mg-left-20">{{ rowData.timeToGo }}</text>
					</text>
				</view>
				<view 
					v-if="rowData.carPName || rowData.carPName" 
					class="card-body-item card-body-item-100"
				>
					<view class="card-body-txt">送货人员:</view>
					<view 
						v-if="rowData.carPName" 
						class="card-body-txt mg-left-20"
					>
						{{ rowData.carPName }}
					</view>
					<view v-if="rowData.phone" class="card-body-txt mg-left-20">{{ rowData.phone }}</view>
				</view>
				<view v-if="rowData.carNo" class="card-body-item card-body-item-100">
					<text>送货车号: 
						<text class="mg-left-20">{{ rowData.carNo }}</text>
					</text>
				</view>
			</uni-card>
		</u-popup>
	</view>
</template>

<script>
	/* 自定义头部选择组件 */
	import WebappPrvNext from '@/components/webapp-prv-next/webapp-prv-next.vue'
	/* 自定义筛选组件 */
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue'
	/* 自定义纸板尺寸组件 */
	import WebappFilterBdSize from '@/components/webapp-filter-bd-size/webapp-filter-bd-size.vue'
	/* 自定义日期区间组件 */
	import WebappRangeDate from '@/components/webapp-range-date/webapp-range-date.vue'
	/* vuex辅助函数 */
	import { mapGetters } from 'vuex'
	/* api接口 */
	import { 
		fetchDailyOrderDetailDateList, 
		fetchDailyOrderDetailList,
		getDailyOrderDetailCusInfo
	} from '@/api/staff/customer.js'
import form from '../../../../uni_modules/uview-ui/libs/config/props/form'
	
	export default {
		components:{
			WebappPrvNext,
			WebappPopupFilter,
			WebappFilterBdSize,
			WebappRangeDate
		},
		data() {
			return {
				config: {
					/* 头部选择配置 */
					prevNext: {
						show: false,
						radioData: [],
						popupShow: false
					},
					/* 表格配置 */
					table: {
						height: null,
						column: [
							{ name: 'guige', label: '规格', fixed: true, width: 180 },
							{ name: 'scoreInfo', label: '压线信息', width: 120 },
							{ name: 'scoreType', label: '压线类型', width: 120 },
							{ name: 'boardName', label: '材质名称', width: 120 },
							{ name: 'ordQty', label: '数量', width: 80 },
							{ name: 'sstate', label: '状态', width: 80 },
						],
						data: [],
					},
					/* 菜单配置 */
					menu: {
						show: true,
						options: {
							id: 'cusDaliyOrderDetail',
							name: '菜单',
							childs: [
								{
									id: '1',
									name: '筛选'
								},
								{
									id: '2',
									name: '客户'
								}
							]
						}
					},
					/* 订单状态配置 */
					checkBox: {
						options: [
							{
								text: '全部',
								value: '全部',
							},
							{
								text: '未排产',
								value: '未排产',
							},
							{
								text: '排产中',
								value: '排产中',
							},
							{
								text: '生产中',
								value: '生产中',
							},
							{
								text: '生产完成',
								value: '生产完成',
							},
							{
								text: '装车中',
								value: '装车中',
							},
							{
								text: '已送货',
								value: '已送货',
							},
							{
								text: '已签收',
								value: '已签收',
							}
						]
					},
					/* 筛选配置 */
					filter: {
						show: false
					},
					/* 客户信息弹窗配置 */
					popup: {
						show: false
					},
					/* 列表详细信息 */
					rowData: {
						show: false
					},
				},
				/* 页面跳转参数 */
				filter: {},
				/* 筛选条件 */
				formData: {
					//客户编号
					cusId: null,
					//订单编号
					cusOrderId: null,
					//客订单号
					cusPoNo: null,
					//板长
					bdL: null,
					//板宽
					bdW: null,
					//压线信息
					scoreInfo: null,
					//订单数量
					ordQty: null,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//订单日期
					ordDate: null,
					//订单状态
					ordState: '全部',
					//日期区间
					rangeDate: [],
					//可选日期范围最大
					maxDate: null,
					//可选日期范围最小
					minDate: null
				},
				/* 客户信息 */
				cusInfo: {
					//客户简称
					cusName: null,
					//业务员姓名
					taskName: null,
					//跟单员
					merchandiser: null,
					//日期区间
					rangeDate: null,
					//下单笔数
					ordCount: null,
					//未排笔数
					unSelCount: null,
					//已排笔数
					selCount: null,
					//下单立方
					tOrdVol: null,
					//生产立方
					tProVol: null,
					//库存立方
					tStockVol: null,
					//未送立方
					tUnDeliVol: null,
					//排单未送金额
					ordAmt: null,
				},
				rowData: {
					//订单编号
					orderId: null,
					//客订单号
					cusPoNo: null,
					//规格
					guige: null,
					//压线
					scoreInfo: null,
					//材质名称
					boardName: null,
					//订单数
					ordQty: null,
					//下单日期
					orderDate: null,
					//订单状态
					sstate: null,
					//完工时间
					inTime: null,
					//送货时间
					timeToGo: null,
					//回签数量
					confQty: null,
					//送货司机
					carPName: null,
					//电话
					phone: null,
					//送货车号
					carNo: null
				}
			}
		},
		onLoad(options) {
			this.filter = JSON.parse(decodeURIComponent(options.filterInfo))
			Object.assign(
				this.formData, 
				this.filter
			)
		},
		mounted() {
			this.setTable()
			this.$nextTick(()=>{
				this.queryDateList()
			})
		},
		methods: {
			/* 设置表格配置 */
			setTable(){
				uni.createSelectorQuery().in(this).select("#dailyDetail").boundingClientRect( data =>{
					this.config.table.height = this.pageHeight - data.height - 25
				}).exec()
			},
			/* 头部单选选中 */
			radioConfirm( val ){
				this.config.table.data = this.$options.data().config.table.data
				this.formData.ordDate = val
				if( val ){
					this.queryList()
				}
			},
			/* 获取日期列表 */
			async queryDateList(){
				const { result } = await fetchDailyOrderDetailDateList(this.formData)
				this.$refs.prvNext.complete(result)
			},
			/* 获取数据列表 */
			async queryList(){
				const { result } = await fetchDailyOrderDetailList( this.formData )
				this.config.table.data = result
			},
			/* 表格点击 */
			rowClick( row, idx ){
				this.rowData = row
				this.config.rowData.show = true
			},
			/* 列表详细信息弹窗关闭 */
			rowDataClose(){
				this.config.rowData.show = false
				setTimeout(()=>{
					this.rowData = this.$options.data().rowData
				},200)
			},
			/* 获取客户信息 */
			async queryCusInfo(){
				const { result } = await getDailyOrderDetailCusInfo( this.formData )
				this.cusInfo = result
				this.config.popup.show = true
			},
			/* 客户信息弹窗关闭 */
			cusInfoClose(){
				this.config.popup.show = false
			},
			/* 菜单点击 */
			menuClick(e){
				if( e.id == '1' ){
					this.config.filter.show = true
				}
				if( e.id == '2' ){
					this.queryCusInfo()
				}
			},
			/* 点击重置 */
			reset(){
				Object.assign(
					this.formData,
					this.$options.data().formData,
					this.filter
				)
				this.queryDateList()
			},
			/* 点击筛选 */
			search(){
				this.queryDateList()
			},
			
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: 'page/pageHeight',
			}),
			/* 监听是否有弹窗打开 */
			showMenu(){
				return !this.config.prevNext.popupShow 
					&& !this.config.popup.show 
					&& !this.config.filter.show 
					&& !this.config.rowData.show
			}
		},
		watch: {
			/* 监听是否有弹窗打开 */
			showMenu( newV, oldV ){
				if( !newV ){
					//关闭菜单
					this.$refs.dailyOrderDetail.closeMenu()
				}
				this.config.menu.show = newV
			}
		}
	}
</script>

<!-- 样式引入 -->
<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>