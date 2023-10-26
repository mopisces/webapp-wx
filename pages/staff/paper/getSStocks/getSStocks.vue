<!-- 原纸库存 -->
<template>
	<view>
		<!-- 头部分段器 -->
		<view ref="sstocksHeader" id="sstocksHeader">
			<u-subsection 
				:list="config.subsection.list" 
				mode="subsection" 
				:current="formData.dataType" 
				@change="sectionChange"
			></u-subsection>
		</view>
		<!-- 头部选择 -->
		<webapp-prv-next 
			ref="prvNext"
			:popupShow.sync="config.prevNext.popupShow"
			:value.sync="formData.searchData"
			:key="Math.random()"
			@radioConfirm="radioConfirm"
		>
		</webapp-prv-next>
		<!-- 表格 -->
		<view :style=" 'height:' + config.table.height + 'px;width:100%;' ">
			<zb-table
				:show-header="true" 
				:columns="config.table.column"
				:stripe="true"
				:fit="false"
				:border="true"
				:data="config.table.data"
			></zb-table>
		</view>
		<!-- 总库存按钮 -->
		<liu-drag-button 
			v-show=" !config.prevNext.popupShow "
			:bottomPx="pageHeight*0.8"
			@clickBtn="sumBtnClick"
		>
			<text>总库存</text>
		</liu-drag-button>
		<!-- 显示库存数 -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	/* 自定义头部选择组件 */
	import WebappPrvNext from "@/components/webapp-prv-next/webapp-prv-next.vue"
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { getSStockConfig, getSStock } from "@/api/staff/paper.js"
	
	export default {
		components:{
			WebappPrvNext
		},
		data() {
			return {
				config:{
					/* 头部分段器配置 */
					subsection:{
						list:['按纸类汇总', '按门幅汇总'],
					},
					/* 头部选择配置 */
					prevNext: {
						columns: {
							width: [
								{ name: 'paperCode', label: '纸类', fixed: true, width: 80 },
								{ name: 'zJWt', label: '整卷重量', width: 80, },
								{ name: 'iZJCount', label: '整卷卷数', width: 80},
								{ name: 'rWt', label: '残卷重量', width: 80 },
								{ name: 'iRCount', label: '残卷卷数', width: 80 }
							],
							code: [
								{ name: 'paperWidth', label: '门幅', fixed: true, width: 80 },
								{ name: 'zJWt', label: '整卷重量', width: 80, },
								{ name: 'iZJCount', label: '整卷卷数', width: 80},
								{ name: 'rWt', label: '残卷重量', width: 80 },
								{ name: 'iRCount', label: '残卷卷数', width: 80 }
							]
						},
						radioData: [],
						popupShow: false,
					},
					/* 总库存数弹窗配置 */
					notice: {
						text: '',
					},
					/* 表格配置 */
					table:{
						height: null,
						column: [],
						data: []
					}
				},
				/* 头部选择中单选数据 */
				radioData: {
					widthData: [],
					codeData: []
				},
				/* 筛选条件 */
				formData: {
					/* 原纸库存汇总类型0->按纸类汇总 1->按门幅汇总 */
					dataType: 1,
					/* 搜索关键值 */
					searchData: null,
				},
			}
		},
		mounted(){
			this.setTable()
			this.$nextTick(()=>{
				this.getConfig()
			})
		},
		methods:{
			/* 设置表格 */
			setTable(){
				let that = this
				uni.createSelectorQuery().in(this).select("#sstocksHeader").boundingClientRect( data =>{
					that.config.table.height = that.pageHeight - data.height - (136 * that.pageWidth / 750) - 25
				}).exec()
			},
			/* 分段器修改 */
			sectionChange(idx){
				this.formData.dataType = idx
				this.setPageType( idx )
				this.config.table.data = []
				this.getData()
			}, 
			/* 获取页面数据 */
			async getConfig(){
				const { result } = await getSStockConfig()
				this.config.notice.text = '原纸总库存:  ' + result.total
				this.radioData.widthData = result.width_select
				this.radioData.codeData = result.code_select
				this.setPageType( this.formData.dataType )
				this.$nextTick(() => {
					if( this.formData.searchData ){
						this.getData()
					}
				})
			},
			/* 获取表格数据 */
			async getData(){
				this.setPageType( this.formData.dataType )
				const { result } = await getSStock(this.formData)
				this.config.table.data = result
			},
			/* 按分段器绑定值修改表格和头部选择配置 */
			setPageType( dataType ){
				this.$refs.prvNext.complete([])
				if( dataType == 1 ){
					this.config.table.column = this.config.prevNext.columns.width
					this.$refs.prvNext.complete(this.radioData.widthData)
				}else{
					this.config.table.column = this.config.prevNext.columns.code
					this.$refs.prvNext.complete(this.radioData.codeData)
				}
			},
			/* 头部选择选中后触发 */
			radioConfirm( val ){
				this.formData.searchData = val
				if( val ){
					this.getData()
				}
			},
			/* 总库存按钮点击 */
			sumBtnClick(){
				this.$refs.uToast.show({
					message: this.config.notice.text,
					type: 'default',
					duration: 3000,
				})
			},
			
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight",
				pageWidth: "page/pageWidth",
			})
		}
	}
</script>