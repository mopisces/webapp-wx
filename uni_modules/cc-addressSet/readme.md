# cc-addressSet

#### 使用方法 
```使用方法
<!-- color：主题色 addressList:地址管理数据 @chooseClick：选择事件 @editClick：编辑事件  -->
<cc-addressSet :colors="colors" :addressList="addressList" @chooseClick="chooseClick"
			@editClick="editClick"></cc-addressSet>	

<!-- 设置数据 -->					
colors: '#fbbd08',
				addressList: [{
					name: '小明',
					phone: '12345678915',
					address: '佛山市南海区',
					moreAddres: '桂城街道',
					isdefult: 1,
					id: 1
				}, {
					name: '小红',
					phone: '12345678915',
					address: '广州市海珠区',
					moreAddres: '昌岗路15号',
					isdefult: 0,
					id: 2
				}],

```

#### HTML代码实现部分
```html
<template>
	<view>

		<!-- color：主题色 addressList:地址管理数据 @chooseClick：选择事件 @editClick：编辑事件  -->
		<cc-addressSet :colors="colors" :addressList="addressList" @chooseClick="chooseClick"
			@editClick="editClick"></cc-addressSet>

		<view class="save">
			<view class="btn" :style="'background:' + colors" @tap="addAddress">添加收货地址</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				colors: '#fbbd08',
				addressList: [{
					name: '小明',
					phone: '12345678915',
					address: '佛山市南海区',
					moreAddres: '桂城街道',
					isdefult: 1,
					id: 1
				}, {
					name: '小红',
					phone: '12345678915',
					address: '广州市海珠区',
					moreAddres: '昌岗路15号',
					isdefult: 0,
					id: 2
				}],

			};
		},


		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {

		},


		methods: {
			// 编辑地址
			editClick(item) {
				uni.showModal({
					title: '点击编辑条目',
					content: '点击编辑条目' + JSON.stringify(item)
				})
			},
			chooseClick(item){
				
				uni.showModal({
					title: '点击选择条目',
					content: '点击选择条目' + JSON.stringify(item)
				})
			},
			// 增加地址
			addAddress() {
				
			},
		}
	};
</script>
<style lang="scss" scoped>
	.save {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.save view {
		display: flex;
	}

	.save .btn {
		box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.4);
		width: 70%;
		height: 80upx;
		border-radius: 80upx;
		background-color: #f23a3a;
		color: #fff;
		justify-content: center;
		align-items: center;
		font-size: 30upx;
		margin-bottom: 60px;
	}
</style>



```