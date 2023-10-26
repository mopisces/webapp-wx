<!-- 原纸入库 -->
<template>
	<view class="page-form">
		<!-- 表单 -->
		<u--form
			ref="stockIn"
			labelPosition="left"
			:model="formData"
			:rules="config.form.rules"
			labelWidth="100"
		>
			<u-form-item
				label="条形码编号"
				prop="stockNo"
				borderBottom
			>
				<u--input
					v-model="formData.stockNo"
					border="none"
					:maxlength="12"
					:clearable="true"
					placeholder="请输入单号或者扫描条形码"
					@clear="stockNoClear"
				>
				</u--input>
				<u-icon
					slot="right"
					name="scan"
					size="28"
					color="#3c9cff"
					@click="scanCode"
				></u-icon>
			</u-form-item>
			<u-form-item
				label="门幅(mm)"
				prop="paperWidth"
				borderBottom
			>
				<u--input
					v-model="info.paperWidth"
					disabled
					disabledColor="#e5e5e5"
					border="none"
					placeholder="自动查询"
				>
				</u--input>
			</u-form-item>	
			<u-form-item
				label="纸质"
				prop="paperCode"
				borderBottom
			>
				<u--input
					v-model="info.paperCode"
					disabled
					disabledColor="#e5e5e5"
					border="none"
					placeholder="自动查询"
				>
				</u--input>
			</u-form-item>
			<u-form-item
				label="克重(g)"
				prop="paperWt"
				borderBottom
			>
				<u--input
					v-model="info.paperWt"
					disabled
					disabledColor="#e5e5e5"
					border="none"
					placeholder="自动查询"
				>
				</u--input>
			</u-form-item>
			<u-form-item
				label="重量(kg)"
				prop="oriWt"
				borderBottom
			>
				<u--input
					v-model="info.oriWt"
					disabled
					disabledColor="#e5e5e5"
					border="none"
					placeholder="自动查询"
				>
				</u--input>
			</u-form-item>
			<u-form-item
				label="回仓重量"
				prop="weight"
				borderBottom
			>
				<u--input
					v-model="formData.weight"
					type="digit"
					border="none"
					placeholder="请输入回仓重量"
				>
				</u--input>
			</u-form-item>
			<u-form-item
				label="入库日期"
				prop="opTime"
				borderBottom
				@click="config.calendar.show=true;hideKeyboard()"
			>
				<u--input
					v-model="formData.opTime"
					disabled
					disabledColor="#e5e5e5"
					border="none"
					placeholder="请选择入库日期"
				>
				</u--input>
				<u-icon
					slot="right"
					name="arrow-right"
				></u-icon>
			</u-form-item>
		</u--form>
		<!-- 提交按钮 -->
		<u-button
			type="primary"
			text="提交"
			customStyle="margin-top: 100rpx"
			:disabled="config.submit.disabled"
			@click="submit"
		></u-button>
		<!-- 日期选择 -->
		<u-calendar
			:show="config.calendar.show"
			:mode="config.calendar.mode"
			:defaultDate="formData.opTime"
			:minDate="config.calendar.minDate"
			:maxDate="config.calendar.maxDate"
			@confirm="dateConfirm"
			@close="config.calendar.show=false"
		>
		</u-calendar>
		<!-- 模态框 -->
		<u-modal
			:show="config.modal.show"
			:content="config.modal.content"
			showCancelButton
			asyncClose
			@confirm="stockIn"
			@cancel="config.modal.show=false"
		>
		</u-modal>
		<!-- 出库结果提示 -->
		<u-toast ref="stockInToast"></u-toast>
	</view>
</template>

<script>
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { getStockInInfo, doStockIn } from "@/api/staff/paper.js"
	
	export default {
		data() {
			return {
				/* 配置 */
				config: {
					/* 表单配置 */
					form: {
						/* 表单验证规则 */
						rules: {
							'stockNo': {
								type: 'string',
								len: 12,
								required: true,
								message: '请输入正确的单号或扫描条形码',
								trigger: 'blur'
							},
							'weight': [
								{
									type: 'number',
									required: true, 
									message: '请输入回仓重量',
									trigger: 'blur'
								},
								{
									validator: (rule, value, callback)=> {
										return value > Number(this.info.oriWt) ? false : true
									},
									message: '回仓重量超过重量',
									trigger: 'blur'
								}
							]
						}
					},
					calendar: {
						show: false,
						/* 日历类型 */
						mode: 'single',
						/* 最小日期 */
						minDate: null,
						/* 最大日期 */
						maxDate: null,
					},
					/* 提交按钮配置 */
					submit: {
						disabled: true
					},
					/* 模态框配置 */
					modal: {
						content: '确定出库?',
						show: false,
					},
				},
				/* 查询数据 */
				info: {
					//门幅
					paperWidth: null,
					//纸质
					paperCode: null,
					//原纸克重
					paperWt: null,
					//重量
					oriWt: 0,
				},
				/* 表单数据 */
				formData: {
					//库存编号
					stockNo: null,
					//回仓重量
					weight: 0,
					//入库日期
					opTime: null
				}
			}
		},
		onReady(){
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'paperStockIn' } )
				this.formData.opTime = result.opTime
				this.config.calendar.minDate = result.minDate
				this.config.calendar.maxDate = result.maxDate
			},
			/* 单号清空 */
			stockNoClear(){
				this.formData.stockNo = this.$options.data().formData.stockNo
			},
			/* 扫码点击 */
			scanCode(){
				let _this = this
				uni.scanCode({
					success: function (res) {
						_this.formData.stockNo = res.result
					}
				});
			},
			/* 收起输入键盘 */
			hideKeyboard() {
				uni.hideKeyboard()
			},
			/* 日期选择确认 */
			dateConfirm(e){
				let arr = JSON.parse(JSON.stringify(e))
				this.formData.opTime = arr[0]
				this.config.calendar.show = false
			},
			/* 原纸入库按钮点击 */
			submit(){
				this.$refs.stockIn.validate().then(res => {
					this.config.modal.show = true
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			/* 原纸入库 */
			async stockIn(){
				const { result } = await doStockIn(this.formData)
				this.formData = this.$options.data().formData
				this.info = this.$options.data().info
				this.config.form.submit.disabled = this.$options.data().config.form.submit.disabled
				this.config.form.modal.show = false
				this.$refs.stockInToast.show({
					type: 'success',
					message: "入库成功",
				})
				this.getParams()
			},
			/* 获取信息 */
			async getInfo(){
				this.info = this.$options.data().info
				this.config.submit.disabled = this.$options.data().config.submit.disabled
				const { result } = await getStockInInfo( this.formData )
				this.info.paperWidth = result.paperWidth
				this.info.paperCode = result.paperCode
				this.info.paperWt = result.paperWt
				this.info.oriWt = result.oriWt
				this.config.submit.disabled = false
			},
		},
		computed: {
			stockNo(){
				return this.formData.stockNo
			}
		},
		watch: {
			stockNo( newV, oldV ){
				if(newV && newV.length == 12){
					this.getInfo()
				} else {
					this.info = this.$options.data().info
					this.config.submit.disabled = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-form{
		padding: 0 30rpx;
	}
</style>