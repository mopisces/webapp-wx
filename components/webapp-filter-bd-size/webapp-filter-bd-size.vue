<template>
	<view class="popup-filter-item margin20">
		<view class="popup-filter-title">纸板尺寸</view>
		<view class="popup-filter-content popup-filter-input">
			<view>
				<u--input
					v-model="bdLen" 
					placeholder="长" 
					:disableDefaultPadding="true" 
					inputAlign="center" 
					>
				</u--input>
			</view>
			<view>×</view>
			<view>
				<u--input
					v-model="bdWidth" 
					placeholder="宽" 
					:disableDefaultPadding="true" 
					inputAlign="center" 
					>
				</u--input>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'webapp-filter-bd-size',
		props: {
			bdL: {
				type: String,
				default: ''
			},
			bdW: {
				type: String,
				default: ''
			}
		},
		data() {
			return {}
		},
		computed: {
			bdLen: {
				get(){
					return this.$props.bdL;
				},
				set( value ){
					this.$emit("update:bdL", value);
				}
			},
			bdWidth: {
				get(){
					return this.$props.bdW;
				},
				set( value ){
					this.$emit("update:bdW", value);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
</style>