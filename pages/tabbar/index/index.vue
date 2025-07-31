<template>
	<view class="page-container">
		<!-- 背景图片组件 -->
		<image class="bg-image" src="/static/image/bgImg.png" mode="widthFix"></image>

		<!-- 固定导航区 -->
		<view class="fixed-nav" :class="{'fixed-nav-sticky': isNavFixed}">
			<!-- 顶部菜单栏 -->
			<view class="top-menu" style="height: 150rpx;">
				<!-- 此处可添加顶部菜单栏内容 -->
			</view>

			<!-- 顶部搜索栏 -->
			<view class="search-box">
				<u-search placeholder="请输入想搜索的名词" v-model="keyword" :show-action="false" :clearabled="true"
					shape="round"></u-search>
			</view>
		</view>

		<!-- 顶部背景区域 -->
		<view class="bg-content" :style="{'padding-top': isNavFixed ? (fixedNavHeight + 'px') : '0'}">
			<!-- 占位区域，当导航固定时显示 -->
			<view v-if="isNavFixed" style="height: 20rpx;"></view>

			<!-- 用户信息区 -->
			<view class="user-info">
				<view class="user-avatar-box">
					<image class="user-avatar" :src="userAvatar" mode="aspectFill"></image>
				</view>
				<view class="user-detail">
					<view class="username">{{userName}}</view>
					<view class="seal-count">可用签章的数：{{sealCount}}</view>
				</view>
				<view class="verify-icon">
					<image src="/static/image/bgLogo.png" mode="" style="width: 136rpx;height: 100rpx;"></image>
				</view>
			</view>

			<!-- 数据统计区 -->
			<view class="stats-box">
				<view class="stats-row top-row">
					<view class="stats-item">
						<view class="stats-num">{{statsData.created}}</view>
						<view class="stats-label">我创建的</view>
					</view>
					<view class="stats-item">
						<view class="stats-num">{{statsData.received}}</view>
						<view class="stats-label">我收到的</view>
					</view>
					<view class="stats-item">
						<view class="stats-num">{{statsData.toReview}}</view>
						<view class="stats-label">待送审的</view>
					</view>
					<view class="stats-item">
						<view class="stats-num">{{statsData.myPending}}</view>
						<view class="stats-label">待我方处理</view>
					</view>
				</view>
				<view class="stats-row bottom-row">
					<view class="stats-item">
						<view class="stats-num">{{statsData.otherPending}}</view>
						<view class="stats-label">待他方处理</view>
					</view>
					<view class="stats-item">
						<view class="stats-num">{{statsData.expiring}}</view>
						<view class="stats-label">即将截止</view>
					</view>
					<view class="stats-item">
						<view class="stats-num">{{statsData.completed}}</view>
						<view class="stats-label">已审完成</view>
					</view>
					<view class="stats-item"></view> <!-- 空占位 -->
				</view>
			</view>
		</view>

		<!-- 最近签署列表 -->
		<view class="recent-signed">
			<view class="section-title">最近签署列表</view>

			<view class="contract-list">
				<view class="contract-item" v-for="(item, index) in contractList" :key="index">
					<view class="contract-icon">
						<image src="/static/image/iconList.png" mode="" style="width: 72rpx;height: 72rpx;"></image>
					</view>
					<view class="contract-info">
						<view class="contract-title">{{item.title}}</view>
						<view class="contract-tags">
							<text class="tag" v-for="(tag, idx) in item.tags" :key="idx">{{tag}}</text>
						</view>
						<view class="contract-from">发起方: {{item.from}}</view>
					</view>
					<view class="contract-action">
						<button class="view-btn" @click="viewContract(item.id)">去查看</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		userApi
	} from '../../../api/user.js';
	import settings from '../../../common/settings.js';
	import {
		orderApi
	} from '../../../api/order.js';

	export default {
		data() {
			return {
				userId: "",
				httpUrl: "",
				keyword: "",
				userAvatar: "/static/image/profilePicture.png",
				userName: "蓝群子",
				sealCount: 0,
				statsData: {
					created: 16,
					received: 2,
					toReview: 2,
					myPending: 6,
					otherPending: 0,
					expiring: 0,
					completed: 28
				},
				contractList: [],
				pageStyle: {
					backgroundImage: 'url(/static/image/bgImg.png)',
					backgroundRepeat: 'no-repeat',
					backgroundSize: '100%',
					backgroundPosition: 'top'
				},
				isNavFixed: false,
				fixedNavHeight: 0,
				scrollTop: 0,
				navFixedThreshold: 50
			}
		},
		onLoad() {
			this.httpUrl = settings.devUrl
			this.getUserInfo()
			this.getContractList()
			// 获取固定导航的高度
			this.getFixedNavHeight()
		},
		onPageScroll(e) {
			// 监听页面滚动
			this.scrollTop = e.scrollTop
			this.checkNavFixed()
		},
		methods: {
			// 检查导航栏是否需要固定
			checkNavFixed() {
				if (this.scrollTop > this.navFixedThreshold && !this.isNavFixed) {
					this.isNavFixed = true
				} else if (this.scrollTop <= this.navFixedThreshold && this.isNavFixed) {
					this.isNavFixed = false
				}
			},
			
			// 获取固定导航的高度
			getFixedNavHeight() {
				const query = uni.createSelectorQuery()
				query.select('.fixed-nav').boundingClientRect(data => {
					if (data) {
						this.fixedNavHeight = data.height
					}
				}).exec()
			},
			
			// 获取用户信息
			getUserInfo() {
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo && userInfo !== '') {
					this.userId = userInfo.user?.userId
					if (userInfo.user?.avatar) {
						this.userAvatar = userInfo.user.avatar
					}
					if (userInfo.user?.userName) {
						this.userName = userInfo.user.userName
					}
				}
			},

			// 获取合同列表
			getContractList() {
				// 这里模拟获取数据，实际项目中应使用真实API
				// orderApi.getContractList().then(res => {
				//   this.contractList = res.data
				// })

				// 模拟数据
				this.contractList = [{
						id: '1',
						title: '租赁服务合同',
						tags: ['房屋租赁', '设备/物品租赁'],
						from: '内蒙古某某某科技有限公司'
					},
					{
						id: '2',
						title: '虚拟资产交易合同',
						tags: ['资源买卖', '设备/物品租赁'],
						from: '内蒙古某某某科技有限公司'
					},
					{
						id: '3',
						title: '租赁服务合同',
						tags: ['房屋租赁', '设备/物品租赁'],
						from: '内蒙古某某某科技有限公司'
					},
					{
						id: '4',
						title: '租赁服务合同',
						tags: ['房屋租赁', '设备/物品租赁'],
						from: '内蒙古某某某科技有限公司'
					},
					{
						id: '5',
						title: '租赁服务合同',
						tags: ['房屋租赁', '设备/物品租赁'],
						from: '内蒙古某某某科技有限公司'
					}
				]
			},

			// 查看合同详情
			viewContract(id) {
				uni.navigateTo({
					url: '/subpkg_index/pages/contract/detail?id=' + id
				})
			},

			// 接口请求示例
			getList() {
				// 轮播图接口
				userApi.bannerList().then(res => {
					console.log(res)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {

		background-color: #f5f6f9;
	}

	/* 背景图片样式 */
	.bg-image {
		position: absolute; /* 从fixed改为absolute，允许随页面滚动 */
		top: -80rpx;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: -1;
	}

	/* 固定导航样式 */
	.fixed-nav {
		width: 100%;
		padding: 0 40rpx;
		box-sizing: border-box;
		background-color: transparent;
		z-index: 10;
		transition: all 0.3s;
	}
	
	.fixed-nav-sticky {
		position: fixed;
		top: 0;
		left: 0;
		background-color: #4B7BEC;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.bg-content {
		width: 100%;
		padding: 0 40rpx 0rpx 40rpx;
		box-sizing: border-box;
		background-color: transparent;
		position: relative;
	}

	.page-container {
		padding: 0;
		min-height: 100vh;
		position: relative;
		z-index: 1;
	}

	.top-menu {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 20rpx;
	}

	.search-box {
		padding: 20rpx 0;
	}

	.user-info {
		border-radius: 16rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		position: relative;
		color: #FFFFFF;
		margin-top: 34rpx;

		.user-avatar-box {
			margin-right: 20rpx;
		}

		.user-avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}

		.user-detail {
			flex: 1;

			.username {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}

			.seal-count {
				font-size: 26rpx;
				color: #FFFFFF;
			}
		}

		.verify-icon {
			position: absolute;
			right: 30rpx;
			top: 100rpx;
		}
	}

	.stats-box {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.stats-row {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;

			&.bottom-row {
				margin-bottom: 0;
			}
		}

		.stats-item {
			flex: 1;
			text-align: center;
			padding: 10rpx 0;

			.stats-num {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 5rpx;
			}

			.stats-label {
				font-size: 24rpx;
				color: #666;
			}
		}
	}

	.recent-signed {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 20rpx;
		margin: 0 40rpx 40rpx;

		.section-title {
			font-size: 30rpx;
			font-weight: bold;
			padding: 20rpx;
			border-bottom: 2rpx solid #f0f0f0;
			margin-bottom: 10rpx;
		}

		.contract-item {
			display: flex;
			padding: 20rpx 0;
			border-bottom: 2rpx solid #f0f0f0;

			&:last-child {
				border-bottom: none;
			}

			.contract-icon {
				margin-right: 20rpx;
				width: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.contract-info {
				flex: 1;

				.contract-title {
					font-size: 28rpx;
					font-weight: 500;
					margin-bottom: 10rpx;
				}

				.contract-tags {
					margin-bottom: 10rpx;

					.tag {
						display: inline-block;
						font-size: 22rpx;
						color: #4B7BEC;
						background-color: #ECF1FC;
						padding: 4rpx 12rpx;
						border-radius: 6rpx;
						margin-right: 10rpx;
					}
				}

				.contract-from {
					font-size: 24rpx;
					color: #666;
				}
			}

			.contract-action {
				display: flex;
				align-items: center;

				.view-btn {
					font-size: 24rpx;
					color: #4B7BEC;
					background-color: transparent;
					border: 1rpx solid #4B7BEC;
					border-radius: 30rpx;
					padding: 8rpx 20rpx;
					line-height: 1.2;
					margin: 0;
				}
			}
		}
	}
</style>