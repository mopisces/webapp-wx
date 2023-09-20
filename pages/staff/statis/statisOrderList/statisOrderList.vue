<template>
	<z-paging
		ref="sOrderList" 
		v-model="indexList" 
		:auto-show-system-loading="true"
		@query="queryList"
	>
		<uni-card
			:title="item.strOrderId" 
			:extra="item.cusPoNo"
			:is-shadow="true"
			v-for="(item, index) in indexList" :key="index"
		>
			<view class="card-body-container">
				<view class="card-body-item card-body-item-100">
					<text>客户信息:
						<text class="mg-left-20">{{ item.cusInfo }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>材质信息:
						<text class="mg-left-20">{{ item.boardId }}</text>
						<text class="mg-left-20">{{ item.matName }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>规格信息:
						<text class="mg-left-20">{{ item.guiGe }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>压线信息:
						<text class="mg-left-20">{{ item.scoreInfo }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-txt blue-color">订单</view>/
					<view class="card-body-txt green-color">送货</view>/
					<view v-if="formData.showQtyType == 1" class="card-body-txt red-color">退货:</view>
					<view v-if="formData.showQtyType == 2" class="card-body-txt red-color">库存:</view>
					<view class="card-body-txt blue-color mg-left-20">{{ item.ordQty }}</view>
					<view class="card-body-txt green-color mg-left-20">{{ item.deliQty }}</view>
					<view v-if="formData.showQtyType == 1" class="card-body-txt red-color mg-left-20">{{ item.returnQty }}</view>
					<view v-if="formData.showQtyType == 2" class="card-body-txt red-color mg-left-20">{{ item.stockQty }}</view>
				</view>
			</view>
		</uni-card>
	</z-paging>
</template>

<script>
	/* api接口 */
	import { fetchStatisOrderList } from '@/api/staff/statis.js'
	
	export default {
		data() {
			return {
				/* 列表数据 */
				indexList: [],
				/* 筛选条件 */
				formData: {
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//日期类型 1->订单日期 2->交货日期 3->退货日期 4->生效日期
					dateType: null,
					//筛选条件 1->门幅 2->客户 3->业务员 4->退货原因
					filterName: null,
					//筛选内容
					filterVal: null,
					//出库超期天数
					remainDay: null,
					//交货超期天数
					diffDay: null,
					//GetOrders存储过程的类型 1->GetOrderSum 2->GetOrdReturnSum 3->GetOrdStock
					getOrdersType: null,
					//1->显示退货数 2->显示库存数
					showQtyType: 1
				},
			}
		},
		onLoad(options) {
			/* 获取传递的参数 */
			this.formData = Object.assign(
				this.formData, 
				JSON.parse(decodeURIComponent(options.filterInfo))
			)
		},
		methods: {
			/* 获取列表数据 */
			async queryList( pageNo, pageSize ){
				this.formData.pageNo = pageNo
				this.formData.pageSize = pageSize
				const { result } = await fetchStatisOrderList( this.formData )
				this.$refs.sOrderList.complete(result)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/card.scss";
</style>