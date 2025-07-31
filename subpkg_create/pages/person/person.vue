<template>
	<view>
		<view class="page-container">
			<view class="bg-header"></view>
			
			<!-- 顶部导航栏 -->
			<view class="top-nav">
				<view class="nav-left" @click="goBack">
					<u-icon name="arrow-left" color="#333" size="40"></u-icon>
				</view>
				<view class="nav-title">添加个人</view>
				<view class="nav-right">
					<u-icon name="more-dot-fill" color="#333" size="40" style="margin-right: 20rpx;"></u-icon>
					<u-icon name="record" color="#333" size="40"></u-icon>
				</view>
			</view>
			
			<!-- 表单内容区域 -->
			<view class="form-content">
				<view class="form-card">
					<!-- 个人名称 -->
					<view class="form-item">
						<view class="form-item-label">个人名称</view>
						<view class="form-item-input">
							<u-input 
								v-model="formData.personalName" 
								placeholder="请输入个人名称(必填)" 
								:border="false"
								class="custom-input"
							/>
							<view class="input-icon">
								<u-icon name="account" color="#C0C4CC" size="40"></u-icon>
							</view>
						</view>
					</view>
					
					<!-- 手机号/邮箱 -->
					<view class="form-item">
						<view class="form-item-label">手机号/邮箱</view>
						<view class="form-item-input">
							<u-input 
								v-model="formData.phoneEmail" 
								placeholder="请输入手机号/邮箱" 
								:border="false"
								class="custom-input"
							/>
						</view>
					</view>
					
					<!-- 真实姓名 -->
					<view class="form-item">
						<view class="form-item-label">真实姓名</view>
						<view class="form-item-input">
							<u-input 
								v-model="formData.realName" 
								placeholder="请输入真实姓名" 
								:border="false"
								class="custom-input"
							/>
						</view>
					</view>
					
					<!-- 证件类型 -->
					<view class="form-item" @click="showIdTypePicker">
						<view class="form-item-label">证件类型</view>
						<view class="form-item-input select-input">
							<text class="select-text">{{ formData.idType || '中国居民身份证' }}</text>
							<u-icon name="arrow-right" color="#C0C4CC" size="28"></u-icon>
						</view>
					</view>
					
					<!-- 证件号 -->
					<view class="form-item">
						<view class="form-item-label">证件号</view>
						<view class="form-item-input">
							<u-input 
								v-model="formData.idNumber" 
								placeholder="请输入证件号" 
								:border="false"
								class="custom-input"
							/>
						</view>
					</view>
					
					<!-- 签署方式 -->
					<view class="form-item" @click="showSignMethodPicker">
						<view class="form-item-label">签署方式</view>
						<view class="form-item-input select-input">
							<text class="select-text">{{ formData.signMethod || '不限制签名方式' }}</text>
							<u-icon name="arrow-right" color="#C0C4CC" size="28"></u-icon>
						</view>
					</view>
					
					<!-- 意愿验证方式 -->
					<view class="form-item" @click="showVerificationPicker">
						<view class="form-item-label">意愿验证方式</view>
						<view class="form-item-input select-input">
							<text class="select-text">{{ formData.verificationMethod || '签署密码、短信验证、人脸识别' }}</text>
							<u-icon name="arrow-right" color="#C0C4CC" size="28"></u-icon>
						</view>
					</view>
					
					<!-- 签署阅读设置 -->
					<view class="form-item">
						<view class="form-item-label">签署阅读设置</view>
						<view class="form-item-input">
							<text class="setting-text">所有文档需阅读至末页才可提交签署</text>
							<u-switch 
								v-model="formData.readingRequired" 
								active-color="#5570F1"
								inactive-color="#E4E7ED"
								size="50"
							></u-switch>
						</view>
					</view>
					
					<view class="form-item">
						<view class="form-item-input">
							<text class="setting-text">阅读固定时长才可提交签署</text>
							<u-switch 
								v-model="formData.fixedReadingTime" 
								active-color="#5570F1"
								inactive-color="#E4E7ED"
								size="50"
							></u-switch>
						</view>
					</view>
					
					<!-- 附件要求 -->
					<view class="form-item">
						<view class="form-item-label">附件要求 <text class="remaining-text">(剩余可用: 9)</text></view>
						<view class="form-item-input">
							<text class="setting-text">要求上传附件</text>
							<u-switch 
								v-model="formData.attachmentRequired" 
								active-color="#5570F1"
								inactive-color="#E4E7ED"
								size="50"
							></u-switch>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 底部按钮 -->
			<view class="bottom-buttons">
				<view class="btn-cancel" @click="goBack">取消</view>
				<view class="btn-save" @click="saveForm">保存</view>
			</view>
		</view>
		
		<!-- 证件类型选择器 -->
		<u-picker 
			:show="showIdType" 
			:columns="[idTypeOptions]" 
			@confirm="onIdTypeConfirm" 
			@cancel="showIdType = false"
		></u-picker>
		
		<!-- 签署方式选择器 -->
		<u-picker 
			:show="showSignMethod" 
			:columns="[signMethodOptions]" 
			@confirm="onSignMethodConfirm" 
			@cancel="showSignMethod = false"
		></u-picker>
		
		<!-- 验证方式选择器 -->
		<u-picker 
			:show="showVerification" 
			:columns="[verificationOptions]" 
			@confirm="onVerificationConfirm" 
			@cancel="showVerification = false"
		></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					personalName: '',
					phoneEmail: '',
					realName: '',
					idType: '中国居民身份证',
					idNumber: '',
					signMethod: '不限制签名方式',
					verificationMethod: '签署密码、短信验证、人脸识别',
					readingRequired: false,
					fixedReadingTime: false,
					attachmentRequired: false
				},
				showIdType: false,
				showSignMethod: false,
				showVerification: false,
				idTypeOptions: [
					'中国居民身份证',
					'护照',
					'军官证',
					'港澳通行证',
					'台湾通行证'
				],
				signMethodOptions: [
					'不限制签名方式',
					'手写签名',
					'电子签名',
					'印章签名'
				],
				verificationOptions: [
					'签署密码、短信验证、人脸识别',
					'仅短信验证',
					'仅人脸识别',
					'仅签署密码'
				]
			};
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 显示证件类型选择器
			showIdTypePicker() {
				this.showIdType = true;
			},
			
			// 显示签署方式选择器
			showSignMethodPicker() {
				this.showSignMethod = true;
			},
			
			// 显示验证方式选择器
			showVerificationPicker() {
				this.showVerification = true;
			},
			
			// 证件类型确认
			onIdTypeConfirm(e) {
				this.formData.idType = e.value[0];
				this.showIdType = false;
			},
			
			// 签署方式确认
			onSignMethodConfirm(e) {
				this.formData.signMethod = e.value[0];
				this.showSignMethod = false;
			},
			
			// 验证方式确认
			onVerificationConfirm(e) {
				this.formData.verificationMethod = e.value[0];
				this.showVerification = false;
			},
			
			// 保存表单
			saveForm() {
				// 验证必填字段
				if (!this.formData.personalName.trim()) {
					uni.showToast({
						title: '请输入个人名称',
						icon: 'none'
					});
					return;
				}
				
				// 验证手机号/邮箱格式
				if (this.formData.phoneEmail && !this.validatePhoneEmail(this.formData.phoneEmail)) {
					uni.showToast({
						title: '请输入正确的手机号或邮箱',
						icon: 'none'
					});
					return;
				}
				
				// 验证身份证号格式
				if (this.formData.idNumber && this.formData.idType === '中国居民身份证' && !this.validateIdNumber(this.formData.idNumber)) {
					uni.showToast({
						title: '请输入正确的身份证号',
						icon: 'none'
					});
					return;
				}
				
				// 保存数据
				console.log('保存的表单数据:', this.formData);
				
				// 返回上一页并传递数据
				const pages = getCurrentPages();
				const prevPage = pages[pages.length - 2];
				if (prevPage) {
					// 触发上一页的方法来接收数据
					prevPage.$vm.addPersonData && prevPage.$vm.addPersonData(this.formData);
				}
				
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
				
				setTimeout(() => {
					this.goBack();
				}, 1500);
			},
			
			// 验证手机号或邮箱
			validatePhoneEmail(value) {
				const phoneRegex = /^1[3-9]\d{9}$/;
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return phoneRegex.test(value) || emailRegex.test(value);
			},
			
			// 验证身份证号
			validateIdNumber(value) {
				const idRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
				return idRegex.test(value);
			}
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
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 100rpx 40rpx 30rpx;
	z-index: 1;
}

