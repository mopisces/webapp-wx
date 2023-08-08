<template>
	<page-meta :page-style="'overflow:'+(config.popup.show || config.filter.show ?'hidden':'visible')"></page-meta>
	<view>
		<webapp-prv-next
			v-if="config.prevNext.show" 
			:radioData="config.prevNext.radioData" 
			:key="Math.random()"
			@radioConfirm="radioConfirm"
		>
		</webapp-prv-next>
		<liu-rotating-menu
			ref="dragMenu"
			:btnObj="config.menu.options"
			:bottomPct="0.8"
			@click="menuClick">
		</liu-rotating-menu>
	</view>
</template>

<script>
	import WebappPrvNext from '@/components/webapp-prv-next/webapp-prv-next.vue'
	import { fetchDeliveryDailyInfo } from '@/api/staff/customer.js'
	export default {
		components:{
			WebappPrvNext
		},
		data(){
			return {
				config: {
					prevNext: {
						show: false,
						radioData: []
					},
					menu: {
						options: {
							id: 'cusDaliyDeliveryDetail',
							name: '菜单',
							childs: [
								{
									id: '1',
									name: '筛选'
								},
								{
									id: '2',
									name: '客户'
								}
							]
						}
					},
					popup: {
						show: false
					},
					filter: {
						show: false
					}
				},
				formData: {
					
				}
			}
		},
		onLoad(options) {
			this.formData = Object.assign( 
				this.formData, 
				JSON.parse(decodeURIComponent(options.filterInfo)), 
				{ type: 3 },
			);
			this.$nextTick(()=>{
				this.queryInfo();
			})
		},
		methods: {
			menuClick(e){
				
			},
			radioConfirm( val ){
				console.log(val)
			},
			async queryInfo(){
				console.log(this.formData)
				const {result} = await fetchDeliveryDailyInfo( this.formData );
			}
		}
	}
</script>

<style>
</style>