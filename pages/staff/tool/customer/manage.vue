<!-- 客户管理 -->
<template>
	<view>
		<!-- 数据列表 -->
		<z-paging
			ref="manageList" 
			v-model="config.indexList" 
			:auto-show-system-loading="true"
			@query="queryList"
		>
			<view slot="top">
				<u-subsection
					:list="config.subsection.list" 
					:current="formData.dataType"
					@change="sectionChange"
				>
				</u-subsection>
			</view>
			<!-- 数据卡片 -->
			<uni-card
				v-for="(item, index) in config.indexList" 
				:key="index"
				:title="item.title" 
				:is-shadow="true"
				:border="false"
			>
				<view class="card-body-container">
					<template v-if="formData.dataType==0">
						<view class="card-body-item card-body-item-100">
							<text>客户信息:
								<text class="mg-left-20">{{ item.cusShortName }}({{ item.cusId }})</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>客户账号:
								<text class="mg-left-20">{{ item.userName }}</text>
							</text>
						</view>
					</template>
					<template v-else>
						<view class="card-body-item card-body-item-100">
							<text>员工信息:
								<text class="mg-left-20">{{ item.chiName }}({{ item.taskId }})</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>员工账号:
								<text class="mg-left-20">{{ item.userName }}</text>
							</text>
						</view>
					</template>
				</view>
				<view slot="actions" class="card-actions">
					<view class="card-actions-item" @click="doManage(item)">
						<u-icon name="account" color="#303133" size="18"></u-icon>
						<text class="card-actions-item-text">权限管理</text>
					</view>
				</view>
			</uni-card>
		</z-paging>
		<!-- 权限管理弹窗 -->
		<u-modal
			:show="config.modal.show"
			title="权限"
			:showCancelButton="true"
			:asyncClose="true"
			width="700rpx"
			@cancel="cancel"
			@confirm="confirm"
		>
			<uni-data-checkbox
				mode="tag" 
				multiple 
				v-model="rowData.auth" 
				:localdata="config.modal.list">
			</uni-data-checkbox>
		</u-modal>
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	/* api接口 */
	import { fetchCusManageList, fetchCusAuthList, doCusManageModify } from "@/api/staff/tool.js"
	
	export default {
		data() {
			return {
				/* 配置 */
				config: {
					/* 列表数据 */
					indexList: [],
					/* 分选器 */
					subsection: {
						list: ['外部用户', '内部用户']
					},
					/* 权限管理弹窗 */
					modal: {
						show: false,
						/* 权限列表 */
						list: []
					}
				},
				/* 筛选条件 */
				formData: {
					//数据类型 0->外部用户 1->内部用户
					dataType: 0,
					//数据内容
					pageSize: 25,
					//当前页数
					pageNo: 1
				},
				/* 当前选中 */
				rowData: {
					//用户类型0->外部用户 1->内部用户
					userType: null,
					//用户名称
					userName: null,
					//权限
					auth: [],
				}
			}
		},
		methods: {
			/* 分段器选择 */
			sectionChange( idx ){
				this.formData.dataType = idx
				this.$refs.manageList.reload()
			},
			/* 获取数据列表 */
			async queryList( pageNo, pageSize ){
				this.formData.pageNo = pageNo
				this.formData.pageSize = pageSize
				const { result } = await fetchCusManageList( this.formData )
				this.$refs.manageList.complete(result)
			},
			/* 用户管理 */
			async doManage( rowData ){
				this.rowData = this.$options.data().rowData
				this.config.modal = this.$options.data().config.modal
				Object.assign(this.rowData, rowData)
				await this.fetchAuthList()
				this.config.modal.show = true
			},
			/* 获取权限列表 */
			async fetchAuthList(){
				const { result } = await fetchCusAuthList( this.rowData )
				result.map.forEach((item, idx)=>{
					this.config.modal.list.push({text: item, value: item})
				})	
				this.rowData.auth = JSON.parse(JSON.stringify(result.available))
			},
			/* 弹窗关闭 */
			cancel(){
				this.rowData = this.$options.data().rowData
				this.config.modal.show = false
			},
			/* 弹窗确认 */
			async confirm(){
				const { result } = await doCusManageModify(this.rowData)
				this.config.modal.show = false
				let _this = this
				this.$refs.uToast.show({
					type: 'success',
					message: '权限修改成功',
					complete: ()=>{
						_this.rowData = _this.$options.data().rowData
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/card.scss";
</style>