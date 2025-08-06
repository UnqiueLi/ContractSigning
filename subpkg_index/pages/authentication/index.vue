<template>
	<view class="authentication-page">
		<view class="content">
			<!-- 个人信息部分 -->
			<view class="section">
				<view class="section-title">个人信息</view>
				<u-cell-group>
					<u-cell-item
						title="证件类型"
						:arrow="false"
					>
						<u-input
							slot="right-icon"
							v-model="idNumberType"
							:border="false"
							:clearable="true"
							class="cell-input"
							disabled
						></u-input>
					</u-cell-item>
					<u-cell-item
						title="姓名"
						:arrow="false"
					>
						<u-input
							slot="right-icon"
							v-model="userName"
							placeholder="请输入姓名"
							:border="false"
							:clearable="true"
							class="cell-input"
						></u-input>
					</u-cell-item>
					<u-cell-item
						title="证件号码"
						:arrow="false"
					>
						<u-input
							slot="right-icon"
							v-model="idNumber"
							placeholder="请输入18位身份证号"
							:border="false"
							:clearable="true"
							maxlength="18"
							class="cell-input"
						></u-input>
					</u-cell-item>
				</u-cell-group>
			</view>
			

			
			<!-- 隐私声明 -->
			<view class="privacy-notice">
				您提交的信息仅用于实名认证及向CA机构申请数字证书,坚决不会以任何理由泄露您的信息
			</view>
			
			<!-- 协议勾选 -->
			<view class="agreement-section">
				<u-checkbox
					v-model="agreementChecked"
					shape="circle"
					active-color="#007aff"
					class="agreement-checkbox"
					@change="onAgreementChange"
				></u-checkbox>
				<view class="agreement-text">
					我已阅读并同意
					<text class="agreement-link" @click="viewAgreement('ca')">《豸信CA数字证书服务协议》</text>
					和
					<text class="agreement-link" @click="viewAgreement('sign')">《电子签服务协议》</text>
				</view>
			</view>
			<u-modal v-model="showModal" :content="content" @confirm="confirm"></u-modal>
			<!-- 提交按钮 -->
			<view class="submit-section">
				<u-button
					:disabled="!canSubmit"
					@click="submitAuthentication"
					class="submit-btn"
					:custom-style="{ 
						background: canSubmit ? '#007aff' : '#cccccc',
						color: '#ffffff',
						fontSize: '16px',
						height: '50px',
						borderRadius: '8px'
					}"
				>
					提交
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		userApi
	} from '../../../api/user.js';
	import { Base64 } from 'js-base64'
	export default {
		data() {
			return {
				idNumberType: '中国居民身份证',
				idNumber: '',
				userName:'',
				agreementChecked: false,
				phoneNumber:'',
				showModal:false,
				content:'',
				verifiedSerialNo:'',
				
			}
		},
		computed: {
			canSubmit() {
				return this.userName && 
					   this.idNumber && 
					   this.agreementChecked;
			}
		},
		onShow() {
			
		},
		created() {
			this.phoneNumber=uni.getStorageSync('phoneNumber');
			this.verifiedSerialNo=uni.getStorageSync("verifiedSerialNo");
			console.log(this.verifiedSerialNo,"this.verifiedSerialNo")
			if(this.verifiedSerialNo){
				this.getBindRealName()
			}
		},
		methods: {
			getRegister(){
				userApi.register({type:'1'}).then(res => {
					uni.setStorageSync("contractId",res.data);
					this.getCertificate(res.data)
				})
			},
			getBindRealName(){
				userApi.bindRealName({customerId:uni.getStorageSync("contractId"),verifiedSerialNo:this.verifiedSerialNo}).then(res => {
					if(res.code===3205){
						this.content=res.msg
					}else if(res.code===1){
						this.content="恭喜您实名认证成功"
					}
					this.showModal=true
				})
			},
			getCertificate(code){
				const parmas={
					customerId:code,
					verifiedWay:'4',
					pageModify:'1',
					customerName:this.userName,
					customerIdentType:'0',
					customerIdentNo:this.idNumber,
					mobile:this.phoneNumber,
					certType:'0',
					isMiniProgram:'3',
					idPhotoOptional:'2',
					returnUrl:'wx://subpkg_index/pages/authentication/index'
				}
				userApi.certificate(parmas).then(res => {
					if(res.code===1){
						 console.log( Base64.decode(res.data.url),"sssss66644")
						 const baseUrl=Base64.decode(res.data.url)
						 uni.setStorageSync("verifiedSerialNo",res.data.transactionNo);
						 uni.navigateTo({
						   url: '/subpkg_index/pages/webview/index?url=' + encodeURIComponent(baseUrl)
						 });
						// userApi.bindRealName({customerId:code,verifiedSerialNo:res.data.transactionNo}).then(res => {
						// 	if(res.code===3205){
						// 		this.content=res.msg
						// 	}else if(res.code===1){
						// 		this.content="恭喜您实名认证成功"
						// 	}
						// 	this.showModal=true
						// })
					}
				})
			},
			onAgreementChange(value) {
				console.log('协议勾选状态变化:', value);
				// 可以在这里添加其他逻辑，比如验证用户是否真的阅读了协议
				if (value) {
					this.agreementChecked=true
				}
			},
			viewAgreement(type) {
				const agreements = {
					ca: '豸信CA数字证书服务协议',
					sign: '电子签服务协议'
				};
				
				uni.showModal({
					title: agreements[type],
					content: '这里是协议内容...',
					showCancel: false
				});
			},
			submitAuthentication() {
				if (!this.canSubmit) {
					return;
				}
				this.getRegister()
					
			},
			confirm(){
				uni.navigateBack();
			}
		},
		

	}
</script>

<style lang="scss" scoped>
.authentication-page {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.navbar-right {
	display: flex;
	align-items: center;
}

.content {
	padding: 20rpx;
}

.section {
	background-color: #ffffff;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
}

.section-title {
	padding: 30rpx 30rpx 20rpx;
	font-size: 32rpx;
	font-weight: 600;
	color: #333333;
}



.privacy-notice {
	padding: 30rpx;
	background-color: #ffffff;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	font-size: 28rpx;
	color: #666666;
	line-height: 1.5;
}



.agreement-section {
	display: flex;
	align-items: flex-start;
	padding: 30rpx;
	background-color: #ffffff;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
}

.agreement-checkbox {
	margin-right: 20rpx;
	margin-top: 4rpx;
}

.agreement-text {
	font-size: 28rpx;
	color: #333333;
	line-height: 1.5;
	flex: 1;
}

.agreement-link {
	color: #007aff;
}

.submit-section {
	padding: 40rpx 30rpx;
}

.submit-btn {
	width: 100%;
}

.cell-input {
	text-align: right;
	font-size: 28rpx;
	color: #333333;
}

.cell-input ::v-deep .u-input__input {
	text-align: right;
}

.cell-input ::v-deep .u-input__input::placeholder {
	text-align: right;
	color: #999999;
}
</style>
