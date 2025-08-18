<template>
	<view class="custom-tab-bar">
		<view class="tab-item" :class="{'active': active === 'index', 'loading': isLoading}" @click="switchTab('index')">
			<image class="tab-icon" :src="active === 'index' ? '/static/tabbar/home-active.png' : '/static/tabbar/home.png'"></image>
			<text class="tab-text">首页</text>
		</view>
		<view class="tab-item" :class="{'active': active === 'create', 'loading': isLoading}" @click="switchTab('create')">
			<image class="tab-icon" :src="active === 'create' ? '/static/tabbar/create-active.png' : '/static/tabbar/create.png'"></image>
			<text class="tab-text">创建</text>
		</view>
		<view class="tab-item" :class="{'active': active === 'user', 'loading': isLoading}" @click="switchTab('user')">
			<image class="tab-icon" :src="active === 'user' ? '/static/tabbar/user-active.png' : '/static/tabbar/user.png'"></image>
			<text class="tab-text">我的</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "v-bottom-menu",
		props: {
			active: {
				type: String,
				default: 'index'
			},
			showBadge: {
				type: Boolean,
				default: false
			},
			badgeText: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				isLoading: false
			}
		},
		watch: {
			active: {
				handler(newVal, oldVal) {
					console.log(`底部导航切换: ${oldVal} -> ${newVal}`);
				},
				immediate: true
			}
		},
		methods: {
			// 切换底部选项卡
			switchTab(tab) {
				if (tab === this.active || this.isLoading) return;
				
				this.isLoading = true;
				
				try {
					if (tab === 'index') {
						uni.switchTab({
							url: '/pages/tabbar/index/index',
							success: () => {
								this.isLoading = false;
							},
							fail: (err) => {
								console.error('切换到首页失败:', err);
								this.isLoading = false;
								uni.showToast({
									title: '页面切换失败',
									icon: 'none'
								});
							}
						});
					} else if (tab === 'create') {
						uni.switchTab({
							url: '/pages/tabbar/create/create',
							success: () => {
								this.isLoading = false;
							},
							fail: (err) => {
								console.error('切换到创建页面失败:', err);
								this.isLoading = false;
								uni.showToast({
									title: '页面切换失败',
									icon: 'none'
								});
							}
						});
					} else if (tab === 'user') {
						uni.switchTab({
							url: '/pages/tabbar/user/user',
							success: () => {
								this.isLoading = false;
							},
							fail: (err) => {
								console.error('切换到用户页面失败:', err);
								this.isLoading = false;
								uni.showToast({
									title: '页面切换失败',
									icon: 'none'
								});
							}
						});
					}
				} catch (error) {
					console.error('切换页面时发生错误:', error);
					this.isLoading = false;
					uni.showToast({
						title: '页面切换失败',
						icon: 'none'
					});
				}
			}
		}
	}
</script>

<style lang="scss">
/* 自定义底部导航栏样式 */
.custom-tab-bar {
	height: 188rpx; 
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	background-color: #FFFFFF;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	display: flex;
	justify-content: space-around;
	align-items: center;
	z-index: 99;
	padding-bottom: env(safe-area-inset-bottom);
	
	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		transition: all 0.2s ease;
		position: relative;
		
		&:active {
			transform: scale(0.95);
			opacity: 0.8;
		}
		
		&.active {
			.tab-text {
				color: #4B7BEC;
				font-weight: 500;
			}
			
			.tab-icon {
				transform: scale(1.1);
			}
		}
		
		&.loading {
			opacity: 0.6;
			pointer-events: none;
			
			.tab-icon {
				animation: pulse 1s infinite;
			}
		}
		
		.tab-icon {
			width: 48rpx;
			height: 48rpx;
			margin-bottom: 6rpx;
			transition: transform 0.2s ease;
		}
		
		.tab-text {
			font-size: 24rpx;
			color: #999;
			transition: color 0.2s ease;
		}
			}
	}
	
	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}
</style>