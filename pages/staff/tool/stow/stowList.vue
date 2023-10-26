<!-- 扫描装货列表 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+(showMenu?'hidden':'visible')"></page-meta>
	<view>
		<!-- 菜单按钮 -->
		<liu-rotating-menu 
			ref="stowMenu"
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
			<!-- 日期区间 -->
			<webapp-range-date 
				:beginDate.sync="formData.beginDate"
				:endDate.sync="formData.endDate"
				:maxDate.sync="formData.maxDate"
				:minDate.sync="formData.minDate"
				:rangeDate.sync="formData.rangeDate"
			/>
			<!-- 装货单状态 -->
			<view class="popup-filter-item margin20">
				<view class="popup-filter-title">货单状态</view>
				<view class="popup-filter-content popup-filter-input">
					<uni-data-checkbox
						mode="tag"
						multiple
						v-model="formData.carState" 
						:localdata="config.filter.carState">
					</uni-data-checkbox>
				</view>
			</view>
		</webapp-popup-filter>
		<!-- 数据列表 -->
		<z-paging
			ref="stowList" 
			v-model="config.indexList" 
			:auto-show-system-loading="true"
			:auto="false"
			@query="queryList"
		>
			<uni-card
				v-for="(item, index) in config.indexList" 
				:key="index"
				:title="item.pListNo" 
				:extra="item.orderTypeName"
				:is-shadow="true"
			>
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>当前状态:
							<text :class="[
								'mg-left-20', 
								item.carState==0?'red-color':item.carState==1?'blue-color':'green-color'
							]">
								{{ item.carState==0?'装货中':item.carState==1?'已准备':'已回签' }}
							</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>货单类型:
							<text class="mg-left-20">{{ item.orderTypeName }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>装货体积:
							<text class="mg-left-20">{{ item.tVolume }}(m³)</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>折5面积:
							<text class="mg-left-20">{{ item.to5Area }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>拼车客户:
							<text class="mg-left-20">{{ item.cusNames }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>备注信息:
							<text class="mg-left-20">{{ item.remark }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<view class="card-body-txt">车辆信息</view>:
						<view class="card-body-txt mg-left-20">{{ item.carNo }}</view>
						<view class="card-body-txt mg-left-20">{{ item.carPName }}</view>
					</view>
				</view>
				<view slot="actions" class="card-actions">
					<template v-if="item.carState==0">
						<view class="card-actions-item" @click="doCheck(item, index)">
							<u-icon name="car-fill" color="#fa3534" size="18"></u-icon>
							<text class="card-actions-item-text">准备</text>
						</view>
					</template>
					<template v-if="item.carState==1">
						<view class="card-actions-item" @click="doCheck(item, index)">
							<u-icon name="car" color="#ff9900" size="18"></u-icon>
							<text class="card-actions-item-text">取消准备</text>
						</view>
					</template>
					<template v-if="item.carState==0">
						<view class="card-actions-item" @click="doModify(item, index)">
							<u-icon name="edit-pen" color="#19be6b" size="18"></u-icon>
							<text class="card-actions-item-text">修改</text>
						</view>
					</template>
					<template>
						<view class="card-actions-item" @click="fetchDetail(item)">
							<u-icon name="list" color="#303133" size="18"></u-icon>
							<text class="card-actions-item-text">明细</text>
						</view>
					</template>
				</view>
			</uni-card>
		</z-paging>
		<!-- 新增弹窗 -->
		<u-modal
			:show="config.add.show"
			width="690rpx"
			:showCancelButton="true"
			@cancel="config.add.show=false"
			@confirm="addConfirm()"
		>
			<view class="modify-modal-container">
				<view class="add-modal-scroll">
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">类型选择</view>
						<view class="popup-filter-content popup-filter-input">
							<uni-data-checkbox
								mode="tag"
								v-model="addData.strOrderId" 
								:localdata="config.checkBox.strOrderId"
							>
							</uni-data-checkbox>
						</view>
					</view>
					<view class="popup-filter-item margin20" @click="config.calendar.show=true">
						<view class="popup-filter-title">装货日期</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="addData.packDate"
									placeholder="请选择装货日期" 
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
					
					<view class="popup-filter-item margin20" @click="setPicker(0)">
						<view class="popup-filter-title">车牌编号</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="addData.strCarCode"
									placeholder="请选择车牌编号" 
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
					
					<view class="popup-filter-item margin20" @click="setPicker(1)">
						<view class="popup-filter-title">司机编号</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="addData.strCarPId"
									placeholder="请选择司机编号" 
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
						<view class="popup-filter-title">装货人员</view>
						<view class="popup-filter-content popup-filter-input">
							<uni-data-checkbox
								mode="tag"
								multiple
								v-model="addData.strPackPerson" 
								:localdata="config.checkBox.strPackPerson"
							>
							</uni-data-checkbox>
						</view>
					</view>
					
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">装货备注</view>
						<view class="popup-filter-content popup-filter-input">
							<u--textarea v-model="addData.strRemark" placeholder="请输入备注" >
							</u--textarea>
						</view>
					</view>
					
					<view class="popup-filter-item margin20">
						<view class="popup-filter-title">车资金额</view>
						<view class="popup-filter-content popup-filter-input">
							<u--input
								v-model="addData.dChargeAdjust"
								placeholder="请输入车资" 
								:disableDefaultPadding="true" 
								inputAlign="center"
								border="bottom"
							>
							</u--input>
						</view>
					</view>
					
					<view class="popup-filter-item margin20" @click="setPicker(2)">
						<view class="popup-filter-title">发货人员</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="addData.strAPPerson"
									placeholder="请选择发货人员" 
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
					
					
				</view>
			</view>
		</u-modal>
		<!-- 修改弹窗 -->
		<u-modal
			:show="config.modify.show"
			width="690rpx"
			:showCancelButton="true"
			:asyncClose="true"
			@cancel="config.modify.show=false"
			@confirm="updateStow()"
		>
			<view class="modify-modal-container">
				<view class="modify-modal-scroll">
					<view class="popup-filter-item margin20" @click="setPicker(0)">
						<view class="popup-filter-title">车牌编号</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="modifyData.carCode"
									placeholder="请选择车牌编号" 
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
					<view class="popup-filter-item margin20" @click="setPicker(1)">
						<view class="popup-filter-title">司机编号</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="modifyData.carPId"
									placeholder="请选择司机编号" 
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
						<view class="popup-filter-title">装货备注</view>
						<view class="popup-filter-content popup-filter-input">
							<u--textarea v-model="modifyData.remark" placeholder="请输入备注" >
							</u--textarea>
						</view>
					</view>
					<view class="popup-filter-item margin20" @click="setPicker(2)">
						<view class="popup-filter-title">发货人员</view>
						<view class="popup-filter-content popup-filter-input">
							<view>
								<u--input
									v-model="modifyData.apPerson"
									placeholder="请选择发货人员" 
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
				</view>
			</view>
		</u-modal>
		<!-- 单选弹窗 -->
		<u-picker 
			ref="upicker" 
			:show="config.picker.show"
			title="请选择"
			:showToolbar="true"
			cancelText="取消"
			:immediateChange="true"
			:columns="config.picker.columns" 
			:loading="config.picker.loading"
			:defaultIndex="config.picker.defaultIndex"
			@confirm="pickerConfirm"
			@cancel="config.picker.show=false"
		>
		</u-picker>
		<!-- 装货日期选择 -->
		<u-calendar 
			title="装货日期"
			:showTitle="false"
			:closeOnClickOverlay="false" 
			:show="config.calendar.show"
			:minDate="addData.packMinDate"
			:maxDate="addData.packMaxDate"
			:defaultDate="addData.packRangeDate"
			:monthNum="6"
			@confirm="calendarConfirm"
			@close="config.calendar.show=false"
		></u-calendar>
		<!-- 表单验证 -->
		<u-notify ref="uNotify"></u-notify>
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	/* 自定义筛选组件 */
	import WebappPopupFilter from "@/components/webapp-popup-filter/webapp-popup-filter.vue"
	/* 自定义日期区间组件 */
	import WebappRangeDate from "@/components/webapp-range-date/webapp-range-date.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* 表单验证 */
	import schema from "async-validator"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { fetchStowList, getOperateStowInfo, updateStow } from "@/api/staff/tool.js"
	export default {
		components:{
			WebappPopupFilter,
			WebappRangeDate
		},
		data() {
			return {
				/* 配置 */
				config: {
					/* 筛选弹窗配置 */
					filter: {
						show: false,
						/* 装货单状态 */
						carState: [
							{
								text: '已准备',
								value: 0,
							},
							{
								text: '已回签',
								value: 1,
							}
						]
					},
					/* 菜单按钮配置 */
					menu: {
						options: {
							id: 'stowList',
							name: '菜单',
							childs: [
								{
									id: '1',
									name: '筛选'
								},
								{
									id: '2',
									name: '新增'
								}
							]
						}
					},
					/* 选择配置 */
					checkBox: {
						//选择订单类型
						strOrderId: [
							{
								text: '纸板',
								value: 'b',
							},
							{
								text: '纸箱',
								value: 'x',
							},
							{
								text: '混合',
								value: 'a',
							}
						],
						//选择装货人员
						strPackPerson: []
					},
					/* 单选弹窗 */
					picker: {
						show: false,
						/* 加载状态 */
						loading: false,
						/* 选择弹窗类型 0->车牌编号 1->司机编号 2->发货人员 */
						type: 0,
						/* 默认值 */
						defaultIndex: [0],
						/* 绑定列 */
						columns: [],
						/* 车辆编号 */
						strCarCode: [],
						/* 司机编号 */
						strCarPId: [],
						/* 发货人员 */
						strAPPerson: [],
					},
					/* 装货日期选择 */
					calendar: {
						show: false,
					},
					/* 新增弹窗配置 */
					add: {
						show: false,
						/* 新增参数检验 */
						rules: {
							strFactoryId: [{
								require: true, 
								message: "缺少必要参数"
							}],
							strUserId: [{
								require: true,
								message: "缺少必要参数"
							}],
							strOrderId: [{
								require: true,
								message: "请选择类型"
							}],
							packDate: [{
								require: true,
								message: "请选择装货日期"
							}],
							strCarCode: [{
								require: true,
								message: "请选择车辆编号"
							}],
							strCarPId: [{
								require: true,
								message: "请选择司机编号"
							}],
							strPackPerson: [{
								require: true,
								message: "请选择装货人员"
							}],
							strAPPerson: [{
								require: true,
								message: "请选择发货人员"
							}],
						}	
					},
					/* 修改弹窗配置 */
					modify: {
						show: false,
					},
					/* 列表数据 */
					indexList: [],
				},
				/* 筛选条件 */
				formData: {
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
					//装货单状态
					carState: [],
					//分页信息
					pageNo: 1,
					pageSize: 10,
				},
				/* 新增或者修改 */
				addData: {
					//厂商ID
					strFactoryId: null,
					//新增人员ID
					strUserId: null,
					//订单类型 b纸板x纸箱a混合
					strOrderId: 'b',
					//必要参数
					strPCarType: '',
					strPCarArea: '',
					//装货日期
					packDate: null,
					//车牌编号
					strCarCode: null,
					//司机编号
					strCarPId: null,
					//装货人员
					strPackPerson: [],
					//装货备注
					strRemark: '',
					//必要参数
					strTransFeeId: '',
					//车资金额
					dChargeAdjust: 0,
					//发货人员
					strAPPerson: null,
					//必要参数
					iPCarANum: 0,
					//新增弹窗默认日期
					packDate: null,
					//新增弹窗最大日期
					packMaxDate: null,
					//新增弹窗最小日期
					packMinDate: null,
					//新增弹窗日期区间
					packRangeDate: [],
				},
				/* 修改数据 */
				modifyData: {
					//车牌编号
					carCode: null,
					//司机编号
					carPId: null,
					//装货备注
					remark: '',
					//发货人员
					apPerson: null,
					//装货单类型
					orderType: null,
					//装货单号
					pListNo: null,
				}
			}
		},
		onReady(){
			this.getParams()
		},
		mounted() {
			this.addValidate = new schema(this.config.add.rules)
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'stowList' } )
				this.formData.beginDate = result.beginDate
				this.formData.endDate = result.endDate
				this.formData.minDate = result.minDate
				this.formData.maxDate = result.maxDate
				this.formData.rangeDate = JSON.parse(
					JSON.stringify([this.formData.beginDate, this.formData.endDate])
				)
				this.addData.packDate = result.packDate
				this.addData.packMaxDate = result.packMaxDate
				this.addData.packMinDate = result.packMinDate
				this.addData.packRangeDate = JSON.parse(
					JSON.stringify([this.addData.packMinDate, this.addData.packMaxDate])
				)
				this.$refs.stowList.reload()
			},
			/* 点击菜单按钮 */
			async menuClick(e){
				if( e.id == '1' ){
					this.config.filter.show = true
				}
				if( e.id == '2' ){
					/* 新增逻辑 */
					if( !this.addData.strFactoryId ){
						await this.getAddModifyInfo()
					}
					this.config.add.show = true
				}
			},
			/* 获取新增或者修改参数 */
			async getAddModifyInfo(){
				const { result } = await getOperateStowInfo()
				this.config.checkBox.strPackPerson = result.strPackPerson
				this.config.picker.strCarCode = result.strCarCode
				this.config.picker.strAPPerson = result.strAPPerson
				this.config.picker.strCarPId = result.strCarPId
			},
			/* 设置对应的picker */
			async setPicker( type ){
				this.config.picker.loading = true
				this.config.picker.type = type
				if( type == 0 ){
					this.config.picker.columns = [this.config.picker.strCarCode]
				}
				if( type == 1 ){
					this.config.picker.columns = [this.config.picker.strCarPId]
				}
				if( type == 2 ){
					this.config.picker.columns = [this.config.picker.strAPPerson]
				}
				this.config.picker.show = true
				setTimeout(()=>{
					this.config.picker.loading = false
				}, 800)
			},
			/* picker确认 */
			pickerConfirm(e){
				if( this.config.picker.type == 0 ){
					this.addData.strCarCode = e.value[0].value
				}
				if( this.config.picker.type == 1 ){
					this.addData.strCarPId = e.value[0].value
				}
				if( this.config.picker.type == 2 ){
					this.addData.strAPPerson = e.value[0].value
				}
				this.config.picker.show = false
			},
			/* 日历选择确认 */
			calendarConfirm(e){
				var dateList = JSON.parse(JSON.stringify(e))
				this.addData.packDate = dateList[0]
				this.config.calendar.show = false
			},
			/* 模拟上拉加载下拉刷新 */
			async queryList( pageNo, pageSize ){
				this.formData.pageNo = pageNo
				this.formData.pageSize = pageSize
				const { result } = await fetchStowList( this.formData )
				this.$refs.stowList.complete(result)
			},
			/* 筛选弹出点击筛选 */
			search(){
				this.$refs.stowList.reload()
			},
			/* 筛选弹出点击重置 */
			async reset(){
				await this.getParams()
			},
			/* 明细点击 */
			fetchDetail( rowData ){
				uni.navigateTo({
					url: '/pages/staff/tool/stow/detailList?filterInfo='
						+ encodeURIComponent(JSON.stringify(rowData))
				})
			},
			/* 新增弹窗确认 */
			addConfirm(){
				this.addValidate.validate(this.addData).then(()=>{
					this.addStow()
				}).catch(({ errors, fields })=>{
					this.$refs.uNotify.show({
						type: "error",
						message: errors[0].message,
						duration: 1000 * 3
					})
				})
			},
			/* 新增装货单 */
			addStow(){
				
			},
			/* 点击修改 */
			async doModify( rowData ){
				if( !this.addData.strFactoryId ){
					await this.getAddModifyInfo()
				}
				Object.assign(this.modifyData, rowData)
				this.config.modify.show = true
			},
			/* 更新装货单 */
			async updateStow(){
				const { result } = await updateStow(this.modifyData)
				this.config.modify.show = false
				this.toastSuccess('修改成功', 'modify')
				this.$refs.stowList.reload()
			},
			/* 成功提示 */
			toastSuccess( message, type ){
				let _this = this
				this.$refs.uToast.show({
					type: 'success',
					message: message,
					complete: ()=>{
						if( type == 'modify' ){
							_this.modifyData = _this.$options.data().modifyData
						}
						if( type == 'add' ){
							_this.addData = _this.$options.data().addData
						}
					}
				})
			}
		},
		computed: {
			/* 监听是否有弹窗打开 */
			showMenu(){
				return !this.config.add.show && !this.config.filter.show && !this.config.modify.show
			},
		},
		watch: {
			showMenu( newV, oldV ){
				if( !newV ){
					//关闭菜单
					this.$refs.stowMenu.closeMenu()
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
	
	.add-modal-scroll {
		height: 760rpx;
		overflow-y: scroll;
		overscroll-behavior-y: contain !important;
	}
	
	.modify-modal-scroll {
		height: 560rpx;
		overflow-y: scroll;
		overscroll-behavior-y: contain !important;
	}
</style>