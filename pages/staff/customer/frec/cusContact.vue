<!-- 客户往来统计 -->
<template>
	<view>
		<!-- 数据表格 -->
		<z-paging
			ref="cusContact" 
			v-model="config.mock.indexList" 
			:auto-show-system-loading="true"
			@query="queryList"
		>
			<uni-card
				v-for="(rowData, index) in config.mock.indexList" 
				:key="index"
				:title="rowData.cusName" 
				:extra="rowData.taskName"
				:is-shadow="true"
				@click="detailClick(rowData)"
			>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>结算时间:
							<text class="mg-left-20">{{ rowData.lastMBDate }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>上期余额:
							<text class="mg-left-20">{{ rowData.lastAmt }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>确收金额:
							<text class="mg-left-20">{{ rowData.confAmtT }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>确收面积:
							<text class="mg-left-20">{{ rowData.confArea }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>调整金额:
							<text class="mg-left-20">{{ rowData.adjustAmt }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>本期收款:
							<text class="mg-left-20">{{ rowData.cusPayAmt }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>订单未送:
							<text class="mg-left-20">{{ rowData.ordNeedAmt }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>当前欠款:
							<text class="mg-left-20">{{ rowData.curAmt }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>预警金额:
							<text class="mg-left-20">{{ rowData.preAmt }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>终止金额:
							<text class="mg-left-20">{{ rowData.minAmtCond }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>终止金额:
							<text class="mg-left-20">{{ rowData.minAmtCond }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>终止剩余:
							<text class="mg-left-20">{{ rowData.leftMinAmtCond }}</text>
						</text>
					</view>
				</view>
				<view class="card-body-item card-body-item-100">
					<view class="card-body-item card-body-item-50">
						<text>需付总额:
							<text class="mg-left-20">{{ rowData.curNeedPay }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-50">
						<text>累计开票:
							<text class="mg-left-20">{{ rowData.dNInvAmt }}</text>
						</text>
					</view>
				</view>
			</uni-card>
		</z-paging>
		<!-- 菜单按钮 -->
		<liu-rotating-menu
			ref="cusContactMenu"
			v-show=" showMenu "
			:btnObj="config.menu.options"
			:bottomPct="0.8"
			@click="menuClick()"
		></liu-rotating-menu>
		<!-- 汇总弹窗 -->
		<u-popup
			:show="config.popup.show" 
			:round="10"
			:safeAreaInsetBottom="false" 
			:zoom="false"
			:customStyle="{width:'700rpx'}" 
			:overlayStyle="{background:'rgba(3, 100, 219, 0.5)', touchAction:'none'}"
			mode="center" 
			@close="totalClose()" 
		>
			<uni-card
				title="汇总" 
				:is-shadow="true"
			>
				<view class="card-body-item card-body-item-100">
					<text>上期余额:
						<text class="mg-left-20">{{ totalData.lastAmt }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>确收金额:
						<text class="mg-left-20">{{ totalData.confAmtT }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>确收面积:
						<text class="mg-left-20">{{ totalData.confArea }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>调整金额:
						<text class="mg-left-20">{{ totalData.adjustAmt }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>本期收款:
						<text class="mg-left-20">{{ totalData.cusPayAmt }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>订单未送:
						<text class="mg-left-20">{{ totalData.ordNeedAmt }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>当前欠款:
						<text class="mg-left-20">{{ totalData.curAmt }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>需付总额:
						<text class="mg-left-20">{{ totalData.curNeedPay }}</text>
					</text>
				</view>
				<view class="card-body-item card-body-item-100">
					<text>累计开票:
						<text class="mg-left-20">{{ totalData.dNInvAmt }}</text>
					</text>
				</view>
			</uni-card>
		</u-popup>
		<!-- 筛选条件 -->
		<webapp-popup-filter
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>	
			<view>
				<!-- 客户 -->
				<webapp-cus-picker :cusId.sync="formData.cusId"></webapp-cus-picker>
				<!-- 业务员 -->
				<view class="popup-filter-item margin20">
					<view class="popup-filter-title">业务人员</view>
					<view class="popup-filter-content popup-filter-input">
						<view class="width100">
							<u--input
								v-model="formData.task" 
								placeholder="业务人员" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								>
							</u--input>
						</view>
					</view>
				</view>
			</view>
		</webapp-popup-filter>
		<!-- 调整信用额度 -->
		<u-modal 
			:show="config.modal.show"
			:title="config.modal.title"
			:showCancelButton="true"
			:asyncClose="true"
			width="700rpx"
			@cancel="modalCancel"
			@confirm="modalConfirm"
		>
			<view class="filter-container">
				<view class="popup-filter-item">
					<view class="popup-filter-title">终止金额</view>
					<view class="popup-filter-content popup-filter-input">
						<view>
							<u--input
								v-model="adjustData.oldPreAmt" 
								placeholder="原始终止金额" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								:disabled="true"
								>
							</u--input>
						</view>
						<view>=></view>
						<view>
							<u--input
								v-model="adjustData.preAmt" 
								placeholder="终止金额" 
								:disableDefaultPadding="true" 
								inputAlign="center" 
								>
							</u--input>
						</view>
					</view>
				</view>
				<view class="popup-filter-item">
					<view class="popup-filter-title">预警金额</view>
					<view class="popup-filter-content popup-filter-input">
						<view>
							<u--input
								v-model="adjustData.oldMinAmtCond" 
								placeholder="原始预警金额" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								:disabled="true"
								>
							</u--input>
						</view>
						<view>=></view>
						<view>
							<u--input
								v-model="adjustData.minAmtCond" 
								placeholder="预警金额" 
								:disableDefaultPadding="true" 
								inputAlign="center" 
								>
							</u--input>
						</view>
					</view>
				</view>
			</view>
		</u-modal>
		<!-- 提示 -->
		<u-notify ref="uNotify"></u-notify>
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from '@/components/webapp-popup-filter/webapp-popup-filter.vue'
	/* 自定义客户选择组件 */
	import WebappCusPicker from '@/components/webapp-cus-picker/webapp-cus-picker.vue'
	/* vuex辅助函数 */
	import { mapGetters } from 'vuex'
	/* api接口 */
	import { fetchCusContactList, getCusContactSum, updateAdjust } from '@/api/staff/customer.js'
	
	export default {
		components: {
			WebappPopupFilter,
			WebappCusPicker
		},
		data() {
			return {
				config: {
					/* 菜单配置 */
					menu: {
						options: {
							id: 'cusContact',
							name: '菜单',
							childs: [
								{
									id: '1',
									name: '筛选'
								},
								{
									id: '2',
									name: '汇总'
								}
							]
						}
					},
					/* 筛选弹窗配置 */
					filter: {
						show: false
					},
					/* 汇总弹窗配置 */
					popup: {
						show: false,
					},
					/* 模拟上拉加载数据 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: []
					},
					/* 信用额度调整弹窗配置 */
					modal: {
						show: false,
						title: '',
					}
				},
				/* 汇总信息 */
				totalData: {
					//上期结余
					lastAmt: 0,
					//确收金额
					confAmtT: 0,
					//调整金额
					adjustAmt: 0,
					//本期收款
					cusPayAmt: 0,
					//订单未送
					ordNeedAmt: 0,
					//当前欠款
					curAmt: 0,
					//确收面积
					confArea: 0,
					//当前需付总额
					curNeedPay: 0,
					//累计需开票
					dNInvAmt: 0
				},
				/* 筛选条件 */
				formData: {
					//业务员
					task: null, 
					//客户
					cusId: null,
					//当前页面
					pageNo: 1,
					//数据条数
					pageSize: 10
				},
				/* 信用额度调整条件 */
				adjustData: {
					//客户
					cusId: null,
					//客户全称
					cusName: null,
					//终止金额
					preAmt: null,
					//原始终止金额
					oldPreAmt: null,
					//预警金额
					minAmtCond: null,
					//原始预警金额
					oldMinAmtCond: null
				}
			}
		},
		mounted() {
			
		},
		methods: {
			/* 获取表格数据 */
			async queryList( pageNo, pageSize ){
				this.formData.pageNo = pageNo
				this.formData.pageSize = pageSize
				const { result } = await fetchCusContactList( this.formData )
				this.$refs.cusContact.complete(JSON.parse(JSON.stringify(result)))
			},
			/* 获取合计数据 */
			async querySum(){
				this.totalData = this.$options.data().totalData
				const { result } = await getCusContactSum()
				this.totalData = result
				this.config.popup.show = true
			},
			/* 菜单点击 */
			menuClick(e){
				if( e.id == '1' ){
					this.config.filter.show = true
				}
				if( e.id == '2' ){
					this.querySum()
				}
			},
			/* 汇总弹窗关闭触发 */
			totalClose(){
				this.config.popup.show = false
			},
			/* 筛选弹出点击重置 */
			reset(){
				this.formData = this.$options.data().formData
				this.$refs.cusContact.reload()
			},
			/* 筛选弹出点击筛选 */
			search(){
				this.$refs.cusContact.reload()
			},
			/* 列表点击 */
			async detailClick( rowData ){
				this.$refs.cusContactMenu.closeMenu()
				if(this.authMap.operateAuth.includes("调整信用额度")){
					this.$refs.uNotify.warning('缺少权限')
					return 
				}
				this.adjustData = this.$options.data().adjustData
				await Object.assign( this.adjustData, rowData )
				this.config.modal.title = rowData.cusName
				this.config.modal.show = true
			},
			/* 信用额度调整弹窗关闭 */
			modalCancel(){
				this.adjustData = this.$options.data().adjustData
				this.config.modal.title =  this.$options.data().config.modal.title
				this.config.modal.show = false
			},
			/* 信用额度调整弹窗确认 */
			async modalConfirm(){
				const { result } = await updateAdjust( this.adjustData )
				this.config.modal.show = false
				this.$refs.cusContact.reload()
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: 'page/pageHeight',
				authMap: "user/authMap", 
			}),
			/* 监听是否有弹窗打开 */
			showMenu(){
				return !this.config.filter.show && !this.config.popup.show
			}
		},
		watch: {
			showMenu( newV, oldV ){
				if( !newV ){
					//关闭菜单
					this.$refs.cusContactMenu.closeMenu()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
</style>