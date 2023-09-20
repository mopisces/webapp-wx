<!-- 原纸出库 -->
<template>
	<view class="page-form">
		<!-- 表单 -->
		<u--form
			ref="stockOut"
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
				prop="curWt"
				borderBottom
			>
				<u--input
					v-model="info.curWt"
					disabled
					disabledColor="#e5e5e5"
					border="none"
					placeholder="自动查询"
				>
				</u--input>
			</u-form-item>
			<u-form-item
				label="班次"
				prop="opClass"
				borderBottom
			>
				<u--input
					v-model="formData.opClass"
					border="none"
					placeholder="请输入班次"
				>
				</u--input>
			</u-form-item>
			<u-form-item
				label="机台"
				prop="sFlute"
				borderBottom
				@click="config.form.picker.show=true;hideKeyboard()"
			>
				<u--input
					v-model="formData.sFlute"
					disabled
					disabledColor="#e5e5e5"
					border="none"
					placeholder="请选择机台"
				>
				</u--input>
				<u-icon
					slot="right"
					name="arrow-right"
				></u-icon>
			</u-form-item>
			<u-form-item
				label="剥纸重量"
				prop="bzwt"
				borderBottom
			>
				<u--input
					v-model="formData.bzwt"
					type="digit"
					border="none"
					placeholder="请输入剥纸重量"
				>
				</u--input>
			</u-form-item>
			<u-form-item
				label="出库日期"
				prop="opTime"
				borderBottom
				@click="config.form.calendar.show=true;hideKeyboard()"
			>
				<u--input
					v-model="formData.opTime"
					disabled
					disabledColor="#e5e5e5"
					border="none"
					placeholder="请选择出库日期"
				>
				</u--input>
				<u-icon
					slot="right"
					name="arrow-right"
				></u-icon>
			</u-form-item>
		</u--form>
		<u-button
			type="primary"
			text="提交"
			customStyle="margin-top: 100rpx"
			:disabled="config.form.submit.disabled"
			@click="submit"
		></u-button>
		<!-- 机台选择 -->
		<u-picker 
			ref="sFlute"
			title="机台"
			:showToolbar="true"
			:show="config.form.picker.show" 
			:columns="config.form.picker.columns"
			@confirm="pickerConfirm"
			@cancel="pickerCancel"
		>
		</u-picker>
		<!-- 日期选择 -->
		<u-calendar
			:show="config.form.calendar.show"
			:mode="config.form.calendar.mode"
			:defaultDate="formData.opTime"
			:minDate="config.form.calendar.minDate"
			:maxDate="config.form.calendar.maxDate"
			@confirm="dateConfirm"
			@close="config.form.calendar.show=false"
		>
		</u-calendar>
		<!-- 模态框 -->
		<u-modal
			:show="config.form.modal.show"
			:content="config.form.modal.content"
			showCancelButton
			asyncClose
			@confirm="stockOut"
			@cancel="config.form.modal.show=false"
		>
		</u-modal>
		<!-- 入库结果提示 -->
		<u-toast ref="stockOutToast"></u-toast>
	</view>
</template>

<script>
	/* api接口 */
	import { getWebConfig } from "@/api/staff/common.js"
	
	import { doStockOut, getStockOutInfo } from "@/api/staff/paper.js"
	
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
							'bzwt': [
								{
									type: 'number',
									required: true, 
									message: '请输入剥纸重量',
									trigger: 'blur'
								},
								{
									validator: (rule, value, callback)=> {
										return value > Number(this.info.curWt) ? false : true
									},
									message: '剥纸重量超过重量',
									trigger: 'blur'
								}
							]
							
						},
						/* 选择器配置 */
						picker: {
							show: false,
							columns:[ [1, 2, 3, 4, 6, 7, 8, 9] ]
						},
						/* 日期选择配置 */
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
						}
					}
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
					curWt: 0,
				},
				/* 表单数据 */
				formData: {
					//库存编号
					stockNo: null,
					//班次
					opClass: null,
					//机台
					sFlute: null,
					//剥纸重量
					bzwt: 0,
					//出库日期
					opTime: null
				},
			}
		},
		onReady(){
			this.getParams()
		},
		methods: {
			/* 获取参数 */
			async getParams(){
				const { result } = await getWebConfig( { paramType: 'paperStockOut' } )
				this.formData.opTime = result.opTime
				this.config.form.calendar.minDate = result.minDate
				this.config.form.calendar.maxDate = result.maxDate
			},
			/* 机台picker弹窗确认 */
			pickerConfirm( e ){
				this.formData.sFlute = e.value[0]
				this.config.form.picker.show = false
			},
			/* 机台picker弹窗取消 */
			pickerCancel(){
				this.formData.sFlute = this.$options.data().formData.sFlute
				this.$refs.sFlute.setIndexs(-1)
				this.config.form.picker.show = false
			},
			/* 日期选择确认 */
			dateConfirm(e){
				let arr = JSON.parse(JSON.stringify(e))
				this.formData.opTime = arr[0]
				this.config.form.calendar.show = false
			},
			/* 收起输入键盘 */
			hideKeyboard() {
				uni.hideKeyboard()
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
			/* 单号清空 */
			stockNoClear(){
				this.formData.stockNo = this.$options.data().formData.stockNo
			},
			/* 获取信息 */
			async getInfo(){
				this.info = this.$options.data().info
				this.config.form.submit.disabled = this.$options.data().config.form.submit.disabled
				const { result } = await getStockOutInfo( this.formData )
				this.info.paperWidth = result.paperWidth
				this.info.paperCode = result.paperCode
				this.info.paperWt = result.paperWt
				this.info.curWt = result.curWt
				this.config.form.submit.disabled = false
			},
			/* 原纸出库按钮点击 */
			submit(){
				this.$refs.stockOut.validate().then(res => {
					this.config.form.modal.show = true
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			/* 原纸出库 */
			async stockOut(){
				const { result } = await doStockOut(this.formData)
				this.formData = this.$options.data().formData
				this.info = this.$options.data().info
				this.config.form.submit.disabled = this.$options.data().config.form.submit.disabled
				this.config.form.modal.show = false
				this.$refs.stockOutToast.show({
					type: 'success',
					message: "出库成功",
				})
				this.getParams()
			}
		},
		computed: {
			stockNo(){
				return this.formData.stockNo
			}
		},
		watch: {
			stockNo( newV, oldV ){
				if(newV){
					if( newV.length == 12 ){
						this.getInfo()
					}else{
						this.info = this.$options.data().info
						this.config.form.submit.disabled = true
					}
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