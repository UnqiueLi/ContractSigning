<template>
	<view>
		<view class="page-container">
			<view class="bg-header"></view>
			<!-- 顶部标题区域 -->
			<view class="top-nav">
				<text class="page-title">创建任务</text>
			</view>
			
			<!-- 表单区域 -->
			<view class="form-container">
				<!-- 基本信息 -->
				<view class="form-card">
					<view class="form-item">
						<view class="form-item-label">发起方</view>
						<view class="form-item-input">
							<u-input v-model="formData.initiator" placeholder="请输入发起方" />
						</view>
					</view>
					<view class="form-line"></view>
					<view class="form-item">
						<view class="form-item-label">主题</view>
						<view class="form-item-input">
							<u-input v-model="formData.title" placeholder="请输入主题" />
						</view>
					</view>
					<view class="form-line"></view>
					<view class="form-item" @click="showTimePicker">
						<view class="form-item-label">截止时间</view>
						<view class="form-item-input time-select">
							<text>{{ formData.deadline || '请选择截止时间' }}</text>
							<u-icon name="arrow-right" color="#C0C4CC" size="28"></u-icon>
						</view>
					</view>
				</view>
				
				<!-- 文档上传 -->
				<view class="form-card">
					<view class="upload-item">
						<view class="upload-title">文档上传</view>
						<view class="upload-btn">
							<view class="custom-upload-btn">添加文档</view>
						</view>
					</view>
				</view>
				
				<!-- 附件上传 -->
				<view class="form-card">
					<view class="upload-item">
						<view class="upload-title">附件上传</view>
						<view class="upload-btn">
							<view class="custom-upload-btn">添加附件</view>
						</view>
					</view>
				</view>
				
				<!-- 参与方 -->
				<view class="form-card">
					<view class="participants-header">
						<view class="participants-title">参与方 (3)</view>
					</view>
					
					<view class="participants-list">
						<view class="participant-item">
							<u-avatar src="/static/image/userInfo.png" size="35"></u-avatar>
							<text class="participant-name">发起方 蓝胖子</text>
							<view class="participant-icon">
								<u-icon name="trash" size="40" style="color: #fab6b6;"></u-icon>
							</view>
						</view>
						<view class="participant-item">
							<u-avatar src="/static/image/userInfo.png" size="35"></u-avatar>
							<text class="participant-name">蓝胖子</text>
							<view class="participant-icon">
								<u-icon name="trash" size="40" style="color: #fab6b6;"></u-icon>
							</view>
						</view>
						<view class="participant-item">
							<u-avatar src="/static/image/userInfo.png" size="35"></u-avatar>
							<text class="participant-name">蓝胖子</text>
							<view class="participant-icon">
								<u-icon name="trash" size="40" style="color: #fab6b6;"></u-icon>
							</view>
						</view>
					</view>
					
					<view class="btn-group">
						<view class="custom-btn" @click="addUser(1)">添加个人</view>
						<view class="custom-btn" @click="addUser(2)">添加企业</view>
					</view>
				</view>
				
				<!-- 抄送 -->
				<!-- <view class="form-card">
					<view class="copy-section">
						<view class="copy-title">抄送</view>
						<view class="copy-links">
							<text class="link-text" @click="addPersonCopy">抄送个人</text>
							<text class="link-text" @click="addCompanyCopy">抄送企业</text>
						</view>
					</view>
				</view> -->
				
				<!-- 签署设置 -->
				<view class="form-card">
					<!-- <view class="sign-item">
						<text class="sign-text">要求签署的必须证书机构为CFCA</text>
						<u-switch v-model="requireCFCA"></u-switch>
					</view> -->
					
					<view class="sign-method">
						<text class="sign-text">签署方式</text>
						<u-radio-group v-model="signMethod">
							<view class="sign-options">
								<view class="sign-option">
									<u-radio name="manual" :checked="signMethod === 'manual'"></u-radio>
									<text class="sign-option-text">手动签署</text>
								</view>
								<view class="sign-option">
									<u-radio name="auto" :checked="signMethod === 'auto'"></u-radio>
									<text class="sign-option-text">自动签署</text>
								</view>
							</view>
						</u-radio-group>
					</view>
				</view>
				
				<!-- 底部按钮 -->
				<view class="bottom-actions">
					<u-button type="primary" class="submit-btn">提交任务</u-button>
				</view>
			</view>
		</view>
		
		<!-- 时间选择器 -->
		<u-picker
			v-model="showPicker"
			mode="time"
			:params="timePickerParams"
			:show-time-tag="true"
			@confirm="onTimeConfirm"
			@cancel="showPicker = false"
		></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				requireCFCA: false,
				signMethod: 'manual',
				formData: {
					initiator: '蓝胖子',
					title: '',
					deadline: ''
				},
				showPicker: false,
				timePickerParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				btnCustomStyle: {
					borderRadius: '8rpx',
					border: '1rpx solid #406DFF',
					color: '#406DFF',
					backgroundColor: '#fff'
				}
			};
		},
		onLoad() {
			
		},
		onShow() {
			// 页面显示时执行
		},
		methods: {
			addUser(id){
				if(id == 1){
					uni.navigateTo({
						url:"/subpkg_create/pages/person/person"
					})
				}else{
					uni.navigateTo({
						url:"/subpkg_create/pages/enterprise/enterprise"
					})
				}
			},
			showTimePicker() {
				this.showPicker = true;
			},
			onTimeConfirm(e) {
				this.formData.deadline = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
				this.showPicker = false;
			},
			addPersonCopy() {
				uni.showToast({
					title: '添加抄送个人',
					icon: 'none'
				});
			},
			addCompanyCopy() {
				uni.showToast({
					title: '添加抄送企业',
					icon: 'none'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f6f9;
	}
	
	.page-container {
		padding-top: calc(var(--status-bar-height) + 120rpx); /* 为顶部导航栏留出空间 */
		padding-bottom: 40rpx; /* 为底部导航留出空间 */
		min-height: calc(100vh - 140rpx);
	}
	
	.bg-header {
		left: 0rpx;
		top: 0rpx;
		width: 100%;
		height: 100vh;
		opacity: 1;
		background: linear-gradient(132.67deg, #9DBCF2 0%, #EAF3FF 53.8%, #F8F9FA 100%);
		position: absolute;
		z-index: -1;
	}
	
	.top-nav {
		padding: 106rpx 0rpx 20rpx 0rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: linear-gradient(110deg, #9DBCF2 0%, #EAF3FF 200%, #F8F9FA 0%);
		box-shadow: 0 2rpx 52rpx rgba(0, 0, 0, 0.1);
	}
	
	.page-title {
		font-size: 30rpx;
		font-weight: 400;
		color: #333;
	}
	
	.form-container {
		padding: 20rpx 30rpx;
	}
	
	.form-card {
		background-color: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.form-item {
		display: flex;
		padding: 0 32rpx;
		align-items: center;
	}
	
	.form-item-label {
		width: 150rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}
	
	.form-item-input {
		flex: 1;
	}
	
	.form-line {
		height: 1rpx;
		background-color: #f5f5f5;
		margin: 0 32rpx;
	}
	
	.time-select {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #606266;
		font-size: 28rpx;
		padding: 20rpx 0;
	}
	
	.upload-item {
		padding: 20rpx 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.upload-title {
		font-size: 28rpx;
		color: #333;
	}
	
	.custom-upload-btn {
		border-radius: 28rpx !important;
		background: #EEF3FF !important;
		font-size: 24rpx !important;
		font-weight: 400 !important;
		letter-spacing: 0rpx !important;
		line-height: 37.64rpx !important;
		color: #5575f1 !important;
		text-align: left !important;
		vertical-align: top !important;
		padding: 8rpx 26rpx;
	}
	
	.participants-header {
		padding: 30rpx 32rpx 20rpx;
	}
	
	.participants-title {
		font-size: 28rpx;
		color: #333;
	}
	
	.participants-list {
		padding: 0 32rpx;
	}
	
	.participant-item {
		display: flex;
		align-items: center;
		padding: 16rpx 0;
		border-bottom: 2rpx solid #f5f5f5;
		image{
			width: 30rpx;
			height: 30rpx;
		}
	}
	
	.participant-name {
		flex: 1;
		margin-left: 20rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.participant-icon {
		color: #999;
	}
	
	.btn-group {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 32rpx;
	}
	
	.custom-btn {
		flex: 1;
		margin: 0 10rpx;
		background-color: #E8EFFF;
		border-radius: 8rpx;
		color: rgba(55, 88, 254, 1);
		font-size: 30rpx;
		font-weight: 500;
		letter-spacing: 0;
		line-height: 30rpx;
		text-align: center;
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.copy-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 32rpx;
	}
	
	.copy-title {
		font-size: 28rpx;
		color: #333;
	}
	
	.copy-links {
		display: flex;
	}
	
	.link-text {
		color: #406DFF;
		font-size: 28rpx;
		margin-left: 30rpx;
	}
	
	.sign-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 32rpx;
		border-bottom: 2rpx solid #f5f5f5;
	}
	
	.sign-text {
		font-size: 28rpx;
		color: #333;
	}
	
	.sign-method {
		padding: 30rpx 32rpx;
	}
	
	.sign-options {
		display: flex;
		margin-top: 20rpx;
	}
	
	.sign-option {
		display: flex;
		align-items: center;
		margin-right: 60rpx;
	}
	
	.sign-option-text {
		font-size: 28rpx;
	}
	
	.bottom-actions {
		margin-top: 40rpx;
	}
	
	.submit-btn {
		width: 100%;
	}
</style>