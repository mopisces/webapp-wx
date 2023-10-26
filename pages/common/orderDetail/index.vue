<!-- 内外部用户公用 -->
<!-- 订单详情 -->
<template>
	<view>
		<uni-collapse>
			<uni-collapse-item v-if="config.collapse.dnreShow" title="退货信息">
				<uni-card
					key="returnDetail"
					:title="config.dnre.dnStr" 
					:extra="config.dnre.orderId"
					:is-shadow="true"
				>
					<view class="card-body-container">
						<view class="card-body-item card-body-item-100">
							<text>生效日期: 
								<text class="mg-left-20">{{ config.dnre.issueDate }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>送货信息: 
								<text class="mg-left-20">{{ config.dnre.deliQty }}</text>
								<text class="mg-left-20">{{ config.dnre.tSalesArea }}(㎡)</text>
								<text class="mg-left-20">{{ config.dnre.deliAmt }}(元)</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>价格信息: 
								<text class="mg-left-20">{{ config.dnre.price }}(元)</text>
								<text class="mg-left-20">{{ config.dnre.squarePrice }}(元/㎡)</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>退货原因:
								<text class="mg-left-20">{{ config.dnre.returnCause }}</text>
							</text>
						</view>
					</view>
				</uni-card>
			</uni-collapse-item>
			<uni-collapse-item v-if="config.collapse.dnShow" title="送货信息">
				<uni-card
					key="dnInfo"
					:title="config.dn.dnStr" 
					:extra="config.dn.orderId"
					:is-shadow="true"
				>
					<view class="card-body-container">
						<view class="card-body-item card-body-item-100">
							<view class="card-body-txt">是否回签:</view>
							<view class="card-body-txt mg-left-20">
								<u-icon
									:name="config.dn.signed==1?'checkmark-circle':'close-circle'" 
									:color="config.dn.signed==1?'#5ac725':'#f56c6c'" 
									size="18">
								</u-icon>
							</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>装货日期: 
								<text class="mg-left-20">{{ config.dn.packDate }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>送货日期: 
								<text class="mg-left-20">{{ config.dn.dnDate }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>生效日期: 
								<text class="mg-left-20">{{ config.dn.issueDate }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>送货信息: 
								<text class="mg-left-20">{{ config.dn.deliQty }}</text>
								<text class="mg-left-20">{{ config.dn.tSalesArea }}(㎡)</text>
								<text class="mg-left-20">{{ config.dn.deliAmt }}(元)</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>价格信息: 
								<text class="mg-left-20">{{ config.dn.price }}(元)</text>
								<text class="mg-left-20">{{ config.dn.squarePrice }}(元/㎡)</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>送货公司: 
								<text class="mg-left-20">{{ config.dn.cusSubNo }}</text>
								<text class="mg-left-20">{{ config.dn.cusSubName }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>送货地址: 
								<text class="mg-left-20">{{ config.dn.subDNAddress }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>公司联系人: 
								<text class="mg-left-20">{{ config.dn.subContactPerson }}</text>
								<text class="mg-left-20">{{ config.dn.subTelNo }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>司机信息: 
								<text class="mg-left-20">{{ config.dn.carNo }}</text>
								<text class="mg-left-20">{{ config.dn.carPName }}</text>
								<text class="mg-left-20">{{ config.dn.phone }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>送货备注: 
								<text class="mg-left-20">{{ config.dn.dnRemark }}</text>
							</text>
						</view>
					</view>
				</uni-card>
			</uni-collapse-item>
			<uni-collapse-item v-if="config.collapse.schShow" title="传单信息">
				<uni-card
					key="sch"
					:is-shadow="true"
				>
					<view class="card-body-container">
						<view class="card-body-item card-body-item-100">
							<text>工单状态: 
								<text class="mg-left-20">{{ config.sch.sState }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>门幅信息: 
								<text class="mg-left-20">{{ config.sch.sPaperWidth }}(mm)</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>传单数量: 
								<text class="mg-left-20">{{ config.sch.sQty }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>添加时间: 
								<text class="mg-left-20">{{ config.sch.addTime }}</text>
							</text>
						</view>
					</view>
				</uni-card>
			</uni-collapse-item>
			<uni-collapse-item v-if="config.collapse.ordInfoShow" title="订单信息">
				<uni-card
					key="ordInfo"
					:title="config.ordInfo.strOrderId" 
					:extra="config.ordInfo.cusPoNo"
					:is-shadow="true"
				>
					<view class="card-body-container">
						<view class="card-body-item card-body-item-100">
							<text>客户信息: 
								<text class="mg-left-20">
									{{ config.ordInfo.cusShortName }}( {{config.ordInfo.cusId}} )
								</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>送货备注: 
								<text class="mg-left-20">
									{{ config.ordInfo.dnRemark }}
								</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>材质信息: 
								<text class="mg-left-20">{{ config.ordInfo.boardId }}</text>
								<text class="mg-left-20">{{ config.ordInfo.boardName }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>压线信息: 
								<text class="mg-left-20">{{ config.ordInfo.scoreInfo }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>压型信息: 
								<text class="mg-left-20">{{ config.ordInfo.scoreType }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>货品名称: 
								<text class="mg-left-20">{{ config.ordInfo.matName }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>箱型信息: 
								<text class="mg-left-20">{{ config.ordInfo.boxName }}</text>
								<text class="mg-left-20">
									{{ config.ordInfo.boxL }}×{{ config.ordInfo.boxW }}×{{ config.ordInfo.boxH }}
								</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>纸板信息: 
								<text class="mg-left-20">
									{{ config.ordInfo.length }}×{{ config.ordInfo.width }}
								</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>工艺流程: 
								<text class="mg-left-20">{{ config.ordInfo.proFlow }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>销售面积: 
								<text class="mg-left-20">{{ config.ordInfo.tSalesArea }}(㎡)</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>价格信息: 
								<text class="mg-left-20">{{ config.ordInfo.price }}(元)</text>
								<text class="mg-left-20">{{ config.ordInfo.squarePrice }}(元/㎡)</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>合计金额: 
								<text class="mg-left-20">{{ config.ordInfo.amt }}(元)</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-txt blue-color">订单</view>||
							<view class="card-body-txt green-color">送货</view>||
							<view class="card-body-txt red-color">退货</view>:
							<view class="card-body-txt blue-color mg-left-20">{{ config.ordInfo.ordQty }}</view>
							<view class="card-body-txt green-color mg-left-20">{{ config.ordInfo.deliQty }}</view>
							<view class="card-body-txt red-color mg-left-20">{{ config.ordInfo.returnQty }}</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-txt blue-color">传单</view>||
							<view class="card-body-txt green-color">完工</view>:
							<view class="card-body-txt blue-color mg-left-20">{{ config.ordInfo.schQty }}</view>
							<view class="card-body-txt green-color mg-left-20">
								{{ config.ordInfo.finishedQty }}
							</view>
						</view>
					</view>
				</uni-card>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script>
	/* 方法 */
	import { isArray } from "@/utils/validate.js"
	/* api接口 */
	import { getOrderDetail } from "@/api/pub/common.js"
	
	export default {
		data() {
			return {
				/* 配置 */
				config: {
					/* 折叠面板 */
					collapse: {
						dnreShow: false,
						dnShow: false,
						schShow: false,
						ordInfoShow: false
					},
					/* 退货信息 */
					dnre: {
						//单号
						dnStr: null,
						//生效日期
						issueDate: null,
						//订单编号
						orderId: null,
						//送货数
						deliQty: null,
						//销售面积
						tSalesArea: null,
						//送货金额
						deliAmt: null,
						//价格(元)
						price: null,
						//平方价(元/㎡)
						squarePrice: null,
						//退货原因
						returnCause: null
					},
					/* 送货信息 */
					dn: {
						//单号
						dnStr: null,
						//订单编号
						orderId: null,
						//是否回签
						signed: null,
						//装货日期
						packDate: null,
						//送货日期
						dnDate: null, 
						//生效日期
						issueDate: null,
						//送货数
						deliQty: null,
						//销售面积
						tSalesArea: null,
						//送货金额
						deliAmt: null,
						//价格(元)
						price: null,
						//平方价(元/㎡)
						squarePrice: null,
						//送货备注
						dnRemark: null,
						//送货公司
						cusSubNo: null,
						//子公司简称
						cusSubName: null,
						//送货地址
						subDNAddress: null,
						//联系人
						subContactPerson: null,
						//联系电话
						subTelNo: null,
						//车牌号
						carNo: null, 
						//司机姓名
						carPName: null,
						//电话
						phone: null,
					},
					/* 传单明细 */
					sch: {
						//工单状态
						sState: null,
						//门幅(mm)
						sPaperWidth: null,
						//数量
						sQty: null,
						//添加时间
						addTime: null,
					},
					/* 订单明细 */
					ordInfo: {
						//订单编号
						strOrderId: null,
						//客订单号
						cusPoNo: null,
						//客户编号
						cusId: null,
						//客户简称
						cusShortName: null,
						//送货备注
						dnRemark: null,
						//订单材质
						boardId: null,
						//材质名称
						boardName: null,
						//压线信息
						scoreInfo: null,
						//压型
						scoreType: null,
						//货品名称
						matName: null,
						//箱型
						boxName: null,
						//箱长(mm)
						boxL: null,
						//箱宽(mm)
						boxW: null,
						//箱高(mm)
						boxH: null,
						//板长(mm)
						length: null,
						//板宽(mm)
						width: null,
						//工艺流程
						proFlow: null,
						//订单数
						ordQty: null,
						//传单数
						schQty: null,
						//完工数
						finishedQty: null,
						//送货数
						deliQty: null,
						//补单数
						reQty: null,
						//退货数
						returnQty: null,
						//销售面积(㎡)
						tSalesArea: null,
						//价格(元)
						price: null,
						//平方价(元/㎡)
						squarePrice: null,
						//金额(元)
						amt: null
					},
				},
				/* 筛选信息 */
				formData: {
					//内部订单号
					orderId: null,
					//订单类型
					orderType: null,
				}
			}
		},
		onLoad(options) {
			/* 获取传递的参数 */
			this.formData = Object.assign(
				this.formData, 
				JSON.parse(decodeURIComponent(options.filterInfo))
			)
			this.getDetail()
		},
		methods: {
			async getDetail(){
				this.config = this.$options.data().config
				const { result } = await getOrderDetail(this.formData)
				if( !isArray(result.dn) ){
					this.config.dn = result.dn
					this.config.collapse.dnShow = true
				}
				if( !isArray(result.dnre) ){
					this.config.dnre = result.dnre
					this.config.collapse.dnreShow = true
				}
				if( !isArray(result.sch) ){
					this.config.sch = result.sch
					this.config.collapse.schShow = true
				}
				if( !isArray(result.ordInfo) ){
					this.config.ordInfo = result.ordInfo
					this.config.collapse.ordInfoShow = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/card.scss";
</style>