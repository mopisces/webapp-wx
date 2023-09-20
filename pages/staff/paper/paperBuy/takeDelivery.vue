<!-- 原纸收货 -->
<template>
	<view>
		<!-- 总重量按钮 -->
		<liu-drag-button 
			v-show=" !config.prevNext.popupShow "
			:bottomPx="pageHeight*0.8"
			@clickBtn="totalClick"
		>
			<text>总重量</text>
		</liu-drag-button>
		<!-- 显示总重量 -->
		<u-toast ref="total"></u-toast>
		<!-- 订单列表 -->
		<z-paging 
			ref="takeDelivery" 
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
					:value.sync="formData.recDate"
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
						<text>供应商:
							<text class="mg-left-20">{{ item.shortName }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>收货数量: 
							<text class="mg-left-20">{{ item.inQty }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>收货重量: 
							<text class="mg-left-20">{{ item.sumInWt }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>纸质种类: 
							<text class="mg-left-20">{{ item.sumPaper }}</text>
						</text>
					</view>
				</view>
			</uni-card>
		</z-paging>
	</view>
</template>

<script>
	/* 自定义头部选择组件 */
	import WebappPrvNext from "@/components/webapp-prv-next/webapp-prv-next.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { fetchTakeDeliveryDateList, fetchTakeDeliveryList } from "@/api/staff/paper.js"
	
	export default {
		components:{
			WebappPrvNext
		},
		data() {
			return {
				/* 配置 */
				config: {
					/* 头部选择配置 */
					prevNext: {
						popupShow: false,
						/* 头部选择单选配置 */
						radioData: [],
					},
					/* 模拟上拉加载数据 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: [],
						/* 总重量 */
						total: null
					},
				},
				/* 筛选条件 */
				formData: {
					/* 收货日期 */
					recDate: null,
				}
			}
		},
		onReady(){
			this.queryDateList()
		},
		methods: {
			/* 头部选择选中后触发 */
			radioConfirm( val ){
				this.formData.recDate = val
				if( val ){
					this.$refs.takeDelivery.reload()
				}else{
					this.$refs.takeDelivery.complete([])
				}
			},
			/* 获取日期列表 */
			async queryDateList(){
				const { result } = await fetchTakeDeliveryDateList()
				this.$refs.prvNext.complete(result)
			},
			/* 获取列表数据 */
			async queryList(){
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await fetchTakeDeliveryList( this.formData )
				this.config.mock.indexList = result.list
				this.config.mock.total = result.total
			},
			/* 模拟上拉加载下拉刷新数据 */
			async queryMock( pageNo, pageSize ){
				if( this.formData.recDate == null ){
					return 
				}
				if( pageNo == 1 ){
					await this.queryList( this.formData )
				}
				var subList = []
				if( this.config.mock.indexList.length > 0 ){
					subList = this.config.mock.indexList.splice(0, pageSize )
				}
				setTimeout(()=>{
					this.$refs.takeDelivery.complete(subList)
				}, 1500)
			},
			/* 总重量按钮点击 */
			totalClick(){
				this.$refs.total.show({
					message: this.config.mock.total,
					type: 'default',
					duration: 3000,
				})
			},
			/* 列表详细信息 */
			detailClick( row ){
				const data = {
					//数据类型 0->原纸收货 1->原纸采购
					dataType: 0,
					//供应商 
					shortName: row.shortName,
					//显示日期
					date: row.date,
					//对应的收货单号或者采购单号
					keyWord: row.title
				}
				uni.navigateTo({
					url: '/pages/staff/paper/paperBuy/detail?filterInfo='
						+ encodeURIComponent(JSON.stringify(data))
				})
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight",
			})
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>