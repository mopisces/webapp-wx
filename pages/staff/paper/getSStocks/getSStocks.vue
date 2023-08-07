<template>
	<view>
		<view ref="sstocksHeader" id="sstocksHeader">
			<!-- <u-notice-bar :text="config.notice.text"></u-notice-bar> -->
			<u-subsection 
				:list="config.subsection.list" 
				mode="subsection" 
				:current="filterForm.dataType" 
				@change="sectionChange"
			></u-subsection>
		</view>
		<webapp-prv-next 
			v-if="config.prevNext.show" 
			:radioData="config.prevNext.radioData" 
			:key="Math.random()"
			@radioConfirm="radioConfirm"
		>
		</webapp-prv-next>
		
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
		<liu-drag-button 
			:bottomPx="height*0.8"
			@clickBtn="sumBtnClick"
		>
			<text>总库存</text>
		</liu-drag-button>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { getSStockConfig, getSStock } from '@/api/staff/paper.js';
	import WebappPrvNext from '@/components/webapp-prv-next/webapp-prv-next.vue';
	import { mapGetters } from 'vuex';
	
	export default {
		components:{
			WebappPrvNext
		},
		data() {
			return {
				config:{
					subsection:{
						list:['按门幅汇总','按纸类汇总'],
					},
					prevNext: {
						columns: {
							width: [
								{ name: 'PaperCode', label: '纸类',fixed:true,width:80 },
								{ name: 'ZJWt', label: '整卷重量',width:80, },
								{ name: 'iZJCount', label: '整卷卷数',width:80},
								{ name: 'RWt', label: '残卷重量',width:80 },
								{ name: 'iRCount', label: '残卷卷数',width:80 }
							],
							code: [
								{ name: 'PaperWidth', label: '门幅',fixed:true,width:80 },
								{ name: 'ZJWt', label: '整卷重量',width:80, },
								{ name: 'iZJCount', label: '整卷卷数',width:80},
								{ name: 'RWt', label: '残卷重量',width:80 },
								{ name: 'iRCount', label: '残卷卷数',width:80 }
							]
						},
						radioData: [],
						show: false
					},
					notice: {
						text: '',
					},
					table:{
						height: null,
						column: [],
						data: []
					}
				},
				column: [
					{ name: 'PaperCode', label: '纸类',fixed:true,width:80 },
					{ name: 'ZJWt', label: '整卷重量',width:80, },
					{ name: 'iZJCount', label: '整卷卷数',width:80},
					{ name: 'RWt', label: '残卷重量',width:80 },
					{ name: 'iRCount', label: '残卷卷数',width:80 },
				],
				radioData: {
					widthData: [],
					codeData: []
				},
				filterForm: {
					dataType: 1,
					searchData: null,
				},
			}
		},
		mounted(){
			this.getConfig();
			
		},
		methods:{
			clickBtn(){
				
			},
			sectionChange(idx){
				this.filterForm.dataType = idx;
				this.config.prevNext.show = false;
				this.setPageType( idx )
				this.config.table.data = [];
				this.$nextTick(() => {
					this.config.prevNext.show = true;
				});
				this.getData();
			}, 
			async getConfig(){
				const { result } = await getSStockConfig();
				this.config.notice.text = '原纸总库存:  ' + result.total;
				this.radioData.widthData = result.width_select;
				this.radioData.codeData = result.code_select;
				this.setPageType( this.filterForm.dataType )
				this.$nextTick(() => {
					this.config.prevNext.show = true;
					if( this.filterForm.searchData ){
						this.getData();
					}
				});
			},
			async getData(){
				this.setPageType( this.filterForm.dataType )
				const { result } = await getSStock(this.filterForm);
				this.config.table.data = result;
			},
			setPageType( dataType ){
				if( dataType == 1 ){
					this.config.table.column = this.config.prevNext.columns.width;
					this.config.prevNext.radioData = this.radioData.widthData;
				}else{
					this.config.table.column = this.config.prevNext.columns.code;
					this.config.prevNext.radioData = this.radioData.codeData;
				}
			},
			radioConfirm( val ){
				this.filterForm.searchData = val;
				this.getData();
			},
			sumBtnClick(){
				this.$refs.uToast.show({
					message: this.config.notice.text,
					type: 'default',
					duration: 3000,
				})
			}
		},
		computed: {
			...mapGetters({
				height: 'page/pageHeight',
				width: 'page/pageWidth'
			}),
			prevNextShow(){
				return this.config.prevNext.show
			}
		},
		watch: {
			prevNextShow( newV, oldV ){
				if( newV ){
					if( this.config.table.height == null ){
						uni.createSelectorQuery().in(this).select("#sstocksHeader").boundingClientRect( data =>{
							this.config.table.height = this.height - data.height - (136 * this.width / 750) - 25;
						}).exec();
					}
				}
			}
		}
	}
</script>