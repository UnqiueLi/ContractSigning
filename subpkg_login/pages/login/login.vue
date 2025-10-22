<template>
	<view>
		<!-- 顶部背景 -->
		<view class="bg-header"></view>
		<view class="image">
			<image src="/static/image/logoImg.png" mode="" style="height: 42vh;width: 100vw;"></image>
		</view>

		<!-- 登录按钮 -->
		<view class="login-btn-box">
			<button class="login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号快捷登录</button>
		</view>

		<!-- 协议同意 -->
		<view class="agreement-box">
			<radio :checked="isAgree" @click="toggleAgreement" color="#4a79f3" style="transform:scale(0.7);" />
			<text class="agreement-text">我已阅读并同意</text>
			<text class="agreement-link" @click="openProtocol('userAgreement')">《使用协议》</text>
			<text class="agreement-text">和</text>
			<text class="agreement-link" @click="openProtocol('privacyPolicy')">《隐私协议》</text>
		</view>

		<!-- 忘记密码链接 -->
		<view class="forgot-password-box">
			<text class="forgot-password-link" @click="goToForgotPassword">忘记密码？</text>
		</view>
	</view>
</template>

<script>
	import {
		authApi
	} from '../../../api/user.js';
	import settings from '../../../common/settings.js';
	// import {aesDecryptECB} from "../../../utils/decrypt.js";
	export default {
		data() {
			return {
				selectedContract: '',
				isAgree: false,
				phoneNumber:''
			}
		},
		methods: {
			// 切换协议同意状态
			toggleAgreement() {
				this.isAgree = !this.isAgree;
			},

			// 打开协议
			openProtocol(type) {
				let url = '';
				if (type === 'userAgreement') {
					url = '/pages/webview/webview?url=' + settings.userAgreementUrl;
				} else if (type === 'privacyPolicy') {
					url = '/pages/webview/webview?url=' + settings.privacyPolicyUrl;
				}

				if (url) {
					uni.navigateTo({
						url: url
					});
				}
			},

			// 跳转到忘记密码页面
			goToForgotPassword() {
				uni.navigateTo({
					url: '/subpkg_login/pages/forgot-password/forgot-password'
				});
			},

			// 获取手机号
			getPhoneNumber(e) {
				if (!this.isAgree) {
					uni.showToast({
						title: '请先阅读并同意协议',
						icon: 'none'
					});
					return;
				}

				// 用户拒绝授权
				if (e.detail.errMsg !== 'getPhoneNumber:ok') {
					uni.showToast({
						title: '获取手机号失败，请重试',
						icon: 'none'
					});
					return;
				}

				// 显示加载提示
				uni.showLoading({
					title: '登录中...'
				});

				// 获取登录凭证
				uni.login({
					provider: 'weixin',
					success: async (loginRes) => {
						if (loginRes.code) {
							try {
								// 将code和加密的手机号信息发送到后端
								const res = await authApi.wxLogin({
									code: loginRes.code,
								});

								uni.hideLoading();
								console.log(res, "res.coderes.code")
								if (res.code === 200) {
									// 保存登录信息
									// uni.setStorageSync('token', res.data.token);
									// uni.setStorageSync('userInfo', res.data.userInfo);

								
									this.getDecryptPhone(e)
									
								} else {
									uni.showToast({
										title: res.msg || '登录失败',
										icon: 'none'
									});
								}
							} catch (e) {
								uni.hideLoading();
								uni.showToast({
									title: '登录失败，请重试111',
									icon: 'none'
								});
								console.error(e);
							}
						}
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: '登录失败，请重试3333',
							icon: 'none'
						});
					}
				});
			},
			getDecryptPhone(e) {
				console.log(e, 'loginResloginRes')
				uni.login({
						provider: 'weixin',
						success: async (loginRes) => {
							if (loginRes.code) {
								const parmas = {
									code: loginRes.code,
									encryptedData: e.target.encryptedData,
									iv: e.target.iv,
								}
								authApi.decryptPhone(parmas).then(res => {
									// this.phoneNumber="15210699448"
									// this.phoneNumber="15794119711"
									this.phoneNumber=res.phone
									if(res){
										console.log(res,':ressss')
										// this.phoneNumber=res.phone
										uni.setStorageSync('phoneNumber',res.phone);
										// uni.setStorageSync('phoneNumber','15210699448');
										this.getMyLogin()
									}
									
								})
							}
						}
				})

		},
		getMyLogin(){
			authApi.myLogin({phone:this.phoneNumber}).then(res => {
				if(res.code===200 && res.token){
					console.log(res,"resresres")
					 uni.setStorageSync('token',res.token);
					 // 登录成功，跳转到首页
					 uni.showToast({
					 	title: '登录成功',
					 	icon: 'success'
					 });
					 this.getMyInfo()
				}
			})
		},
		getMyInfo(){
			authApi.myInfo().then(res => {
				console.log(res.user.roles[0].roleId,"res.user.roles[0].roleId")
				 if (res.user.roles[0].roleId==100) { 
				    uni.setTabBarItem({
				      index: 1 ,// “创建”菜单在 list 中的索引，从 0 开始
					  visible: false,
				    });
				  } 
				uni.setStorageSync('userId',res.user.userId);
				uni.setStorageSync('roleId',res.user.roles[0].roleId);
				uni.setStorageSync('sign',res.sign)
				uni.setStorageSync('contractId',res.user.customerId);
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/tabbar/index/index'
					});
				}, 1500);
			})
		},
		// 原登录方法，已由getPhoneNumber替代
		login() {
			if (!this.isAgree) {
				uni.showToast({
					title: '请先阅读并同意协议',
					icon: 'none'
				});
				return;
			}

			// 调用登录接口
			uni.login({
				provider: 'weixin',
				success: async (loginRes) => {
					if (loginRes.code) {
						try {
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							});

							// 登录成功，跳转到首页
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/tabbar/index/index'
								});
							}, 1500);
							const res = await authApi.wxLogin({
								code: loginRes.code,
								contractType: this.selectedContract
							});

							if (res.code === 200) {
								uni.setStorageSync('token', res.data.token);
								uni.setStorageSync('userInfo', res.data.userInfo);

								uni.showToast({
									title: '登录成功',
									icon: 'success'
								});

								// 登录成功，跳转到首页
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/tabbar/index/index'
									});
								}, 1500);
							} else {
								uni.showToast({
									title: res.msg || '登录失败',
									icon: 'none'
								});
							}
						} catch (e) {
							uni.showToast({
								title: '登录失败，请重试111',
								icon: 'none'
							});
							console.error(e);
						}
					}
				},
				fail: () => {
					uni.showToast({
						title: '登录失败，请重试2222',
						icon: 'none'
					});
				}
			});
		}
	}
	}
