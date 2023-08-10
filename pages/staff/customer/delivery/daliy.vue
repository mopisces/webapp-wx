<template>
	<page-meta :page-style="'overflow:'+(config.popup.show || config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<liu-rotating-menu 
			ref="dragMenu"
			v-show="!config.filter.show && !config.popup.show " 
			:btnObj="config.menu.options"
			:bottomPct="0.8"
			@click="menuClick">
		</liu-rotating-menu>
		<uni-list>
			<uni-list-item 
				showArrow 
				clickable 
				:title="item.title" 
				:rightText="item.rightText"
				v-for="(item, index) in listData" :key="index"
				@click="itemClick(item)"
			/>
		</uni-list>
		<u-popup
			:show="config.popup.show" 
			:round="10"
			:safeAreaInsetBottom="false" 
			:zoom="false"
			:customStyle="{width:'650rpx'}" 
			:overlayStyle="{background:'rgba(3, 100, 219, 0.5)', touchAction:'none'}"
			mode="center" 
			@close="close" 
			@open="open"
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
				<webapp-cus-picker :cusId.sync="formData.cusId"></webapp-cus-picker>
				
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
	import { fetchDeliveryDailyInfo } from '@/api/staff/customer.js'
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue'
	import WebappCusPicker from '@/components/webapp-cus-picker/webapp-cus-picker.vue'
	import WebappRangeDate from '@/components/webapp-range-date/webapp-range-date.vue'
	export default {
		components:{
			WebappPopupFilter,
			WebappCusPicker,
			WebappRangeDate
		},
		data(){
			return {
				config: {
					menu: {
						show: true,
						options: {
							id: 'cusDailyDelivery',
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
					popup: {
						show: false,
					},
					filter: {
						show: false
					},
					calendar: {
						show: false
					}
				},
				staffInfo: {
					name: null,
					rangeDate: null,
					volume: null,
					salesArea: null,
					amt: null
				},
				listData: [],
				formData: {
					cusId: null,
					beginDate: '2023-06-01',
					endDate: '2023-06-05',
					type: 1, 
					
					maxDate: '2023-10-01',
					minDate: '2023-04-01',
					rangeDate: ['2023-06-01', '2023-06-05']
				}
			}
		},
		mounted() {
			this.queryInfo();
		},
		methods: {
			menuClick(e){
				if( e.id == '1' ){
					this.config.filter.show = true;
				}
				if( e.id == '2' ){
					this.formData.type = 2;
					this.queryInfo();
				}
				this.menuClose();
			},
			itemClick( row ){
				this.menuClose();
				const data = Object.assign({ fromType: 1 }, this.formData, {cusId: row.CusId});
				uni.navigateTo({
					url: '/pages/staff/customer/delivery/dailyDetail?filterInfo=' + encodeURIComponent(JSON.stringify(data)) 
				})
			},
			async queryInfo(){
				const {result} = await fetchDeliveryDailyInfo( this.formData );
				if( this.formData.type == 1 ){
					this.listData = [];
					this.listData = result;
				}
				if( this.formData.type == 2 ){
					this.staffInfo = result;
					this.config.popup.show = true;
				}
			},
			onPullDownRefresh(){
				this.formData.type = 1;
				this.queryInfo();
				uni.stopPullDownRefresh();
			},
			close(){
				this.config.popup.show = false;
			},
			open(){
				this.menuClose();
			},
			menuClose(){
				this.$refs.dragMenu.closeMenu();
			},
			//筛选按钮
			reset(){},
			search(){
				this.listData = [];
				this.formData.type = 1;
				this.queryInfo();
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>