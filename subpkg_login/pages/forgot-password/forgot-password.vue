<template>
	<view>
		<!-- 顶部背景 -->
		<view class="bg-header"></view>
		<!-- 标题 -->
		<view class="title-container">
			<text class="subtitle">请输入您的手机号，我们将发送验证码帮您重置密码</text>
		</view>

		<!-- 表单容器 -->
		<view class="form-container">
			<!-- 手机号输入 -->
			<view class="input-group">
				<view class="input-label">手机号</view>
				<view class="input-box">
					<input 
						class="input-field" 
						type="number" 
						placeholder="请输入手机号" 
						maxlength="11"
						v-model="phoneNumber"
						@input="validatePhone"
					/>
				</view>
			</view>

			<!-- 验证码输入 -->
			<view class="input-group">
				<view class="input-label">验证码</view>
				<view class="input-box verification-box">
					<input 
						class="input-field verification-input" 
						type="number" 
						placeholder="请输入验证码" 
						maxlength="6"
						v-model="verificationCode"
					/>
					<button 
						class="send-code-btn" 
						:class="{ 'disabled': !canSendCode }"
						:disabled="!canSendCode"
						@click="sendVerificationCode"
					>
						{{ codeButtonText }}
					</button>
				</view>
			</view>

			<!-- 新密码输入 -->
			<view class="input-group">
				<view class="input-label">新密码</view>
				<view class="input-box">
					<input 
						class="input-field" 
						:type="showPassword ? 'text' : 'password'" 
						placeholder="请输入新密码（6-20位）" 
						maxlength="20"
						v-model="newPassword"
						@input="validatePassword"
					/>
					<view class="password-toggle" @click="togglePasswordVisibility">
						<text class="toggle-icon">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</text>
					</view>
				</view>
			</view>

			<!-- 确认密码输入 -->
			<view class="input-group">
				<view class="input-label">确认密码</view>
				<view class="input-box">
					<input 
						class="input-field" 
						:type="showConfirmPassword ? 'text' : 'password'" 
						placeholder="请再次输入新密码" 
						maxlength="20"
						v-model="confirmPassword"
						@input="validateConfirmPassword"
					/>
					<view class="password-toggle" @click="toggleConfirmPasswordVisibility">
						<text class="toggle-icon">{{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}</text>
					</view>
				</view>
			</view>

			<!-- 密码强度提示 -->
			<view class="password-strength" v-if="newPassword">
				<text class="strength-text">密码强度：</text>
				<view class="strength-bars">
					<view 
						class="strength-bar" 
					></view>
					<view 
						class="strength-bar" 
					></view>
					<view 
						class="strength-bar" 
					></view>
				</view>
				<text class="strength-label">{{ getStrengthText() }}</text>
			</view>

			<!-- 重置密码按钮 -->
			<view class="reset-btn-box">
				<button 
					class="reset-btn" 
					:class="{ 'disabled': !canSubmit }"
					:disabled="!canSubmit"
					@click="resetPassword"
				>
					重置密码
				</button>
			</view>

			<!-- 返回登录 -->
			<view class="back-to-login" @click="goToLogin">
				<text class="back-to-login-text">想起密码了？</text>
				<text class="back-to-login-link">返回登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneNumber: '',
				verificationCode: '',
				newPassword: '',
				confirmPassword: '',
				showPassword: false,
				showConfirmPassword: false,
				countdown: 0,
				timer: null,
				isPhoneValid: false,
				isPasswordValid: false,
				isConfirmPasswordValid: false
			}
		},
		computed: {
			canSendCode() {
				return this.isPhoneValid && this.countdown === 0;
			},
			canSubmit() {
				return this.isPhoneValid && 
					   this.verificationCode.length === 6 && 
					   this.isPasswordValid && 
					   this.isConfirmPasswordValid;
			},
			codeButtonText() {
				return this.countdown > 0 ? `${this.countdown}s后重发` : '发送验证码';
			},
		},
		methods: {
			// 跳转到登录页
			goToLogin() {
				uni.navigateTo({
					url: '/subpkg_login/pages/login/login'
				});
			},

			// 验证手机号
			validatePhone() {
				const phoneRegex = /^1[3-9]\d{9}$/;
				this.isPhoneValid = phoneRegex.test(this.phoneNumber);
			},

			// 验证密码
			validatePassword() {
				const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@#$%^&*!]{6,20}$/;
				this.isPasswordValid = passwordRegex.test(this.newPassword);
			},

			// 验证确认密码
			validateConfirmPassword() {
				this.isConfirmPasswordValid = this.newPassword === this.confirmPassword && this.confirmPassword.length > 0;
			},

			// 切换密码显示
			togglePasswordVisibility() {
				this.showPassword = !this.showPassword;
			},

			// 切换确认密码显示
			toggleConfirmPasswordVisibility() {
				this.showConfirmPassword = !this.showConfirmPassword;
			},

			// 发送验证码
			sendVerificationCode() {
				if (!this.canSendCode) return;

				// 显示加载提示
				uni.showLoading({
					title: '发送中...'
				});

				// 模拟发送验证码
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '验证码已发送',
						icon: 'success'
					});

					// 开始倒计时
					this.countdown = 60;
					this.timer = setInterval(() => {
						this.countdown--;
						if (this.countdown <= 0) {
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000);
				}, 1000);
			},

			// 重置密码
			resetPassword() {
				if (!this.canSubmit) return;

				// 显示加载提示
				uni.showLoading({
					title: '重置中...'
				});

				// 模拟重置密码
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '密码重置成功',
						icon: 'success'
					});

					// 延迟跳转到登录页
					setTimeout(() => {
						this.goToLogin();
					}, 1500);
				}, 2000);
			},

			

			// 获取密码强度文本
			getStrengthText() {
				const strength = this.getPasswordStrength();
				const texts = ['', '弱', '中', '强'];
				return texts[strength];
			},

			// 计算密码强度
			getPasswordStrength() {
				if (!this.newPassword) return 0;
				
				let score = 0;
				if (this.newPassword.length >= 6) score++;
				if (/[a-z]/.test(this.newPassword) && /[A-Z]/.test(this.newPassword)) score++;
				if (/\d/.test(this.newPassword)) score++;
				if (/[^a-zA-Z0-9]/.test(this.newPassword)) score++;
				
				if (score <= 1) return 1;
				if (score <= 2) return 2;
				return 3;
			}
		},
		onUnload() {
			// 清除定时器
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		}
	}
