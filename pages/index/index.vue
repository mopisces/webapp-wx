<template>
	<view class="content">
		<z-paging 
			ref="paging" 
			v-model="indexList" 
			:auto-show-system-loading="true"
			@query="queryList"
		>
			<view slot="top">
				<u-tabs 
					:current="formData.erpState" 
					:list="config.tabs.list" 
					keyName="name"
					@change="tabsChange"
				>
					<view
						slot="right"
						style="padding-left: 8rpx;"
						@tap="config.filter.show = true"
					>
						<u-icon
							name="list"
							size="21"
							bold
						></u-icon>
					</view>
				</u-tabs>
			</view>
			<u-card
				:head-border-bottom="false"
				:foot-border-top="false"
				:padding="15"
				margin="10rpx"
				:foot-style="{paddingTop:'0'}"
				v-for="(item, index) in indexList" :key="index"
				@click="itemClick(item)"
			>
				<view slot="head" class="card-header-container">
					<view class="card-body-item card-body-item-50">
						<text>订单号:{{ item.strOrderId }}</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>客订单号:{{ item.CusPoNo }}</text>
					</view>
				</view>
				<view slot="body" class="card-body-container">
					<view v-if="item.MatName" class="card-body-item card-body-item-50">
						<view class="card-body-txt">货品名称:{{ item.MatName }}</view>
					</view>
					<view class="card-body-item card-body-item-50">
						<view class="card-body-txt">材质:{{ item.BoardId }}</view>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt">
							客户:{{ item.CusId}}({{ item.CusShortName }})
						</view>
					</view>
					<view class="card-body-item card-body-item-50">
						<view class="card-body-txt">规格:{{ item.GuiGe }}</view>
					</view>
					<view class="card-body-item card-body-item-50">
						<view class="card-body-txt">压线:{{ item.ScoreInfo }}</view>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt blue-color">订单</view>/
						<view class="card-body-txt green-color">送货</view>/
						<view class="card-body-txt red-color">退货</view>:
						<view class="card-body-txt blue-color">{{ item.OrdQty }}</view>/
						<view class="card-body-txt green-color">{{ item.DeliQty }}</view>/
						<view class="card-body-txt red-color">{{ item.ReturnQty }}</view>
					</view>
				</view>
			</u-card>
		</z-paging>
		<webapp-popup-filter 
			:filterShow.sync="config.filter.show"
			:isTabbar="true"
			@reset="reset"
			@search="search"
		>
			<view>
				<webapp-cus-picker 
					:defaultIndex="[1]" 
					:defaultValue="formData.cusId" 
					@cusConfirm="cusConfirm">
				</webapp-cus-picker>
				
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
				
				<view class="popup-filter-item margin20">
					<view class="popup-filter-title">纸箱尺寸</view>
					<view class="popup-filter-content popup-filter-input">
						<view>
							<u--input
								v-model="formData.boxL" 
								placeholder="长" 
								:disableDefaultPadding="true" 
								inputAlign="center" 
								>
							</u--input>
						</view>
						<view>×</view>
						<view>
							<u--input
								v-model="formData.boxW" 
								placeholder="宽" 
								:disableDefaultPadding="true" 
								inputAlign="center" 
								>
							</u--input>
						</view>
						<view>×</view>
						<view>
							<u--input 
								v-model="formData.boxH" 
								placeholder="高" 
								:disableDefaultPadding="true" 
								inputAlign="center" 
								>
							</u--input>
						</view>
					</view>
				</view>
				
				<view class="popup-filter-item margin20">
					<view class="popup-filter-title">纸板尺寸</view>
					<view class="popup-filter-content popup-filter-input">
						<view>
							<u--input
								v-model="formData.bdL" 
								placeholder="长" 
								:disableDefaultPadding="true" 
								inputAlign="center" 
								>
							</u--input>
						</view>
						<view>×</view>
						<view>
							<u--input
								v-model="formData.bdW" 
								placeholder="宽" 
								:disableDefaultPadding="true" 
								inputAlign="center" 
								>
							</u--input>
						</view>
					</view>
				</view>
				
				<view class="popup-filter-item margin20" @click="config.calendar.show = true">
					<view class="popup-filter-title">日期区间</view>
					<view class="popup-filter-content popup-filter-input">
						<view>
							<u--input
								v-model="formData.beginDate" 
								placeholder="开始日期" 
								:disabled="true"
								:disableDefaultPadding="true" 
								inputAlign="center" 
							>
							</u--input>
						</view>
						<view>~</view>
						<view>
							<u--input
								v-model="formData.endDate" 
								placeholder="结束日期" 
								:disabled="true"
								:disableDefaultPadding="true" 
								inputAlign="center" 
							>
							</u--input>
						</view>
						<view>
							<u-icon name="arrow-right" color="#2979ff" size="15"></u-icon>
						</view>
					</view>
				</view>
				
				<view class="popup-filter-checkbox margin20">
					<view class="popup-filter-title">日期类型</view>
					<view class="popup-filter-content popup-filter-input">
						<uni-data-checkbox
							mode="tag"
							v-model="formData.dateType" 
							:localdata="config.checkBox.options">
						</uni-data-checkbox>
						<!-- <liu-checkBox 
							checkType="single" 
							:checkOptions="config.checkBox.options" 
							activeColor="#FF0000" 
							@checkChange="dateTypeChange"
						>
						</liu-checkBox> -->
					</view>
				</view>
			</view>
			
		</webapp-popup-filter>
		<u-calendar 
			:show="config.calendar.show" 
			:showTitle="false"
			mode="range" 
			:closeOnClickOverlay="false" 
			:allowSameDay="true"
			:defaultDate="formData.rangeDate"
			:minDate="formData.minDate"
			:maxDate="formData.maxDate"
			@confirm="dateConfirm"
			@close="config.calendar.show = false"
			v-if="config.calendar.show"
		>
		</u-calendar>
	</view>
