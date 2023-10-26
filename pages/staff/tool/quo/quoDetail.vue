<!-- 报价查询详情 -->
<!-- 修改存储过程GetQuoPriceByCus -->
<template>
	<view @touchmove.prevent>
		<!-- 列表信息 -->
		<z-paging
			ref="quoDetailList" 
			v-model="config.mock.mockList" 
			:auto-show-system-loading="true"
			:auto="false"
			:default-page-size="25"
			@query="queryMock"
		>
			<view slot="top" style="background-color: #5677FC;">
				<view >
					<u-search
						v-if="formData.dataType == 2"
						v-model="formData.keyWord"
						shape="round"
						:showAction="false"
						placeholder="请输入材质编号"
						margin="30rpx"
						@search="search"
						@clear="clear"
					>
					</u-search>
				</view>
				<u-subsection
					:list="config.subsection.list" 
					:current="formData.dataType"
					@change="subsectionChange"
				></u-subsection>
			</view>
			<uni-card
				v-for="(item, index) in config.mock.mockList" 
				:key="index"
				:title="formData.cusName"
				:extra="formData.cusId"
				:is-shadow="true"
			>
				<view class="card-body-container">
					<template v-if="formData.dataType==0||formData.dataType==1">
						<view class="card-body-item card-body-item-100">
							<text>坑型:
								<text class="mg-left-20">{{ item.flutes }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>层数:
								<text class="mg-left-20">{{ item.layerCount }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>折扣方式:
								<text class="mg-left-20">{{ item.disType }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<view class="card-body-txt blue-color">起始</view>/
							<view class="card-body-txt green-color">终止</view>:
							<view class="card-body-txt blue-color mg-left-20">{{ item.valueBegin }}</view>
							<view class="card-body-txt red-color mg-left-20">{{ item.valueEnd }}</view>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>增减:
								<text class="mg-left-20">{{ item.value }}</text>
							</text>
						</view>
					</template>
					<template v-else>
						<view class="card-body-item card-body-item-100">
							<text>材质编号:
								<text class="mg-left-20">{{ item.boardId }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>材质名称:
								<text class="mg-left-20">{{ item.boardName }}</text>
							</text>
						</view>
						<view class="card-body-item card-body-item-100">
							<text>平方价:
								<text class="mg-left-20">{{ item.unitPrice }}</text>
							</text>
						</view>
					</template>
				</view>
			</uni-card>
			
		</z-paging>
		
	</view>
</template>

<script>
	/* vuex辅助函数 */
	import { mapGetters } from "vuex"
	/* api接口 */
	import { fetchQuoDetailList } from "@/api/staff/tool.js"
	
	export default {
		data() {
			return {
				/* 页面配置 */
				config: {
					/* 模拟上拉加载数据 */
					mock: {
						/* 原始数据 */
						indexList: [],
						/* 模拟数据 */
						mockList: [],
					},
					/* 分段器 */
					subsection: {
						list: ['特别规则', '公共规则', '报价价格']
					},
				},
				formData: {
					/* 数据类型 0->特别规则 1->公共规则 2->报价价格 */
					dataType: 0, 
					/* 搜索关键词 */
					keyWord: null,
					/* 客户 */
					cusId: null,
					/* 客户名称 */
					cusName: null,
				}
			}
		},
		onLoad(options) {
			/* 获取传递的参数 */
			Object.assign(
				this.formData, 
				JSON.parse(decodeURIComponent(options.filterInfo))
			)
			this.$refs.quoDetailList.reload()
		},
		methods: {
			/* 头部分段器改变 */
			subsectionChange( idx ){
				this.formData.dataType = idx
				this.$refs.quoDetailList.reload()
			},
			/* 获取数据 */
			async queryList(){
				this.config.mock.indexList = this.$options.data().config.mock.indexList
				const { result } = await fetchQuoDetailList(this.formData)
				this.config.mock.indexList = result
			},
			/* 模拟上拉加载下拉刷新 */
			async queryMock( pageNo, pageSize ){
				if( pageNo == 1 ){
					await this.queryList()
				}
				
				var subList = []
				
				if( this.config.mock.indexList.length > 0 ){
					subList = this.config.mock.indexList.splice( 0, pageSize )
				}
				
				setTimeout(()=>{
					this.$refs.quoDetailList.complete(subList)
				}, 1500)
			},
			/* 搜索框搜索 */
			search(){
				this.$refs.quoDetailList.reload()
			},
			/* 搜索框清楚 */
			clear(){
				this.formData.keyWord = this.$options.data().formData.keyWord
			}
		},
		computed: {
			/* store中getter数据 */
			...mapGetters({
				pageHeight: "page/pageHeight"
			})
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/card.scss";
	.banner-view {
		background-color: #5677FC;
		width: 100%;
		height: 128rpx;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>