</script>

<style lang="scss">
	.page {
		background: linear-gradient(156.76deg, #D4E2F8 0%, #F8F9FA 100%);
		min-height: 100vh;
		padding-bottom: 100rpx;
	}

	.bg-header {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 350rpx;
		background: url('/static/image/bg-header.png') no-repeat;
		background-size: 100% 100%;
		z-index: -1;
	}

	.back-btn {
		position: fixed;
		top: 60rpx;
		left: 30rpx;
		width: 60rpx;
		height: 60rpx;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.back-icon {
		font-size: 40rpx;
		color: #333;
		font-weight: bold;
	}

	.title-container {
		padding: 120rpx 30rpx 60rpx;
		text-align: center;
	}

	.title {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.subtitle {
		display: block;
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
	}

	.form-container {
		padding: 0 30rpx;
	}

	.input-group {
		margin-bottom: 40rpx;
	}

	.input-label {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;
		font-weight: 500;
	}

	.input-box {
		position: relative;
		background: #ffffff;
		border-radius: 16rpx;
		padding: 0 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		display: flex;
		align-items: center;
	}

	.input-field {
		flex: 1;
		height: 90rpx;
		font-size: 30rpx;
		color: #333;
	}

	.verification-box {
		padding-right: 0;
	}

	.verification-input {
		padding-right: 20rpx;
	}

	.send-code-btn {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #4a79f3;
		color: #ffffff;
		font-size: 26rpx;
		border-radius: 35rpx;
		margin-right: 20rpx;
		box-shadow: 0 4rpx 8rpx rgba(74, 121, 243, 0.3);
	}

	.send-code-btn.disabled {
		background: #ccc;
		box-shadow: none;
	}

	.password-toggle {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toggle-icon {
		font-size: 32rpx;
	}

	.password-strength {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
		padding: 20rpx;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 12rpx;
	}

	.strength-text {
		font-size: 24rpx;
		color: #666;
		margin-right: 20rpx;
	}

	.strength-bars {
		display: flex;
		gap: 8rpx;
		margin-right: 20rpx;
	}

	.strength-bar {
		width: 40rpx;
		height: 8rpx;
		border-radius: 4rpx;
		background: #e0e0e0;
	}

	.strength-bar.strength-1 {
		background: #ff6b6b;
	}

	.strength-bar.strength-2 {
		background: #ffa726;
	}

	.strength-bar.strength-3 {
		background: #66bb6a;
	}

	.strength-label {
		font-size: 24rpx;
		color: #666;
	}

	.reset-btn-box {
		margin: 60rpx 0 40rpx;
	}

	.reset-btn {
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		background: #4a79f3;
		color: #ffffff;
		font-size: 32rpx;
		font-weight: bold;
		box-shadow: 0 6rpx 16rpx rgba(74, 121, 243, 0.3);
	}

	.reset-btn.disabled {
		background: #ccc;
		box-shadow: none;
	}

	.back-to-login {
		text-align: center;
		padding: 20rpx 0;
	}

	.back-to-login-text {
		font-size: 26rpx;
		color: #999;
	}

	.back-to-login-link {
		font-size: 26rpx;
		color: #4a79f3;
		margin-left: 10rpx;
	}
</style> 