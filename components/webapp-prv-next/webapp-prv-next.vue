<template>
	<view class="prv-next-container">
		<view class="prv-next-header">
			<view class="prv-next-header-box" @tap.stop="headerChange('prev')">
				<view class="prv-next-icon-box">
					<view class="prv-next-icon">
						<u-icon 
							name="arrow-left-double" 
							:color=" config.header.prev.noData ? 'gray' : '#2979ff' " 
							size="56rpx">
						</u-icon>
					</view>
				</view>
				<view class="prv-next-title">
					<template v-if="config.header.prev.noData">到顶了</template>
					<template v-else>{{ config.header.prev.data }}</template>
				</view>
			</view>
			<view class="prv-next-header-box" @tap.stop="middleClick()">
				<view class="prv-next-icon-box">
					<view class="prv-next-icon">
						<u-icon 
							name="checkbox-mark" 
							:color=" config.header.middle.noData ? 'gray' : '#2979ff' " 
							size="56rpx">
						</u-icon>
					</view>
				</view>
				<view class="prv-next-title">
					<template v-if="config.header.middle.noData">未选择</template>
					<template v-else>{{ config.header.middle.data }}</template>
				</view>
			</view>
			<view class="prv-next-header-box" @tap.stop="headerChange('next')">
				<view class="prv-next-icon-box">
					<view class="prv-next-icon">
						<u-icon 
							name="arrow-right-double" 
							:color=" config.header.next.noData ? 'gray' : '#2979ff' " 
							size="56rpx">
						</u-icon>
					</view>
				</view>
				<view class="prv-next-title">
					<template v-if="config.header.next.noData">到底了</template>
					<template v-else>{{ config.header.next.data }}</template>
				</view>
			</view>
		</view>
		<u-popup
			:show="config.popup.show" 
			mode="center" 
			:closeOnClickOverlay="true"
			:safeAreaInsetBottom="false" 
			:zoom="false" 
			:customStyle="{width:'650rpx;',height:'710rpx'}" 
			:zIndex="10065"
			:overlayIndex="10060"
			@close="close" 
			@open="open"
		>
			<view class="prv-next-content">
				<view class="prv-next-popup-header">
					筛选条件
				</view>
				<view class="prv-next-popup-radio">
					<scroll-view 
						:enable-flex="true"
						:scroll-y="true" 
						:scroll-left="true"
						:scroll-with-animation="true"
						:scroll-top="config.scroll.scrollTop"
						class="radio-scroll"
					>
						<radio-group @change="changeRadio">
							<label 
								v-for="(item, index) in radioData" 
								:key="item.value"
								:id=" item.id "
								:ref="item.id"
								
							>
								<view>
									<view 
										:class=" radio == item.prevNext ? 'prv-next-radio-container bg-color' : 'prv-next-radio-container' ">
										<view>
											<view v-if="item.PaperCode" >
												纸类:{{item.PaperCode}}
												<view v-if="item.PaperName">{{'[' + item.PaperName + ']'}}</view>
											</view>
											<view v-if="item.PaperWidth" >
												门幅:{{item.PaperWidth}}
											</view>
											<view>整卷卷数:{{item.ZJCount}}</view>
											<view>残卷卷数:{{item.CJCount}}</view>
											<view>重量:{{item.SRWt}}</view>
										</view>
										<radio
											:value="item.prevNext" 
											:checked=" radio == item.prevNext " 
										/>
									</view>
								</view>
							</label>
						</radio-group>
					</scroll-view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: 'WebappPrvNext',
		props: {
			radioData: {
				type: Array,
			}
		},
		data () {
			return {
				radio: '',
				config: {
					scroll: {
						anchor: null,
						scrollTop: '',
					},
					popup: {
						show: false
					},
					radio: {
						show: false
					},
					header: {
						index: 0,
						prev: {
							noData: false,
							data: ''
						},
						next: {
							noData: false,
							data: ''
						},
						middle: {
							noData: false,
							data: ''
						}
					}
				},
				isActive: 0
			}
		},
		created(){
			if( this.radioData.length == 0 ){
				this.radio = null;
			}else{
				if( this.radioData[0].prevNext ){
					this.radio = this.radioData[0].prevNext;
				}
			}
		},
		mounted(){
			this.controllerPrevNext();
		},
		methods: {
			headerChange( type ){
				if( type == 'prev' ){
					this.config.header.index--;
					if( this.config.header.index <= 0 ){
						this.config.header.index = 0;
					}
				}
				if( type == 'next' ){
					this.config.header.index++; 
					if( this.config.header.index >= this.radioData.length ){
						this.config.header.index = this.radioData.length - 1 ;
					}
				}
				this.isActive = this.config.header.index;
				this.radio = this.radioData[ this.config.header.index ].prevNext;
				this.controllerPrevNext();
			},
			middleClick(){
				this.radio = this.radioData[ this.config.header.index ].prevNext;
				this.config.popup.show = true;
			},
			controllerPrevNext(){
				let prev = Number(this.config.header.index) - 1;
				let next = Number(this.config.header.index) + 1;
				if( this.radioData[ prev ] == undefined ){
					this.config.header.prev.noData = true;
					this.config.header.prev.data = '';
				}else{
					this.config.header.prev.noData = false;
					this.config.header.prev.data = this.radioData[ prev ].prevNext;
				}
				if( this.radioData[ next ] == undefined ){
					this.config.header.next.noData = true;
					this.config.header.next.data = '';
				}else{
					this.config.header.next.noData = false;
					this.config.header.next.data = this.radioData[ next ].prevNext;
				}
				if( this.radioData[ this.config.header.index ] == undefined ){
					this.config.header.middle.noData = true;
					this.config.header.middle.data = '';
				}else{
					this.config.header.middle.noData = false;
					this.config.header.middle.data = this.radioData[ this.config.header.index ].prevNext;
				}
			},
			close(){
				this.config.popup.show = false;
				this.config.scroll.scrollTop = 0;
			},
			async open(){
				
				this.$nextTick(() => {
					if( this.config.scroll.anchor == null ){
						uni.createSelectorQuery()
						.in(this)
						.select("#" + this.radioData[0].id)
						.boundingClientRect(data=>{
							this.config.scroll.anchor = data.top
						}).exec();
					}
					uni.createSelectorQuery()
					.in(this)
					.select("#" + this.radioData[this.config.header.index].id)
					.boundingClientRect(data=>{
						this.config.scroll.scrollTop = data.top - this.config.scroll.anchor
						console.log(this.config.scroll.scrollTop)
					}).exec();
				})
			},
			changeRadio( evt ) {
				for (let i = 0; i < this.radioData.length; i++) {
					if (this.radioData[i].prevNext == evt.detail.value) {
						this.config.header.index = i;
						this.radio = evt.detail.value;
						this.config.scroll.toView = this.radioData[i].id;
						break;
					}
				}
				this.controllerPrevNext();
				this.close();
			}
		},
		computed:{
			radioChange(){
				return this.radio;
			}
		},
		watch:{
			radioChange( newV, oldV ){
				this.$emit('radioConfirm',newV);
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.prv-next-container{
		width: 100%;
		background: #fff;
		box-shadow: 0 3rpx 20rpx $u-info-light;
		border-radius: 40rpx;
		overflow: hidden;
	}
	.prv-next-header{
		width: 100%;
		height: 136rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.prv-next-header-box{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.prv-next-icon-box{
		position: relative;
	}
	
	.prv-next-icon{
		width: 64rpx;
		height: 64rpx;
		display: block;
	}
	
	.prv-next-title{
		font-size: 26rpx;
		font-weight: 400;
		color: $u-primary;
		padding-top: 4rpx;
	}
	
	.prv-next-content{
		width: 590rpx;
		height: 710rpx;
		padding: 0 30rpx 30rpx 30rpx;
		display: flex;
		align-items: center;
		flex-direction:column;
		justify-content: space-between;
		background: $u-info-light;
		overflow-x: hidden;
	}
	
	.prv-next-popup-header {
		font-size: 30rpx;
		font-weight: 600;
		line-height: 120rpx;
		width: 100%;
		text-align: center;
	}
	
	.prv-next-popup-radio {
		height: 590rpx;
		width: 590rpx;
	}
	
	.radio-scroll{
		/* height: 100%; */
		height: 560rpx;
		overflow-y: scroll;
		overscroll-behavior: none;
	}
	
	.prv-next-radio-container{
		border-bottom: 2rpx solid $u-primary;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.bg-color{
		background-color: #fff;
	}
</style>