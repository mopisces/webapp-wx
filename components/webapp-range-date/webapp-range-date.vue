<template>
	<view class="popup-filter-item margin20" @click="config.calendar.show = true">
		<view class="popup-filter-title">{{ label }}</view>
		<view class="popup-filter-content popup-filter-input">
			<view>
				<u--input
					v-model="sDate" 
					placeholder="开始日期" 
					:disabled="true"
					:disableDefaultPadding="true" 
					inputAlign="center" 
				>
				</u--input>
			</view>
			<view>~</view>
			<view>
				<u--input
					v-model="eDate" 
					placeholder="结束日期" 
					:disabled="true"
					:disableDefaultPadding="true" 
					inputAlign="center" 
				>
				</u--input>
			</view>
			<view>
				<u-icon name="arrow-right" color="#2979ff" size="15"></u-icon>
			</view>
		</view>
		<u-calendar
			:show="config.calendar.show" 
			:showTitle="false"
			mode="range" 
			:closeOnClickOverlay="false" 
			:allowSameDay="true"
			:defaultDate="rDate"
			:minDate="min"
			:maxDate="max"
			:monthNum="mNum"
			@confirm="dateConfirm"
			@close="config.calendar.show = false"
		>
		</u-calendar>
	</view>
</template>

<script>
	export default {
		props:{
			label: {
				type: String,
				default: '日期区间'
			},
			beginDate: {
				type: String,
				default: '',
			},
			endDate: {
				type: String,
				default: '',
			},
			maxDate: {
				type: String,
				default: '',
			},
			minDate: {
				type: String,
				default: '',
			},
			rangeDate: {
				type: Array,
				default: []
			},
			monthNum: {
				type: String,
				default: '12'
			}
		},
		data() {
			return {
				config: {
					calendar: {
						show: false
					}
				}
			}
		},
		methods: {
			dateConfirm( dateList ) {
				this.config.calendar.show = false
				this.$emit("update:beginDate", dateList[0])
				this.$emit("update:endDate", dateList[ dateList.length - 1 ])
				this.$emit("update:rangeDate", [dateList[0], dateList[ dateList.length - 1 ]])
			}
		},
		computed:{
			sDate: {
				get(){
					return this.$props.beginDate
				},
				set( value ){
					this.$emit("update:beginDate", value)
				}
			},
			eDate: {
				get(){
					return this.$props.endDate
				},
				set( value ){
					this.$emit("update:endDate", value)
				}
			},
			max: {
				get(){
					return this.$props.maxDate
				},
				set( value ){
					this.$emit("update:maxDate", value)
				}
			},
			min: {
				get(){
					return this.$props.minDate
				},
				set( value ){
					this.$emit("update:minDate", value)
				}
			},
			rDate: {
				get(){
					return this.$props.rangeDate
				},
				set( value ){
					this.$emit("update:rangeDate", value)
				}
			},
			mNum: {
				get(){
					return this.$props.monthNum
				},
				set( value ){
					this.$emit("update:monthNum", value)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
</style>