.nav-left, .nav-right {
	display: flex;
	align-items: center;
}

.nav-title {
	font-size: 44rpx;
	font-weight: bold;
	color: #333;
}

.form-content {
	position: relative;
	z-index: 1;
	padding: 0 40rpx;
}

.form-card {
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.form-item {
	margin-bottom: 40rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.form-item-label {
	font-size: 32rpx;
	color: #333;
	margin-bottom: 20rpx;
	font-weight: 500;
}

.form-item-input {
	display: flex;
	align-items: center;
	background: #F8F9FA;
	border-radius: 12rpx;
	padding: 24rpx 20rpx;
	position: relative;
}

.custom-input {
	flex: 1;
	background: transparent;
}

.input-icon {
	margin-left: 20rpx;
}

.select-input {
	justify-content: space-between;
	cursor: pointer;
}

.select-text {
	font-size: 30rpx;
	color: #333;
}

.setting-text {
	font-size: 28rpx;
	color: #666;
	flex: 1;
	margin-right: 20rpx;
}

.remaining-text {
	font-size: 24rpx;
	color: #999;
	font-weight: normal;
}

.bottom-buttons {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	padding: 30rpx 40rpx;
	background: #FFFFFF;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	z-index: 10;
}

.btn-cancel, .btn-save {
	flex: 1;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12rpx;
	font-size: 32rpx;
	font-weight: 500;
	margin: 0 10rpx;
}

.btn-cancel {
	background: #F5F5F5;
	color: #666;
}

.btn-save {
	background: #5570F1;
	color: #FFFFFF;
}

// 输入框样式覆盖
:deep(.u-input__input) {
	background: transparent !important;
	font-size: 30rpx !important;
	color: #333 !important;
}

:deep(.u-input__input::placeholder) {
	color: #999 !important;
}
</style> 