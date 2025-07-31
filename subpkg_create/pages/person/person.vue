<template>
	<view>
		<view class="page-container">
			<view class="bg-header"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.page-container {
	position: relative;
	min-height: 100vh;
	background-color: #F5F7FA;
	padding-bottom: 120rpx;
}

.bg-header {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 260rpx;
	background: linear-gradient(180deg, #D4E2F8 0%, #F5F7FA 100%);
	z-index: 0;
}

.top-nav {
	position: relative;
	padding: 100rpx 40rpx 30rpx;
	z-index: 1;
}

.page-title {
	font-size: 44rpx;
	font-weight: bold;
	color: #333;
}

</style> 