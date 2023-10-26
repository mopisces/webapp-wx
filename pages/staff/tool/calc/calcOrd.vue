<!-- 订单试算 -->
<template>
	<!-- 防止滑动穿透 -->
	<page-meta :page-style="'overflow:'+( showMenu ?'hidden':'visible')"></page-meta>
	<view>
		<!-- 计算按钮 -->
		<liu-drag-button 
			v-show=" showMenu "
			:bottomPx="pageHeight*0.8"
			@clickBtn="doCalc"
		>
			<text>计算</text>
		</liu-drag-button>
		<!-- 头部分段器 -->
		<u-subsection 
			:list="config.subsection.list" 
			:current="formData.current"
			@change="sectionChange"
		>
		</u-subsection>
		<!-- 表单 -->
		<view class="form-container">
			<u--form 
				ref="calcOrd" 
				labelPosition="left" 
				:model="formData" 
				:rules="config.rules"
				labelWidth="auto"
				:labelStyle="{paddingLeft: '20rpx', paddingRight: '20rpx'}"
			>
				<u-form-item 
					prop="formData.cusId"
					label="客户名称" 
					borderBottom 
					required
					@click="hideKeyboard()"
				>
					<song-data-picker
						v-model="formData.cusId"
					    :localdata="config.picker.columns.cusId"
					    :openSearch="true"
						:searchFn="searchCus"
					></song-data-picker>
				</u-form-item>
				<u-form-item
					prop="boardId"
					label="材质信息" 
					borderBottom 
					required
					@click="hideKeyboard()"
				>
					<song-data-picker
						v-model="formData.boardId"
						:localdata="config.picker.columns.boardId"
						:openSearch="true"
						:searchFn="searchBoardId"
					></song-data-picker>
				</u-form-item>
				<u-form-item
					prop="bAddInfo"
					label="其他信息" 
					borderBottom 
					required
					class="form-item-padding"
				>
					<uni-data-checkbox
						mode="tag"
						v-model="formData.bAddInfo" 
						:localdata="config.checkBox.bAddInfo"
					>
					</uni-data-checkbox>
				</u-form-item>
				<u-form-item
					prop="edgeType"
					label="纸板状态" 
					borderBottom 
					required
					class="form-item-padding"
				>
					<uni-data-checkbox
						mode="tag"
						v-model="formData.edgeType" 
						:localdata="config.checkBox.edgeType"
					>
					</uni-data-checkbox>
				</u-form-item>
				<template v-if="formData.current==0">
					<u-form-item
						label="规格信息" 
						borderBottom 
						required
					>
						<view class="form-item-container">
							<u--input
								v-model="formData.bdL"
								disabledColor="#ffffff"
								placeholder="板长"
								:placeholderStyle="{color: 'red'}"
								type="number"
								inputAlign="center"
							>
							</u--input>
							<view>×</view>
							<u--input
								v-model="formData.bdW"
								disabledColor="#ffffff"
								placeholder="宽"
								:placeholderStyle="{color: 'red'}"
								type="number"
								inputAlign="center"
							>
							</u--input>
						</view>
						<view slot="right">mm</view>
					</u-form-item>
					<u-form-item
						label="压线信息" 
						borderBottom 
						required
					>	
						<view class="form-item-container">
							<u--input
								v-model="formData.scoreL"
								disabledColor="#ffffff"
								placeholder="压线1"
								:placeholderStyle="{color: 'red'}"
								type="number"
								inputAlign="center"
							>
							</u--input>
							<view>＋</view>
							<u--input
								v-model="formData.scoreW"
								disabledColor="#ffffff"
								placeholder="压线2"
								:placeholderStyle="{color: 'red'}"
								type="number"
								inputAlign="center"
							>
							</u--input>
							<view>＋</view>
							<u--input
								v-model="formData.scoreH"
								disabledColor="#ffffff"
								placeholder="压线3"
								:placeholderStyle="{color: 'red'}"
								type="number"
								inputAlign="center"
							>
							</u--input>
						</view>
						<view slot="right">mm</view>
					</u-form-item>
				</template>
				<template v-else>
					<u-form-item
						prop="boxId"
						label="箱型信息" 
						borderBottom 
						required
						@click="hideKeyboard()"
					>
						<song-data-picker
							v-model="formData.boxId"
							:localdata="config.picker.columns.boxId"
							:openSearch="true"
							:searchFn="searchBoxId"
						></song-data-picker>
					</u-form-item>
					<u-form-item
						label="规格信息" 
						borderBottom 
						required
					>
						<view class="form-item-container">
							<u--input
								v-model="formData.boxL"
								disabledColor="#ffffff"
								placeholder="箱长"
								:placeholderStyle="{color: 'red'}"
								type="number"
								inputAlign="center"
							>
							</u--input>
							<view>×</view>
							<u--input
								v-model="formData.boxW"
								disabledColor="#ffffff"
								placeholder="箱宽"
								:placeholderStyle="{color: 'red'}"
								type="number"
								inputAlign="center"
							>
							</u--input>
							<view>×</view>
							<u--input
								v-model="formData.boxH"
								disabledColor="#ffffff"
								placeholder="箱高"
								:placeholderStyle="{color: 'red'}"
								type="number"
								inputAlign="center"
							>
							</u--input>
						</view>
						<view slot="right">mm</view>
					</u-form-item>
					<u-form-item
						prop="tLen"
						label="箱舌长度" 
						borderBottom 
						required
					>
						<u--input
							v-model="formData.tLen"
							disabledColor="#ffffff"
							placeholder="请输入箱舌"
							:placeholderStyle="{color: 'red'}"
							type="number"
							inputAlign="center"
						>
						</u--input>
						<view slot="right">mm</view>
					</u-form-item>
					<u-form-item
						prop="uLen"
						label="封箱调整" 
						borderBottom 
						required
					>
						<u--input
							v-model="formData.uLen"
							disabledColor="#ffffff"
							placeholder="请输入封箱调整"
							:placeholderStyle="{color: 'red'}"
							type="number"
							inputAlign="center"
						>
						</u--input>
						<view slot="right">mm</view>
					</u-form-item>
				</template>
				<u-form-item
					prop="ordQty"
					label="订单数量" 
					borderBottom 
					required
				>
					<u--input
						v-model="formData.ordQty"
						disabledColor="#ffffff"
						placeholder="请输入订单数量"
						:placeholderStyle="{color: 'red'}"
						type="number"
						inputAlign="center"
					>
					</u--input>
				</u-form-item>
			</u--form>
		</view>
		<!-- 试算结果 -->
		<u-popup
			:show="config.popup.show" 
			:round="10"
			:safeAreaInsetBottom="false" 
			:zoom="false"
			:customStyle="{width:'750rpx'}" 
			:overlayStyle="{background:'rgba(3, 100, 219, 0.5)', touchAction:'none'}"
			mode="center" 
			@close="resClose" 
		>
			<uni-card :is-shadow="true">
				<view class="card-body-container">
					<view class="card-body-item card-body-item-100">
						<text>销售面积: 
							<text class="mg-left-20">{{ calcRes.dSalesArea }}㎡</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>折扣信息: 
							<text class="mg-left-20">{{ calcRes.dDisRate }}</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>价格信息: 
							<text class="mg-left-20">{{ calcRes.dOriPrice }}元/㎡</text>
							<text class="mg-left-20">{{ calcRes.dUnitPrice }}元/片</text>
							<text class="mg-left-20">{{ calcRes.dSquarePrice }}元/㎡</text>
						</text>
					</view>
					<view class="card-body-item card-body-item-100">
						<text>金额信息: 
							<text class="mg-left-20">{{ calcRes.dAmt }}元</text>
						</text>
					</view>
					<template v-if="formData.current==1">
						<view class="card-body-item card-body-item-100">
							<text>尺寸信息: 
								<text class="mg-left-20">{{ calcRes.iLength }}×{{ calcRes.iWidth }}(mm)</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>压线信息: 
								<text class="mg-left-20">{{ calcRes.strScoreInfo }}</text>
							</text>
						</view>
					</template>
				</view>
			</uni-card>
		</u-popup>
		<!-- 提示信息 -->
		<u-toast ref="uToast"></u-toast>
		<!-- 表单验证 -->
		<u-notify ref="uNotify"></u-notify>
	</view>
