<template>
	<view class="custom-tab-bar">
		<view class="tab-item" :class="{'active': active === 'index'}" @click="switchTab('index')">
			<image class="tab-icon" :src="active === 'index' ? '/static/tabbar/home-active.png' : '/static/tabbar/home.png'"></image>
			<text class="tab-text">首页</text>
		</view>
		<view class="tab-item" :class="{'active': active === 'create'}" @click="switchTab('create')">
			<image class="tab-icon" :src="active === 'create' ? '/static/tabbar/create-active.png' : '/static/tabbar/create.png'"></image>
			<text class="tab-text">创建</text>
		</view>
		<view class="tab-item" :class="{'active': active === 'user'}" @click="switchTab('user')">
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
			}
		},
		data() {
			return {}
		},
		methods: {
			// 切换底部选项卡
			switchTab(tab) {
				if (tab === this.active) return;
				
				if (tab === 'index') {
					uni.switchTab({
						url: '/pages/tabbar/index/index'
					});
				} else if (tab === 'create') {
					uni.switchTab({
						url: '/pages/tabbar/create/create'
					});
				} else if (tab === 'user') {
					uni.switchTab({
						url: '/pages/tabbar/user/user'
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
		
		&.active {
			.tab-text {
				color: #4B7BEC;
			}
		}
		
		.tab-icon {
			width: 48rpx;
			height: 48rpx;
			margin-bottom: 6rpx;
		}
		
		.tab-text {
			font-size: 24rpx;
			color: #999;
		}
	}
}
</style>