</template>

<script>
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue';
	/* import LiuCheckBox from '@/uni_modules/liu-checkBox/components/liu-checkBox/liu-checkBox.vue'; */
	import WebappCusPicker from '@/components/webapp-cus-picker/webapp-cus-picker.vue';
	import { getErpOrders, getErpConfig } from '@/api/staff/erpOrders.js'
	export default {
		components:{
			WebappPopupFilter,
			/* LiuCheckBox, */
			WebappCusPicker,
		},
		data() {
			return {
				config:{
					tabs:{
						list:[
							{
								name:'全部'
							},
							{
								name:'未审核'
							},
							{
								name:'已审核'
							},
							{
								name:'已传单'
							},
							{
								name:'已入库'
							},
							{
								name:'已送货'
							},
							{
								name:'有退货'
							}
						]
					},
					checkBox: {
						options: [
							{
								text: '订单日期',
								value:1,
							},
							{
								text: '交货日期',
								value:2,
							}
							
						]
					},
					calendar: {
						show: false
					},
					filter: {
						show: false
					}
				},
				show:false,
				indexList: [],
				formData:{
					erpState: 0,
					//客户
					cusId: null,
					//客订单号
					cusOrderId: null,
					//订单数量
					ordQty:null,
					//纸箱尺寸
					boxL: null,
					boxW: null,
					boxH: null,
					//纸板尺寸
					bdL: null,
					bdW: null,
					//日期
					rangeDate: [ ],
					beginDate: null,
					endDate: null,
					//日期类型
					dateType: 1, 
					//分页信息
					pageNo: 1,
					pageSize: 10,
					//可选日期范围
					maxDate: null,
					minDate: null,
					//页面是否需要重新请求参数
					pageInit: true,
				}
			}
		},
		onLoad() {
			
		},
		created() {
		
		},
		mounted() {
			
		},
		methods: {
			async queryList( pageNo, pageSize ){
				if( this.formData.pageInit ){
					const { result } = await getErpConfig();
					this.formData.minDate = result.Wap1GetOrdersMinDate
					this.formData.maxDate = result.Wap1GetOrdersMaxDate
					this.formData.beginDate = result.Wap1GetOrdersBeginDate
					this.formData.endDate = result.Wap1GetOrdersEndDate
					this.formData.rangeDate = [ this.formData.beginDate, this.formData.endDate ]
					this.formData.pageInit = false;
				}
				const { result } = await getErpOrders(this.formData);
				this.$refs.paging.complete(result)
			},
			tabsChange( evt ){
				this.formData.erpState = evt.index;
			},
			close(){
				this.config.filter.show = false;
			},
			dateTypeChange( item ){
				this.formData.dateType = item[0].id;
			},
			dateConfirm( dateList ) {
				this.config.calendar.show = false;
				this.formData.beginDate = dateList[0];
				this.formData.endDate = dateList[ dateList.length - 1 ];
			},
			itemClick(index){
				console.log(index)
			},
			cusConfirm( value ){
				this.formData.cusId = value.CusId;
			},
			reset(){
				this.formData = this.$options.data().formData;
				this.$refs.paging.reload();
			},
			search(){
				this.$refs.paging.reload();
			}
		},
		computed: {
			erpStatusChange(){
				return this.formData.erpState;
			}
		},
		watch: {
			erpStatusChange( newV, oldV ){
				this.$refs.paging.reload();
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
</style>
<!-- list-item -->
<style lang="scss" scoped>
	.card-header-container{
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: $u-main-color;
	}
	
	.card-body-container{
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-flow: wrap;
	}
	
	.card-body-item{
		display: flex;
		overflow: hidden;
		/* align-items: center;
		justify-content: space-between; */
		padding: 5rpx 0;
	}
	
	.card-body-txt{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	
	.card-body-item-100{
		width:100%;
	}
	
	.card-body-item-50{
		width:50%;
	}
	
	.red-color{
		color: $u-error;
	}
	.blue-color{
		color: $u-primary;
	}
	.green-color{
		color: $u-success;
	}
	
	.card-footer-container{
		display: flex;
		justify-content: flex-end;
	}
	
	.confirmBtn{
		height:40rpx;
		font-size: 28rpx;
		padding: 0 15rpx;
	}
</style>