</template>

<script>
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { getTonLenAndULen, getTrimAndArea, fetchCalcOrdList } from "@/api/staff/tool.js"
	
	export default {
		data() {
			return {
				/* 配置 */
				config: {
					/* 分段器配置 */
					subsection: {
						list: ['简单纸板', '纸箱纸板']
					},
					/* 表单验证规则 */
					rules: {
						/* 纸板试算 */
						bd: {
							/* 客户 */
							'formData.cusId': {
								type: 'string',
								require: true, 
								message: "请选择客户",
								trigger: ['change', 'blur']
							},
							/* 材质 */
							boardId: {
								type: 'string',
								require: true,
								message: "请选择材质",
								trigger: ['change', 'blur']
							},
							/* 板长 */
							bdL: {
								type: 'number',
								required: true,
								message: '请填写板长',
								trigger: ['blur']
							},
							/* 板宽 */
							bdW: {
								type: 'number',
								required: true,
								message: '请填写板宽',
								trigger: ['blur']
							},
							/* 压线信息 */
							scoreL: {
								type: 'number',
								required: true,
								message: '请填写压线信息1',
								trigger: ['blur']
							},
							scoreW: {
								type: 'number',
								required: true,
								message: '请填写压线信息2',
								trigger: ['blur']
							},
							scoreH: {
								type: 'number',
								required: true,
								message: '请填写压线信息3',
								trigger: ['blur']
							}
						},
						/* 纸箱试算 */
						box: {
							/* 客户 */
							'formData.cusId': {
								type: 'string',
								require: true, 
								message: "请选择客户",
								trigger: ['change', 'blur']
							},
							/* 材质 */
							boardId: {
								type: 'string',
								require: true,
								message: "请选择材质",
								trigger: ['change', 'blur']
							},
							/* 箱型信息 */
							boxId: {
								type: 'string',
								require: true,
								message: "请选择箱型",
								trigger: ['change', 'blur']
							},
							/* 箱长 */
							boxL: {
								type: 'number',
								require: true,
								message: "请填写箱长",
								trigger: ['blur']
							},
							/* 箱宽 */
							boxW: {
								type: 'number',
								require: true,
								message: "请填写箱宽",
								trigger: ['blur']
							},
							/* 箱高 */
							boxH: {
								type: 'number',
								require: true,
								message: "请填写箱高",
								trigger: ['blur']
							}
						}
					},
					/* 单选配置 */
					checkBox: {
						/* 修边|加面积 */
						bAddInfo: [
							{
								text: '加修编',
								value: 0
							},
							{
								text: '加面积',
								value: 1
							},
							{
								text: '都不加',
								value: 2
							}
						],
						/* 纸板状态 */
						edgeType: [
							{
								text: '毛片',
								value: 0
							},
							{
								text: '净片',
								value: 1
							}
						]
					},
					/* 试算结果弹窗 */
					popup: {
						show: false,
					},
					/* 单选弹窗 */
					picker: {
						show: false,
						/* 绑定列 */
						columns: {
							cusId: [],
							boardId: [],
							boxId: []
						},
						/* 加载状态 */
						loading: false,
						/* 单选信息 */
						formData: {
							/* 单选框类型 0->客户选择 1->材质 2->箱型 100->全部*/
							dataType: 100,
							/* 搜索关键词 */
							keyWord: null,
						},
					},
					/* 是否自动获取平方报价 */
					autoPrice: 0,
					/* 是否自动获取箱舌和封箱调整 */
					autoTULen: 0,
					/* 是否自动获取修边和加面积 */
					autoTrimArea: 0
				},
				/* 筛选条件 */
				formData: {
					/* 分段器 */
					current: 1,
					/* 客户 */
					cusId: null,
					/* 材质 */
					boardId: null,
					/* 修边、加面积 */
					bAddInfo: 2,
					/* 毛片或者净片 */
					edgeType: 1,
					/* 纸板--板长 */
					bdL: null,
					/* 纸板--板宽 */
					bdW: null,
					/* 纸板-压线信息 */
					scoreL: null,
					scoreW: null,
					scoreH: null,
					/* 箱型 */
					boxId: null,
					/* 纸箱--箱长 */
					boxL: null,
					/* 纸箱--箱宽 */
					boxW: null,
					/* 纸箱--箱高 */
					boxH: null,
					/* 箱舌 */
					tLen: null,
					/* 封箱调整 */
					uLen: null,
					/* 订单数量 */
					ordQty: 0,
				},
				/* 计算结果 */
				calcRes: {
					/* 销售面积 */
					dSalesArea: 0,
					/* 折扣 */
					dDisRate: 0,
					/* 平方报价 */
					dOriPrice: 0,
					/* 片价 */
					dUnitPrice: 0,
					/* 平方价 */
					dSquarePrice: 0,
					/* 金额 */
					dAmt: 0,
					/* 板长 */
					iLength: 0,
					/* 板宽 */
					iWidth: 0,
					/* 压线 */
					strScoreInfo: ''
				},
				/* 搜索关键词 */
				keyWord: {
					cusId: null,
				}
			}
		},
		onReady() {
			this.$refs.calcOrd.setRules(this.config.rules.box)
		},
		async mounted() {
			await this.getParams()
			const { result } = await fetchCalcOrdList(this.config.picker.formData)
			this.config.picker.columns = result
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'calcOrd' } )
				this.config.autoPrice = result.autoPrice
				this.config.autoTULen = result.autoTULen
				this.config.autoTrimArea = result.autoTrimArea
			},
			/* 客户查询 */
			async searchCus(searchList, searchWord, callback){
				this.config.picker.formData.dataType = 0
				const { result } = await fetchCalcOrdList(this.config.picker.formData)
				return result
			},
			/* 材质搜索 */
			async searchBoardId(searchList, searchWord, callback){
				this.config.picker.formData.dataType = 1
				const { result } = await fetchCalcOrdList(this.config.picker.formData)
				return result
			},
			/* 箱型搜索 */
			async searchBoxId(){
				this.config.picker.formData.dataType = 2
				const { result } = await fetchCalcOrdList(this.config.picker.formData)
				return result
			},
			/* 单选框确认 */
			pickerConfirm(e){
				if( this.config.picker.formData.dataType == 0 )
					this.formData.cusId = e.value[0].value
				if( this.config.picker.formData.dataType == 1 )
					this.formData.boardId = e.value[0].value
				if( this.config.picker.formData.dataType == 2 )
					this.formData.boxId = e.value[0].value
			},
			/* 分段器改变 */
			async sectionChange(idx){
				this.formData.current = idx
				if( idx == 1 ){
					await this.$refs.calcOrd.setRules(this.config.rules.box)
				} else {
					await this.$refs.calcOrd.setRules(this.config.rules.bd)
				}
			},
			/* 收起输入键盘 */
			hideKeyboard() {
				uni.hideKeyboard()
			},
			/* 订单试算按钮 */
			doCalc(){
				this.config.popup.show = true
			},
			/* 订单试算弹窗关闭 */
			resClose(){
				this.config.popup.show = false
			},
			/* 获取客户默认修边和面积 */
			async queryTrimAndArea(){
				this.formData.bAddInfo = this.$options.data().formData.bAddInfo
				const { result } = await getTrimAndArea( this.formData )
				this.formData.bAddInfo = result.addTrim == 1 ? 0: 1
			},
			/* 纸箱--自动获取箱舌及封箱调整 */
			async queryTonLenAndULen( IsContinueCallCalBdQuotaInfo = false ){
				console.log(this.config.autoTULen && this.formData.current == 1)
				if( this.config.autoTULen && this.formData.current == 1 ){
					if( this.checkCusBd() ){
						const { result } = await getTonLenAndULen(this.formData)
						this.formData.uLen = result.uLen
						this.formData.tLen = result.tLen
						await this.calBdQuotaInfo()
					}
				} else {
					if( IsContinueCallCalBdQuotaInfo ){
						await this.calBdQuotaInfo()
					}
				}
			},
			/* 获取平方报价 */
			calBdQuotaInfo(){
				if( this.config.autoPrice ){
					if( this.checkCusBd() ){
						/* 获取平方报价 */
					}
				}
			},
			/* 检查客户和材质知否存在 */
			checkCusBd(){
				return !uni.$u.test.isEmpty(this.formData.cusId)&&!uni.$u.test.isEmpty(this.formData.boardId)
			},
			/* 订单试算 */
			doCalc(){
				
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight",
			}),
			/* 是否有弹窗 */
			showMenu(){
				return !this.config.popup.show
			},
			/* 监听cusId是否变化 */
			cusIdChange(){
				return this.formData.cusId
			},
			
		},
		watch: {
			/* cusId变化后触发 */
			async cusIdChange( newV, oldV ){
				let cusId = newV || ''
				if( cusId.length == 0 ){	
					this.formData.bAddInfo = 2
					this.formData.edgeType = 1
				} else {
					if( this.config.autoTrimArea == 1 ){
						await this.queryTrimAndArea()
					}
				}
				await this.queryTonLenAndULen()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/card.scss";
	
	.form-container {
		background-color: #fff;
	}
	.form-item-padding {
		padding: 0;
	}
	.form-item-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.form-item-switch {
		transform: scale(0.7);
	}
</style>