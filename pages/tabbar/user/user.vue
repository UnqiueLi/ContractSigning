<template>
	<view>
		<view class="page-container">
			<view class="bg-header">
			</view>

			<!-- 顶部标题区域 -->
			<view class="top-nav">
				<text class="page-title">我的</text>
			</view>

			<view class="header-section">
				<view class="avatar">
					<image class="avatar-img" src="/static/image/bg-header.png" mode=""></image>
				</view>
				<view class="login-info">
					<view class="login-title">登录</view>
					<view class="login-subtitle">Hi,欢迎加入体验更多功能</view>
				</view>
			</view>

			<!-- 菜单列表 -->
			<view class="menu-list">
				<view class="menu-item" @click="goToAuthentication">
					<view class="menu-left">
						<image src="/static/image/icon2.png" mode="aspectFit" class="menu-icon blue-icon"></image>
						<text class="menu-title">实名认证</text>
					</view>
					<view class="menu-right">
						<u-icon name="arrow-right" color="#c0c4cc"></u-icon>
					</view>
				</view>
			</view>

			<!-- 退出登录按钮 -->
			<view class="logout-btn-wrap">
				<button class="logout-btn" @click="logout">退出登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLoggedIn: false
			};
		},
		onLoad() {
			// 检查登录状态
			this.checkLoginStatus();
		},
		onShow() {
			// 页面显示时重新检查登录状态
			this.checkLoginStatus();
		},
		methods: {
			// 检查登录状态
			checkLoginStatus() {
				const token = uni.getStorageSync('token');
				this.isLoggedIn = !!token;
			},
			// 跳转到实名认证
			goToAuthentication() {
				if (!this.isLoggedIn) {
					this.goToLogin();
					return;
				}

				uni.navigateTo({
					url: '/subpkg_index/pages/authentication/index'
				});
			},

			// 跳转到登录页
			goToLogin() {
				uni.navigateTo({
					url: '/subpkg_login/pages/login/login'
				});
			},

			// 退出登录
			logout() {
				if (!this.isLoggedIn) {
					this.goToLogin();
					return;
				}

				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							// 清除登录信息
							uni.removeStorageSync('token');
							uni.removeStorageSync('userInfo');
							this.isLoggedIn = false;

							uni.showToast({
								title: '已退出登录',
								icon: 'none'
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f6f9;
	}

	.bg-header {
		left: 0rpx;
		top: 0rpx;
		width: 100%;
		height: 800rpx;
		opacity: 1;
		border-radius: 0rpx 0rpx 16rpx 16rpx;
		background: linear-gradient(132.67deg, #9DBCF2 0%, #EAF3FF 53.8%, #F8F9FA 100%);
		position: absolute;
		z-index: -1;
	}

	.page-container {
		padding-top: var(--status-bar-height);
	}

	.top-nav {
		padding: 60rpx 0rpx 0rpx 0rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.page-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
	}

	.header-section {
		padding: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		background-color: #f0f0f0;
		overflow: hidden;
		margin-right: 30rpx;
	}

	.avatar-img {
		width: 324rpx;
		height: 232rpx;
		position: absolute;
		right: 0;
		top: 149rpx;
		z-index: -1;
	}

	.login-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.login-title {
		font-size: 36rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 10rpx;
	}

	.login-subtitle {
		font-size: 24rpx;
		color: #999;
	}

	/* 菜单列表 */
	.menu-list {
		margin: 40rpx 30rpx 30rpx 30rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.menu-item:last-child {
		border-bottom: none;
	}

	.menu-left {
		display: flex;
		align-items: center;
	}

	.menu-title {
		margin-left: 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.menu-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.blue-icon {
		/* 这里设置蓝色图标，如果没有蓝色图标可以通过样式来改变颜色 */
	}

	.menu-right {
		color: #c0c4cc;
	}

	/* 退出登录按钮 */
	.logout-btn-wrap {
		padding: 0 30rpx;
		position: fixed;
		bottom: 100rpx;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		z-index: 1;
	}

	.logout-btn {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		border-radius: 12rpx;
		background-color: #f5f7fb;
		color: #999999;
		font-size: 32rpx;
		border: 2rpx solid #D5D5D5;
	}

	/* 去除按钮边框 */
	button::after {
		border: none;
	}
</style>