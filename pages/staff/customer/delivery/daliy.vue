<template>
	<page-meta :page-style="'overflow:'+(config.popup.show?'hidden':'visible')"></page-meta>
	<view>
		<liu-rotating-menu 
			:btnObj="config.menu.options"
			:bottomPx="pageHeight * 0.8"
			@click="click">
		</liu-rotating-menu>
		<uni-list>
			<uni-list-item 
				showArrow 
				clickable 
				:title="item.title" 
				:rightText="item.rightText"
				v-for="(item, index) in listData" :key="index"
				@click="listClick"
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
	</view>
</template>

<script>
	import { fetchDeliveryDailyInfo } from '@/api/staff/customer.js';
	import { mapGetters } from "vuex";
	export default {
		data(){
			return {
				config: {
					menu: {
						options: {
							id: 'custDailyD',
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
					endDate: '2023-06-02',
					type: 1, 
				}
			}
		},
		mounted() {
			this.queryInfo();
		},
		methods: {
			click(e){
				if( e.id == '2' ){
					this.formData.type = 2;
					this.queryInfo();
				}
			},
			listClick(e){
				console.log('执行click事件', e.data)
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
				console.log('open')
			}
		},
		computed: {
			...mapGetters({
				pageHeight: "page/pageHeight" 
			}),
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
</style>