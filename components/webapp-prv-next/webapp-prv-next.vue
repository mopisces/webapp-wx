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
				<view :class="config.header.prev.noData?'prv-next-title no-data-color':'prv-next-title'">
					<text v-if="config.header.prev.noData">到顶了</text>
					<text v-else>{{ config.header.prev.data }}</text>
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
				<view :class=" config.header.middle.noData?'prv-next-title no-data-color':'prv-next-title'">
					<text v-if="config.header.middle.noData">未选择</text>
					<text v-else>{{ config.header.middle.data }}</text>
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
				<view :class="config.header.next.noData?'prv-next-title no-data-color':'prv-next-title'">
					<text v-if="config.header.next.noData">到底了</text>
					<text v-else>{{ config.header.next.data }}</text>
				</view>
			</view>
		</view>
		<u-popup
			:show="show" 
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
						<radio-group
							@change="changeRadio"
						>
							<label 
								v-for="(item, index) in radioData" 
								:key="item.value"
								:id=" item.id "
								:ref="item.id"
							>
								<view>
									<view 
										:class=" val == item.prevNext ? 'prv-next-radio-container bg-color' : 'prv-next-radio-container' ">
										<view v-if=" item.tag == 'paperCode' ">
											<view>
												纸类:{{item.paperCode}}
												<view v-if="item.paperName">{{'[' + item.paperName + ']'}}</view>
											</view>
											<view>整卷卷数:{{item.zJCount}}</view>
											<view>残卷卷数:{{item.cJCount}}</view>
											<view>重量:{{item.sRWt}}</view>
										</view>
										<view v-else-if=" item.tag == 'paperWidth' ">
											<view>
												门幅:{{ item.paperWidth }}
											</view>
											<view>整卷卷数:{{item.zJCount}}</view>
											<view>残卷卷数:{{item.cJCount}}</view>
											<view>重量:{{item.sRWt}}</view>
										</view>
										<!-- 客户每日送货 -->
										<view v-else-if=" item.tag == 'deliveryDaily' ">
											<view>{{ item.DNDate }}</view>
											<view>{{ item.ICount }}笔订单</view>
										</view>
										<!-- 客户每日订单 -->
										<view v-else-if=" item.tag == 'dailyOrder' ">
											<view>{{ item.orderDate }}</view>
											<view>{{ item.iCount }}笔订单</view>
										</view>
										<view v-else-if=" item.tag == 'takeDelivery' ">
											<view>{{ item.recDate }}</view>
											<view>{{ item.inQty }}件</view>
											<view>{{ item.sumInWt }}kg</view>
										</view>
										<!-- 原纸日用量 -->
										<view v-else-if=" item.tag == 'dailyUsed' ">
											<view>{{ item.outDate }}</view>
											<view>整卷卷数:{{ item.zJCount }}</view>
											<view>残卷卷数:{{ item.cJCount }}</view>
											<view>重量:{{ item.sRWt }}</view>
										</view>
										<!-- 原纸采购 -->
										<view v-else-if=" item.tag == 'paperProcure' ">
											<view>日期信息:{{ item.prevNext }}</view>
										</view>
										<radio
											:value="item.prevNext" 
											:checked=" val == item.prevNext " 
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
			value: {
				default: null
			},
			popupShow: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				resetRadio: false,
				/* 原始数据 */
				radioData: [],
				config: {
					scroll: {
						anchor: null,
						scrollTop: '',
					},
					popup: {
						show: false
					},
					header: {
						index: 0,
						prev: {
							noData: true,
							data: null
						},
						next: {
							noData: true,
							data: null
						},
						middle: {
							noData: true,
							data: null
						}
					}
				},
				isActive: 0,
			}
		},
		methods: {
			headerChange( type ){
				if( this.radioData.length == 0 ){
					return 
				}
				if( type == 'prev' ){
					this.config.header.index--
					if( this.config.header.index <= 0 ){
						this.config.header.index = 0
					}
				}
				if( type == 'next' ){
					this.config.header.index++
					if( this.config.header.index >= this.radioData.length ){
						this.config.header.index = this.radioData.length - 1 
					}
				}
				this.isActive = this.config.header.index
				this.val = this.radioData[ this.config.header.index ].prevNext
				this.controllerPrevNext()
			},
			middleClick(){
				if( this.radioData.length == 0 ){
					return 
				}
				this.val = this.radioData[ this.config.header.index ].prevNext
				this.$emit("update:popupShow", true)
			},
			controllerPrevNext(){
				let prev = Number(this.config.header.index) - 1
				let next = Number(this.config.header.index) + 1
				if( this.radioData[ prev ] == undefined ){
					this.config.header.prev = this.$options.data().config.header.prev
				}else{
					this.config.header.prev.noData = false
					this.config.header.prev.data = this.radioData[ prev ].prevNext
				}
				if( this.radioData[ next ] == undefined ){
					this.config.header.next = this.$options.data().config.header.next
				}else{
					this.config.header.next.noData = false
					this.config.header.next.data = this.radioData[ next ].prevNext
				}
				if( this.radioData[ this.config.header.index ] == undefined ){
					this.config.header.middle = this.$options.data().config.header.middle
				}else{
					this.config.header.middle.noData = false
					this.config.header.middle.data = this.radioData[ this.config.header.index ].prevNext
				}
				this.$emit("radioConfirm", this.config.header.middle.data)
			},
			close(){
				this.$emit("update:popupShow", false)
				this.config.scroll.scrollTop = 0
			},
			async open(){
				this.$nextTick(() => {
					if( this.config.scroll.anchor == null ){
						uni.createSelectorQuery()
						.in(this)
						.select("#" + this.radioData[0].id)
						.boundingClientRect(data=>{
							this.config.scroll.anchor = data.top
						}).exec()
					}
					uni.createSelectorQuery()
					.in(this)
					.select("#" + this.radioData[this.config.header.index].id)
					.boundingClientRect(data=>{
						this.config.scroll.scrollTop = data.top - this.config.scroll.anchor
					}).exec()
				})
			},
			changeRadio( evt ) {
				for (let i = 0; i < this.radioData.length; i++) {
					if (this.radioData[i].prevNext == evt.detail.value) {
						this.config.header.index = i
						this.config.scroll.toView = this.radioData[i].id
						this.val = evt.detail.value
						break;
					}
				}
				this.controllerPrevNext()
				this.close()
			},
			complete( radioData ){
				this.config = this.$options.data().config
				this.isActive = this.$options.data().isActive
				
				if( radioData.length == 0 ){
					this.val = null
					this.radioData = radioData
					this.$emit("radioConfirm", null)
				}else{
					this.val = radioData[0].prevNext
					this.radioData = radioData
					this.controllerPrevNext()
				}
			}
		},
		computed:{
			val: {
				get(){
					return this.$props.value
				},
				set( value ){
					this.$emit("update:value", value)
				}
			},
			show:{
				get(){
					return this.$props.popupShow
				},
				set( value ){
					this.$emit("update:popupShow", value)
				}
			}
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
		min-height: 100rpx;
	}
	
	.bg-color{
		background-color: #fff;
	}
	
	.no-data-color{
		color: gray;
	}
</style>