<template>
	<view>
		<webapp-prv-next
			id="deliveryDailyDetail"
			:popupShow.sync="config.prevNext.popupShow"
			:radioData="config.prevNext.radioData"
			:key="Math.random()"
			@radioConfirm="radioConfirm"
		>
		</webapp-prv-next>
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
			ref="dragMenu"
			v-show=" !config.prevNext.popupShow && !config.popup.show && !config.filter.show "
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
				<!-- 订单编号 -->
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
				<!-- 客订单号 -->
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
				<!-- 纸板尺寸 -->
				<webapp-filter-bd-size
					:bdL.sync="formData.bdL"
					:bdW.sync="formData.bdW"
				/>
				<!-- 压线信息 -->
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
				<!-- 订单数量 -->
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
	import WebappPrvNext from '@/components/webapp-prv-next/webapp-prv-next.vue'
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue'
	import WebappRangeDate from '@/components/webapp-range-date/webapp-range-date.vue'
	import WebappFilterBdSize from '@/components/webapp-filter-bd-size/webapp-filter-bd-size.vue'
	import { 
		fetchDeliveryDailyInfo, 
		fetchDeliveryDailyDetailDateList, 
		fetchDeliveryDailyDetailCusList
	} from '@/api/staff/customer.js'
	import { mapGetters } from 'vuex'
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
					prevNext: {
						show: false,
						radioData: [],
						popupShow: false
					},
					table: {
						height: null,
						column: [],
						data: [],
						columns: {
							staffDeliveryDailyDetail: [
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
							]
						},
					},
					menu: {
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
						},
						show: true
					},
					popup: {
						show: false
					},
					filter: {
						show: false
					},
					calendar: {
						show: false
					}
				},
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
				formData: {
					//获取客户信息
					type: 3,
					//客户编号
					cusId: null,
					//跳转前页面1->客户每日送货  2->客户每日订单
					fromType: null,
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
					maxDate: '',
					minDate: ''
				}
			}
		},
		onLoad(options) {
			this.formData = Object.assign( 
				this.formData, 
				JSON.parse(decodeURIComponent(options.filterInfo)), 
				{ type: 3 },
			);
		},
		mounted() {
			this.setTable();
			this.$nextTick(()=>{
				this.queryDateList();
			})
		},
		methods: {
			setTable(){
				uni.createSelectorQuery().in(this).select("#deliveryDailyDetail").boundingClientRect( data =>{
					this.config.table.height = this.pageHeight - data.height - 25;
				}).exec();
				this.config.table.column =
					this.formData.fromType == 1 ? this.config.table.columns.staffDeliveryDailyDetail : [];
			},
			menuClick(e){
				if( e.id == '1' ){
					this.config.filter.show = true;
				}
				if( e.id == '2' ){
					this.formData.type = 3;
					this.queryInfo();
				}
				this.menuClose();
			},
			menuClose(){
				this.$refs.dragMenu.closeMenu();
			},
			radioConfirm( val ){
				this.formData.dnDate = val;
				this.queryCusList();
			},
			async queryInfo(){
				const { result } = await fetchDeliveryDailyInfo( this.formData );
				this.cusInfo = result;
				this.config.popup.show = true;
			},
			async queryDateList(){
				const { result } = await fetchDeliveryDailyDetailDateList( this.formData );
				this.config.prevNext.radioData  = result;
			},
			async queryCusList(){
				const { result } = await fetchDeliveryDailyDetailCusList( this.formData );
				this.config.table.data = result;
			},
			/* 客户信息 */
			cusInfoClose(){
				this.config.popup.show = false;
			},
			/* 点击筛选 */
			search(){
				this.queryCusList();
			}
		},
		computed: {
			...mapGetters({
				pageHeight: 'page/pageHeight',
			})
		},
		watch: {
			
		}
	}
</script>


<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>