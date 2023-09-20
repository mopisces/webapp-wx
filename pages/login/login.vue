<template>
	<view class="container">
		<view class="tui-bg-box">
			<image src="/static/img/login/bg_login.png" class="tui-bg-img"></image>
			<image src="/static/img/user/mine_touxiang.png" class="tui-photo"></image>
		</view>
		
		<view class="tui-login-from">
			<u--form ref="uForm" :model="formData" labelWidth="auto" :customStyle="{fontSize:'32rpx',lineHeight:'52rpx'}">
				<u-form-item prop="userName" borderBottom leftIcon="account">
					<u--input v-model="formData.userName" border="none" placeholder="请输入用户名"></u--input>
				</u-form-item>
				<u-form-item prop="passWord" borderBottom leftIcon="lock">
					<u--input v-model="formData.passWord" border="none" placeholder="请输入密码"></u--input>
				</u-form-item>
				<u-form-item prop="phoneNum" borderBottom leftIcon="phone">
					<u--input
						v-model="formData.phoneNum"
						disabledColor="#ffffff"
						placeholder="请输入手机号码"
						border="none"
					></u--input>
					<u-button 
						slot="right"
						text="获取手机号码"
						type="success"
						size="mini"
						open-type="getPhoneNumber"
						@getphonenumber="getPhoneNumber"
					></u-button>
				</u-form-item>
				<u-form-item prop="userType" borderBottom leftIcon="man-add">
					<u-radio-group v-model="formData.userType" placement="row" @change="radioChange">
						<u-radio 
							:customStyle="{marginRight: '32rpx'}" 
							v-for="(item, index) in config.radio.list"
							:key="index"
							:label="item.name"
							:name="item.key"
						></u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item 
					prop="factoryName" 
					borderBottom 
					leftIcon="home" 
					@click="config.picker.show = true"
				>
					<u--input 
						disabled
						disabledColor="#ffffff"
						placeholder="请选择厂家"
						border="none"
						v-model="formData.factoryName"
					></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
			</u--form>
			<u-button
				type="primary"
				text="提交"
				customStyle="margin-top: 80rpx"
				@click="submit"
			></u-button>
		</view>
		<u-picker 
			ref="uPicker" 
			:show="config.picker.show" 
			:showToolbar="true"
			title="请选择厂商"
			:loading="config.picker.loading"
			:columns="config.picker.columns" 
			keyName="FFullName"
			@confirm="confirm" 
			@change="changeHandler"
		></u-picker>
	</view>
</template>

<script>
	import { getWebCustomerConfig } from '@/api/arguments/index.js';
	import { login } from '@/api/login/index.js';
	export default {
		data(){
			return {
				config:{
					radio:{
						list:[
							//{name: '客户', key: 0},
							{name: '厂家人员', key: 1},
						]
					},
					picker:{
						show: false,
						loading: false,
						columns: [
							[],
							[]
						],
						subCol:{}
					}
				},
				formData:{
					userName: '',
					passWord: '',
					userType: 1,
					phoneNum: '',
					id: null,
					subFact: null,
					factoryName: '',
				},
				rules:{
					'userName':{
						type: 'string',
						required: true,
						message: '请填写用户名',
						trigger: ['blur', 'change']
					},
					'passWord':{
						type: 'string',
						required: true,
						max: 20,
						message: '请填写密码',
						trigger: ['blur', 'change']
					},
					'phoneNum': [
						{
							type: 'string',
							required: true, 
							message: '请输入手机号',
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change','blur'],
						}
					],
					'userType': {
						type: 'number',
						max: 1,
						required: true,
						message: '请选择用户类型',
						trigger: ['blur', 'change']
					},
					'factoryName': {
						type: 'string',
						required: true,
						message: '请选择厂家',
						trigger: ['blur', 'change']
					}
				}
			}
		},
		onReady() {
			// #ifdef MP-WEIXIN
			this.$refs.uForm.setRules(this.rules)
			// #endif
			this.setSubFactPicker();
		},
		onLoad() {
			
		},
		methods:{
			getPhoneNumber(e){
				console.log(e)
				if(e.detail.errMsg == "getPhoneNumber:ok"){
					
				}
			},
			radioChange(name){
				console.log(name)
			},
			changeHandler(e){
				const { columnIndex, value, values, index, picker = this.$refs.uPicker } = e;
				picker.setColumnValues(1, this.config.picker.subCol[value[0].id]);
			},
			async setSubFactPicker(){
				this.config.picker.loading = true;
				this.config.picker.columns[0] = [];
				this.config.picker.columns[1] = [];
				this.config.picker.subCol = {};
				const { result } = await getWebCustomerConfig();
				result.forEach((item,idx)=>{
					this.config.picker.columns[0].push({
						id: item.id,
						FShortName: item.FShortName,
						FactoryId: item.FactoryId,
						FFullName: item.FFullName,
						EnableSubFac: item.EnableSubFac
					})
					this.config.picker.subCol[item.id] = [];
					if( item.EnableSubFac == 1 ){
						this.config.picker.subCol[item.id] = item.SubFacId.split(",");
					}
				});
				this.$nextTick(()=>{
					this.config.picker.columns[1] = this.config.picker.subCol[this.config.picker.columns[0][0].id];
				})
				this.config.picker.loading = false;
			},
			confirm(e){
				const { indexs, value, values } = e;
				this.formData.subFact = null;
				this.formData.id = value[0].id;
				this.formData.factoryName = value[0].FFullName;
				if( value[0].EnableSubFac == 1 ){
					this.formData.subFact = value[1];
					this.formData.factoryName += '&&' + value[1]
				}
				this.config.picker.show = false;
			},
			submit(){
				this.$refs.uForm.validate().then(res => {
					uni.$u.toast('校验通过')
					this.$store.dispatch('user/login',this.formData).then(()=>{
						uni.reLaunch({
							url:'/pages/user/user'
						})
					})
				}).catch(errors => {
					uni.$u.toast(errors[0].message)
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	
	.tui-bg-box {
		width: 100%;
		box-sizing: border-box;
		position: relative;
		padding-top: 44rpx;
	}
	
	.tui-photo {
		height: 138rpx;
		width: 138rpx;
		display: block;
		margin: 10rpx auto 0 auto;
		border-radius: 50%;
		position: relative;
		z-index: 2;
	}
	
	.tui-bg-img {
		width: 100%;
		height: 346rpx;
		display: block;
		position: absolute;
		top: 0;
	}
	
	.tui-login-name {
		width: 128rpx;
		height: 40rpx;
		font-size: 30rpx;
		color: #fff;
		margin: 36rpx auto 0 auto;
		text-align: center;
		position: relative;
		z-index: 2;
	}
	
	.tui-login-from {
		width: 100%;
		padding: 168rpx 104rpx 0 104rpx;
		box-sizing: border-box;
	}
	
</style>