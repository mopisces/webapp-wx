<template>
	<view class="popup-filter-item margin20">
		<view class="popup-filter-title">纸箱尺寸</view>
		<view class="popup-filter-content popup-filter-input">
			<view>
				<u--input
					v-model="boxLen" 
					placeholder="长" 
					:disableDefaultPadding="true" 
					inputAlign="center" 
					>
				</u--input>
			</view>
			<view>×</view>
			<view>
				<u--input
					v-model="boxWidth" 
					placeholder="宽" 
					:disableDefaultPadding="true" 
					inputAlign="center" 
					>
				</u--input>
			</view>
			<view>×</view>
			<view>
				<u--input 
					v-model="boxHeight" 
					placeholder="高" 
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
		name: 'webapp-filter-box-size',
		props: {
			boxL: {
				type: String,
				default: '',
			},
			boxW: {
				type: String,
				default: '',
			},
			boxH: {
				type: String,
				default: '',
			}
		},
		data() {
			return {}
		},
		computed: {
			boxLen: {
				get(){
					return this.$props.boxL;
				},
				set( value ){
					this.$emit("update:boxL", value);
				}
			},
			boxWidth: {
				get(){
					return this.$props.boxW;
				},
				set( value ){
					this.$emit("update:boxW", value);
				}
			},
			boxHeight: {
				get(){
					return this.$props.boxH;
				},
				set( value ){
					this.$emit("update:boxH", value);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/filter.scss";
</style>