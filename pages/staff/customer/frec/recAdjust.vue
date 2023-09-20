<!-- 收款调账 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+(config.filter.show?'hidden':'visible')"></page-meta>
	<view>
		<!-- 菜单按钮 -->
		<liu-rotating-menu 
			ref="recAdjustMenu"
			v-show=" showMenu " 
			:btnObj="config.menu.options"
			:bottomPct="0.8"
			@click="menuClick">
		</liu-rotating-menu>
		<!-- 筛选弹窗 -->
		<webapp-popup-filter 
			:filterShow.sync="config.filter.show"
			:isTabbar="false"
			@reset="reset"
			@search="search"
		>
			<webapp-cus-picker ref="cusId" :cusId.sync="formData.cusId"></webapp-cus-picker>
			<!-- 业务员 -->
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">业务员</view>
				<view class="popup-filter-content popup-filter-input">
					<view class="width100">
						<u--input
							v-model="formData.keyWord" 
							placeholder="输入业务员" 
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
			<!-- 日期类型 -->
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">日期类型</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.dateType" 
						:localdata="config.filter.checkBox.dateType">
					</uni-data-checkbox>
				</view>
			</view>
			<!-- 科目类型 -->
			<view class="popup-filter-item margin20" >
				<view class="popup-filter-title">科目信息</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						v-model="formData.payType" 
						:localdata="config.filter.checkBox.payType">
					</uni-data-checkbox>
				</view>
			</view>
		</webapp-popup-filter>
		<!-- 数据列表 -->
		<z-paging
			ref="recAdjustList" 
			v-model="config.indexList" 
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryList"
		>
			<view slot="top">
				<u-subsection 
					:list="config.subsection.list" 
					:current="config.subsection.current"
					@change="sectionChange"
				>
				</u-subsection>
			</view>
			<uni-card
				v-for="(item, index) in config.indexList" 
				:key="index"
				:title="item.cusInfo" 
				:extra="item.payId"
				:is-shadow="true"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt">审核状态:</view>
						<view class="card-body-txt mg-left-20">
							<u-icon 
								:name="item.checked==1?'checkmark-circle':'close-circle'" 
								:color="item.checked==1?'#5ac725':'#f56c6c'" 
								size="18">
							</u-icon>
						</view>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>操作日期: 
							<text class="mg-left-20">{{ item.opDate }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>生效日期: 
							<text class="mg-left-20">{{ item.issueDate }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>备注信息: 
							<text class="mg-left-20">{{ item.remark }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt">是否需开票:</view>
						<view class="card-body-txt mg-left-20">
							<u-icon 
								:name="item.needInv==1?'checkmark-circle':'close-circle'" 
								:color="item.needInv==1?'#5ac725':'#f56c6c'" 
								size="18">
							</u-icon>
						</view>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>科目信息: 
							<text class="mg-left-20">{{ item.shortName }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>业务人员: 
							<text class="mg-left-20">{{ item.taskInfo }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>收据编号: 
							<text class="mg-left-20">{{ item.receiptNo }}</text>
						</text>
					</view>
				</view>
				<view slot="actions" class="card-actions">
					<template v-if="item.checked==1">
						<view class="card-actions-item" @click="doCheck(item, index)">
							<u-icon name="error" color="#909399" size="18"></u-icon>
							<text class="card-actions-item-text">取消审核</text>
						</view>
					</template>
					<template v-else>
						<view class="card-actions-item" @click="doCheck(item, index)">
							<u-icon name="checkbox-mark" color="#5ac725" size="18"></u-icon>
							<text class="card-actions-item-text">审核</text>
						</view>
						<view 
							class="card-actions-item"
							@click="config.modify.show=true;rowClick(item, index)"
						>
							<u-icon name="edit-pen" color="#3c9cff" size="18"></u-icon>
							<text class="card-actions-item-text">修改</text>
						</view>
						<view 
							class="card-actions-item" 
							@click="config.del.show=true;rowClick(item, index)"
						>
							<u-icon name="close-circle" color="#f56c6c" size="18"></u-icon>
							<text class="card-actions-item-text">删除</text>
						</view>
					</template>
				</view>
			</uni-card>
		</z-paging>
		<!-- 删除原因 -->
		<u-modal 
			:show="config.del.show" 
			title="删除原因"
			:asyncClose="true"
			:showCancelButton="true"
			@cancel="config.del.show=false"
			@confirm="doDel()"
		>
			<u--textarea v-model="rowData.delRemark" placeholder="请输入删除原因" >
			</u--textarea>
		</u-modal>
		<!-- 修改弹窗 -->
		<u-modal
			:show="config.modify.show"
			width="690rpx"
			:asyncClose="true"
			:showCancelButton="true"
			@cancel="config.modify.show=false"
			@confirm="doModify()"
		>	
			<view class="modify-modal-container">
				<view class="modify-modal-scroll">
					<webapp-cus-picker ref="modifyCusId" :cusId.sync="rowData.cusId"></webapp-cus-picker>
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">操作日期</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="rowData.opDate"
									placeholder="请选择操作日期" 
									:disableDefaultPadding="true" 
									inputAlign="center"
									border="bottom"
									readonly
								>
								</u--input>
							</view>
							<view>
								<u-icon name="arrow-right" color="#2979ff" size="15"></u-icon>
							</view>
						</view>
					</view>
					<view class="popup-filter-item margin20" @click="setDefaultType()">
						<view class="popup-filter-title">收款方式</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="rowData.shortName"
									placeholder="请选择收款方式" 
									:disableDefaultPadding="true" 
									inputAlign="center"
									border="bottom"
									readonly
								>
								</u--input>
							</view>
							<view>
								<u-icon name="arrow-right" color="#2979ff" size="15"></u-icon>
							</view>
						</view>
					</view>
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">生效日期</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="rowData.issueDate"
									placeholder="请选择生效日期" 
									:disableDefaultPadding="true" 
									inputAlign="center"
									border="bottom"
									readonly
								>
								</u--input>
							</view>
							<view>
								<u-icon name="arrow-right" color="#2979ff" size="15"></u-icon>
							</view>
						</view>
					</view>
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">收款金额</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="rowData.amount"
								placeholder="请输入收款金额" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								border="bottom"
								@blur="setFormatter()"
							>
							</u--input>
							<view>
								<u-icon name="arrow-right" color="#2979ff" size="15"></u-icon>
							</view>
						</view>
					</view>
					<u-alert
						type="primary" 
						:description="config.modify.alert.description"
						:center="true"
					>
					</u-alert>
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">收据编号</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="rowData.receiptNo"
								placeholder="请输入收据编号" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								border="bottom"
							>
							</u--input>
						</view>
					</view>
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">收款备注</view>
						<view class="popup-filter-content popup-filter-input">
							<u--textarea v-model="rowData.remark" placeholder="请输入备注" >
							</u--textarea>
						</view>
					</view>
				</view>
			</view>
		</u-modal>
		<!-- 收款调账方式 -->
		<u-picker 
			ref="payTypePicker"
			title="请选择收款方式"
			:showToolbar="true"
			:show="config.picker.show" 
			:columns="config.picker.column" 
			keyName="text"
			cancelText="取消"
			:immediateChange="true"
			@confirm="pickerConfirm"
			@cancel="config.picker.show=false"
		>
		</u-picker>
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from "@/components/webapp-popup-filter/webapp-popup-filter.vue"
	/* 自定义客户选择组件 */
	import WebappCusPicker from "@/components/webapp-cus-picker/webapp-cus-picker.vue"
	/* 自定义日期区间组件 */
	import WebappRangeDate from "@/components/webapp-range-date/webapp-range-date.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* 自定义方法 */
	import { digitToChi } from "@/utils/validate.js"
	/* api接口 */
	import { 
		getRecAdjustConfig, 
		fetchRecAdjustList, 
		doRecAdjustCheck,
		doRecAdjustDel,
		doRecAdjustModify
	} from "@/api/staff/customer.js"
	
	export default {
		components:{
			WebappPopupFilter,
			WebappCusPicker,
			WebappRangeDate
		},
		data() {
			return {
				/* 配置 */
				config: {
					/* 菜单配置 */
					menu: {
						options: {
							id: 'recAdjustMenu',
							name: '菜单',
							childs: [
								{
									id: '1',
									name: '筛选'
								}
							]
						}
					},
					/* 筛选配置 */
					filter: {
						show: false,
						/* 单选配置 */
						checkBox: {
							payType: [],
							dateType: [
								{
									text: '操作日期',
									value: 5,
								},
								{
									text: '生效日期',
									value: 4,
								}
							],
						}
					},
					/* 头部分段器 */
					subsection: {
						list: ['调账','收款'],
						current: 1,
					},
					/* 原始数据 */
					indexList: [],
					/* 操作界面 */
					action: {
						show: false
					},
					/* 删除理由弹窗 */
					del: {
						show: false
					},
					/* 修改弹窗 */
					modify: {
						show: false,
						/* 修改弹窗日期限制 */
						calendar: {
							defaultDate: null,
							minDate: null,
							maxDate: null
						},
						/* 收款金额大写 */
						alert: {
							description: null,
						},
					},
					/* 收款或者调账方式 */
					picker: {
						show: false,
						/* 当前显示 */
						columns: [
							/* 调账 */
							[],
							/* 收款 */
							[]
						],
						column: []
					}
				},
				/* 筛选条件 */
				formData: {
					//数据类型0->收款 1->调账
					dataType: 1,
					//客户
					cusId: null,
					//业务员关键词
					keyWord: null,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最大日期
					maxDate: null,
					//最小日期
					minDate: null,
					//日期区间
					rangeDate: [],
					//日期类型
					dateType: 5,
					//科目类型
					payType: '全部',
					//数据条数
					pageSize: null,
					//当前页面数
					pageNo: null,
				},
				/* 当前选中记录 */
				rowData: {
					index: null,
					//数据类型0->收款 1->调账
					dataType: 1,
					/* 客户 */
					cusId: null,
					/* 客户信息 */
					cusInfo: null,
					/* 操作日期 */
					opDate: null,
					/* 生效日期 */
					issueDate: null,
					/* 单号 */
					payId: null,
					/* 收款或者调账方式 */
					payTypeId: null,
					/* 收款或者调账方式中文 */
					shortName: null,
					/* 金额 */
					amount: null,
					/* 收据编号 */
					receiptNo: null,
					/* 需开票 */
					needInv: null,
					/* 删除原因 */
					delRemark: '',
				},
			}
		},
		onReady(){
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				this.formData = this.$options.data().formData
				this.config.filter = this.$options.data().config.filter
				this.config.menu = this.$options.data().config.menu
				this.formData.dataType = this.config.subsection.current
				const { result } = await getRecAdjustConfig()
				this.formData.beginDate = result.date.beginDate
				this.formData.endDate = result.date.endDate
				this.formData.minDate = result.date.minDate
				this.formData.maxDate = result.date.maxDate
				this.formData.rangeDate = JSON.parse(JSON.stringify(
					[this.formData.beginDate, this.formData.endDate]
				))
				this.config.filter.checkBox.payType = result.payType.all
				
				this.config.modify.calendar.defaultDate = result.date.defaultDate
				this.config.modify.calendar.minDate = result.date.defaultMinDate
				this.config.modify.calendar.maxDate = result.date.defaultMaxDate
				
				this.config.picker.columns[0] = result.payType.adjust
				this.config.picker.columns[1] = result.payType.coll
				
				this.config.picker.column = this.config.picker.columns[this.formData.dataType]
				
				if( this.authMap.operateAuth.includes("收款调账维护") ){
					this.config.menu.options.childs.push({
						id: '2',
						name: '添加'
					})
				}
				this.$refs.recAdjustList.reload()
			},
			/* 分段器变化 */
			async sectionChange(index){
				this.config.subsection.current = index
				this.formData.dataType = index
				/* 修改弹出中方式修改 */
				this.config.picker.column = this.config.picker.columns[this.formData.dataType]
				
				this.$refs.recAdjustList.reload()
			},
			/* 列表数据 */
			async queryList( pageNo, pageSize ){
				this.formData.pageNo = pageNo
				this.formData.pageSize = pageSize
				const { result } = await fetchRecAdjustList(this.formData)
				this.$refs.recAdjustList.complete(result)
			},
			/* 点击菜单按钮 */
			menuClick(e){
				if( e.id == '1' ){
					this.config.filter.show = true
				}
				if( e.id == '2' ){
					this.$refs.recAdjustMenu.closeMenu()
				}
			},
			/* 筛选弹出点击重置 */
			reset(){
				this.$refs.cusId.onClear()
				this.getParams()
			},
			/* 筛选弹出点击筛选 */
			search(){
				this.$refs.recAdjustList.reload()
			},
			/* 列表点击 */
			rowClick( row, index ){
				this.config.modify.alert = this.$options.data().config.modify.alert
				this.rowData = Object.assign(
					{}, 
					this.$options.data().rowData, 
					row, 
					{dataType: this.formData.dataType, index: index},
				)
				this.config.modify.alert.description = digitToChi(this.rowData.amount)
			},
			/* 审核或者取消审核 */
			async doCheck(item, index){
				await this.rowClick(item, index)
				const { result } = await doRecAdjustCheck(this.rowData)
				await this.$set(
					this.config.indexList[this.rowData.index], 
					'checked', 
					this.rowData.checked==1?0:1
				)
				this.toastSuccess(this.rowData.checked==0?'审核成功':'取消审核成功')
			},
			/* 删除 */
			async doDel(){
				const { result } = await doRecAdjustDel(this.rowData)
				this.config.del.show = false
				this.toastSuccess('删除成功')
				this.$refs.recAdjustList.reload()
			},
			/* 收款或者调账科目确认 */
			pickerConfirm(e){
				this.rowData.payTypeId = e.value[0].id
				this.rowData.shortName = e.value[0].value
				this.config.picker.show = false
			},
			/* 修改 */
			async doModify(){
				const { result } = await doRecAdjustModify(this.rowData)
				this.config.modify.show = false
				await this.fetchRowData()
				this.toastSuccess('修改成功')
				//this.$refs.recAdjustList.reload()
			},
			/* 修改后更新数据 */
			async fetchRowData(){
				const { result } = await fetchRecAdjustList({
					cusId: this.rowData.cusId, 
					payId: this.rowData.payId,
					pageSize: 1,
					pageNo: 1
				})
				this.config.indexList.splice(this.rowData.index, 1, result[0])
			},
			/* 修改弹窗金额中文提示 */
			setFormatter(){
				var chi = digitToChi(this.rowData.amount)
				let _this = this
				this.$refs.uToast.show({
					type: 'success',
					message: chi,
					position: 'top',
					duration: 2000,
					complete: ()=>{
						_this.config.modify.alert.description = chi
					}
				})
			},
			/* 设置默认列 */
			setDefaultType(){
				/* 设置科目选中项 */
				for( var i=0;i<this.config.picker.columns[this.formData.dataType][0].length;i++ ){
					if( this.config.picker.columns[this.formData.dataType][0][i].value==this.rowData.shortName ){
						this.$refs.payTypePicker.setIndexs([i], true)
						break
					}
				}
				this.config.picker.show = true
			},
			/* 成功提示 */
			toastSuccess( message ){
				let _this = this
				this.$refs.uToast.show({
					type: 'success',
					message: message,
					complete: ()=>{
						_this.rowData = _this.$options.data().rowData
					}
				})
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight",
				authMap: "user/authMap", 
			}),
			/* 监听是否有弹窗打开 */
			showMenu(){
				return !this.config.filter.show  && !this.config.del.show && !this.config.modify.show
			}
		},
		watch: {
			showMenu( newV, oldV ){
				if( !newV ){
					//关闭菜单
					this.$refs.recAdjustMenu.closeMenu()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
	@import "@/static/css/card.scss";
	::v-deep .u-modal__content {
		background: #f1f1f1;
	}
	.modify-modal-container {
		display: flex;
		align-items: center;
		flex-direction:column;
		justify-content: space-between;
		background: #f1f1f1;
		overflow-x: hidden;
	}
	
	.modify-modal-scroll {
		height: 760rpx;
		overflow-y: scroll;
		overscroll-behavior-y: contain !important;
	}
</style>