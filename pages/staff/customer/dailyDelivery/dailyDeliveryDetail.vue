<!-- 客户每日送货详情 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+( showMenu ?'hidden':'visible')"></page-meta>
	<view>
		<!-- 头部选择 -->
		<webapp-prv-next
			id="deliveryDailyDetail"
			ref="prvNext"
			:popupShow.sync="config.prevNext.popupShow"
			:value.sync="formData.dnDate"
			:key="Math.random()"
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
			></zb-table>
		</view>
		<!-- 菜单按钮 -->
		<liu-rotating-menu
			ref="deliveryDailyDetail"
			v-show=" config.menu.show "
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
								placeholder="订单编号" 
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
								placeholder="订单编号" 
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
								placeholder="订单编号" 
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
						<text>送货笔数: 
							<text class="mg-left-20">{{ cusInfo.iCount }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>送货数量:
							<text class="mg-left-20">{{ cusInfo.deliQty }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>送货立方:
							<text class="mg-left-20">{{ cusInfo.deliVolume }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>销售面积: 
							<text class="mg-left-20">{{ cusInfo.salesArea }}</text>
						</text>
					</view>
				</view>
			</uni-card>
		</u-popup>
		
	</view>
</template>

<script>
	/* 自定义头部选择组件 */
	import WebappPrvNext from "@/components/webapp-prv-next/webapp-prv-next.vue"
	/* 自定义筛选组件 */
	import WebappPopupFilter from "@/components/webapp-popup-filter/webapp-popup-filter.vue"
	/* 自定义纸板尺寸组件 */
	import WebappFilterBdSize from "@/components/webapp-filter-bd-size/webapp-filter-bd-size.vue"
	/* 自定义日期区间组件 */
	import WebappRangeDate from "@/components/webapp-range-date/webapp-range-date.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { 
		fetchDeliveryDailyInfo, 
		fetchDeliveryDailyDetailDateList, 
		fetchDeliveryDailyDetailCusList
	} from '@/api/staff/customer.js'
	
	export default {
		components:{
			WebappPrvNext,
			WebappPopupFilter,
			WebappRangeDate,
			WebappFilterBdSize
		},
		data(){
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
							{ name: 'GuiGe', label: '规则', fixed: true, width: 150 },
							{ name: 'BoardName', label: '材质名称', width: 120 },
							{ name: 'DeliQty', label: '送货数', width: 100 },
							{ name: 'TSalesArea', label: '送货面积', width: 100 },
							{ name: 'strPNo', label: '送货单号', width: 100 },
							{ name: 'OrderId', label: '订单编号', width: 100 },
							{ name: 'CusPoNo', label: '客订单号', width: 120 },
							{ name: 'ScoreInfo', label: '压线', width: 180 },
							{ name: 'OrdQty', label: '订单数', width: 80 },
							{ name: 'OrdDeliQty', label: '累计送货数', width:100 },
							{ name: 'CarNo', label: '送货车号', width: 100 },
							{ name: 'CarPName', label: '司机', width: 70 },
							{ name: 'Phone', label: '电话', width: 120 },
							{ name: 'TimeToGo', label: '送货时间', width: 100 },
						],
						data: []
					},
					/* 菜单配置 */
					menu: {
						show: true,
						options: {
							id: 'cusDaliyDeliveryDetail',
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
					/* 客户信息弹窗配置 */
					popup: {
						show: false
					},
					/* 筛选配置 */
					filter: {
						show: false
					}
				},
				/* 客户信息 */
				cusInfo: {
					//客户简称
					cusName: null,
					//业务员姓名
					taskName: null,
					//送货笔数
					iCount: null,
					//日期区间
					rangeDate: null,
					//送货数
					deliQty: null,
					//销售面积
					salesArea: null,
					//送货立方
					deliVolume: null
				},
				/* 筛选条件 */
				formData: {
					//客户编号
					cusId: null,
					//订单编号
					cusOrderId: null,
					//客订单号
					cusPoNo: null,
					//板厂
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
					//送货日期
					dnDate: null,
					//日期区间
					rangeDate: [],
					//可选日期范围最大
					maxDate: null,
					//可选日期范围最小
					minDate: null
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
			this.setTable();
			this.$nextTick(()=>{
				this.queryDateList()
			})
		},
		methods: {
			/* 设置表格配置 */
			setTable(){
				uni.createSelectorQuery().in(this).select("#deliveryDailyDetail").boundingClientRect( data =>{
					this.config.table.height = this.pageHeight - data.height - 25
				}).exec()
			},
			/* 菜单点击 */
			menuClick(e){
				if( e.id == '1' ){
					this.config.filter.show = true
				}
				if( e.id == '2' ){
					this.formData.type = 3
					this.queryInfo()
				}
			},
			/* 头部单选选中 */
			radioConfirm( val ){
				this.config.table.data = this.$options.data().config.table.data
				this.formData.dnDate = val
				if( val ){
					this.queryCusList()
				}
			},
			/* 获取客户信息 */
			async queryInfo(){
				const { result } = await fetchDeliveryDailyInfo( this.formData )
				this.cusInfo = result
				this.config.popup.show = true;
			},
			/* 获取日期列表 */
			async queryDateList(){
				this.$refs.prvNext.complete([])
				const { result } = await fetchDeliveryDailyDetailDateList( this.formData )
				this.$refs.prvNext.complete(result)
			},
			/* 获取表格列表 */
			async queryCusList(){
				const { result } = await fetchDeliveryDailyDetailCusList( this.formData )
				this.config.table.data = result
			},
			/* 客户信息弹窗关闭 */
			cusInfoClose(){
				this.config.popup.show = false
			},
			/* 点击筛选 */
			search(){
				this.queryDateList()
			},
			/* 点击重置 */
			reset(){
				Object.assign(
					this.formData,
					this.$options.data().formData,
					this.filter
				)
				this.queryDateList()
			}
		},
		computed: {
			/* 页面参数 */
			...mapGetters({
				pageHeight: "page/pageHeight",
			}),
			showMenu(){
				return !this.config.prevNext.popupShow && !this.config.popup.show && !this.config.filter.show
			}
		},
		watch: {
			showMenu( newV, oldV ){
				if( !newV ){
					//关闭菜单
					this.$refs.deliveryDailyDetail.closeMenu()
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