</script>

<style lang="scss">
	page {
		// background-color: #ffffff;
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

	.contract-container {
		padding: 0 30rpx;
		margin-top: -80rpx;
	}

	.contract-box {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 20rpx;
		z-index: 10;
	}

	.contract-item {
		width: 45%;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		text-align: center;
		color: #ffffff;
		font-size: 28rpx;
		font-weight: 500;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.orange {
		background: linear-gradient(90deg, #FF8A65, #FF5722);
	}

	.blue {
		background: linear-gradient(90deg, #5C6BC0, #3949AB);
	}

	.green {
		background: linear-gradient(90deg, #4CAF50, #2E7D32);
	}

	.blue-light {
		background: linear-gradient(90deg, #42A5F5, #1976D2);
	}

	.login-btn-box {
		margin: 60rpx 30rpx 0;
	}

	.login-btn {
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		background: #4a79f3;
		color: #ffffff;
		font-size: 32rpx;
		font-weight: bold;
		box-shadow: 0 6rpx 16rpx rgba(74, 121, 243, 0.3);
	}

	.agreement-box {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 30rpx;
		padding: 0 30rpx;
	}

	.agreement-text {
		font-size: 24rpx;
		color: #999;
	}

	.agreement-link {
		font-size: 24rpx;
		color: #4a79f3;
	}

	.forgot-password-box {
		text-align: center;
		margin-top: 20rpx;
	}

	.forgot-password-link {
		font-size: 26rpx;
		color: #4a79f3;
	}
</style>