<template>
    <view>
        <view class="page-container">
            <view class="bg-header"></view>
            <!-- 表单区域 -->
            <view class="form-container">
                <!-- 基本信息 -->
                <view class="form-card">
                    <view class="form-item">
                        <view class="form-item-label">发起方</view>
                        <view class="form-item-input">
                            <u-input v-model="listData.merchantName" placeholder="请输入发起方" disabled/>
                        </view>
                    </view>
                    <view class="form-line"></view>
                    <view class="form-item">
                        <view class="form-item-label">主题</view>
                        <view class="form-item-input">
                            <u-input v-model="listData.title" placeholder="请输入主题" disabled/>
                        </view>
                    </view>
                    <view class="form-line"></view>
                    <view class="form-item">
                        <view class="form-item-label">截止时间</view>
                        <view class="form-item-input time-select">
                            <text>{{ listData.deadline || '请选择截止时间' }}</text>
                            <u-icon name="arrow-right" color="#C0C4CC" size="28"></u-icon>
                        </view>
                    </view>
                </view>

                <!-- 文档上传 -->
                <view class="form-card">
                    <view class="upload-item">
                        <view class="upload-title">文档上传</view>
                        <view class="upload-btn" @click="triggerFile">
                            <view class="custom-upload-btn">添加文档</view>
                        </view>
                    </view>
                </view>
                <view class="form-card filesBox">
                    <view class="fileNameBox">
                        <!-- <text  @click="downloadFile()" v-if="files.remark">{{files.remark}}</text> -->
						<text  @click="downloadFile()">{{listData.remark}}</text>
                    </view>
                </view>
                <!-- 参与方 -->
                <view class="form-card">
                    <view class="participants-header">
                        <view class="participants-title">参与方</view>
                    </view>
                    <view class="participants-list">
                        <!-- 参与方列表 -->
                        <view>
                            <view class="participant-item">
                            <view class="participant-info">
                                <view class="selection-indicator">
                                </view>
                                <u-avatar src="/static/image/userInfo.png" size="35"></u-avatar>
                                <view class="participant-details">
                                    <text class="participant-name">{{ listData.participantsByName  }}</text>
                                    <!-- <text class="participant-type">{{ item.type === 1 ? '企业' : '个人' }}</text> -->
                                </view>
                            </view>
                        </view>
                            </view>
                    </view>
                </view>

                <!-- 底部按钮 -->
                <view class="bottom-actions">
                    <u-button type="primary" class="submit-btn"  @click="getAddContract()">提交任务</u-button>
                </view>
            </view>
        </view>

        <!-- 时间选择器 -->
        <u-picker v-model="showPicker" mode="time" :params="timePickerParams" :show-time-tag="true"
            @confirm="onTimeConfirm" @cancel="showPicker = false"></u-picker>
    </view>
</template>

<script>
	import settings from '@/common/settings.js';
import { addUserApi,userApi  } from '../../../api/user';
import { maskPhone } from '../../../utils/desensitize';
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
				files:{},
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
                },
                listData:{},
                selectedParticipant: null,
				baseUrl: '',
				fileUr:'',
				contractId:''
			};
		},
		onLoad(options) {
			this.baseUrl = settings.devUrl
			console.log(options,"bbbbbb")
			this.fileUrl=uni.getStorageSync("fileUrl");
            this.UploadcontractId = uni.getStorageSync("UploadcontractId");
            let id = ''
            if (options.id) {
                // uni.setStorageSync('id', options.id)
                id = options.id 
                this.getContractInfo(id)
            } else {
                this.listData = JSON.parse(uni.getStorageSync('listDataPrev'))
            }
		
            
			if(this.fileUrl){
				this.getContractPlaceOnFile()
			}
		},
		created() {
		},
		onShow() {
            // 页面显示时执行
            // this.getList()
		},
    methods: {
		//合同归档
		async  getContractPlaceOnFile() {
		   const res = await userApi.contractPlaceOnFile(this.UploadcontractId)
		   if (res.code === '1000') {
				this.getContractDownload()
		   }
		},
		//合同下载
		async  getContractDownload() {
			console.log(this.UploadcontractId,"sthis.UploadcontractId")
		   const res = await userApi.contractDownload(this.UploadcontractId)
		   if (res.code === 200) {
			   this.fddUrl=res.result
		   }
		},
		 async  getContractInfo(id) {
		    const res = await userApi.contractInfo(id)
		    if (res.code === 200) {
				this.listData=res?.data
                this.listData.merchantName = maskPhone(this.listData.merchantName)
		    }
		 },
		 async  geTmanuallySign(contractId) {
			const parmas={
				contractId:contractId,
				customerId:uni.getStorageSync("contractId"),
				title:this.files.remark,
				signKeyword:'张三',
				returnUrl:'/subpkg_index/pages/modifyInformation/index',
			}
		    const res = await userApi.manuallySign(parmas)
		    if (res.code === 200) {
				console.log(res.result,"res.result")
                uni.setStorageSync("fileUrl", res.result);
                uni.setStorageSync('listDataPrev', JSON.stringify(this.listData))
				uni.navigateTo({
				  url: '/subpkg_index/pages/webview/index?url=' + encodeURIComponent(res.result)
				});
		    }
		 },
		 async  getContractUpload() {
		    const res = await userApi.contractUpload({title:this.files.remark,url:`${this.baseUrl}${this.files.url}`})
		    if (res.code === 200) {
				uni.setStorageSync("UploadcontractId",res.contractId);
				this.geTmanuallySign(res.contractId)
		    }
		 },
		getAddContract() {
			const parmas={
				title:this.listData.title,
				url:this.files.url,
				merchantId:this.listData.initiator,
				status:'1',
				participantsBy:'5',
				deadline:this.listData.deadline,
				selectedParticipant: this.listData.participantsByName,
				id:'',
			}
			userApi.editContract(parmas).then(res => {
				if (res.code === 200) {
					
					uni.showToast({
						title: '任务创建成功',
						icon: 'success'
					});
					// 可以在这里跳转到任务列表页面
				} else {
					uni.showToast({
						title: res.msg || '创建失败',
						icon: 'none'
					});
				}
			}).catch(err => {
				uni.showToast({
					title: '创建失败，请重试',
					icon: 'none'
				});
			})
		},
		downloadFile(item, e) {
			console.log(item, e, "sssss")
			uni.downloadFile({
				url: this.fddUrl ? this.fddUrl : this.baseUrl + this.listData.url,
				method: 'GET',
				success: (res) => {
					if (res.statusCode === 200) {
						//文件保存到本地
						wx.getFileSystemManager().saveFile({
							tempFilePath: res.tempFilePath, //临时路径
							success: function(res) {
								console.log(res);
								uni.showToast({
									icon: 'none',
									mask: true,
									title: '文件已保存：' + res.savedFilePath, //保存路径
									duration: 3000,
								});
								setTimeout(() => {
									//打开文档查看
									uni.openDocument({
										filePath: res.savedFilePath,
										success: function(res) {
											console.log('打开文档成功');
										}
									});
								}, 3000)
							}
						});
					}
				}
			})
		},
			// 触发文件选择
			triggerFile() {
				// #ifdef MP-WEIXIN
				uni.chooseMessageFile({
					count: 5,
					type: 'file',
					success: (res) => {
						console.log('选择文件成功:', res);
						this.handleFileSelect(res.tempFiles);
					},
					fail: (err) => {
						console.error('选择文件失败:', err);
						uni.showToast({
							title: '选择文件失败',
							icon: 'none'
						});
					}
				});
				// #endif
				
				// #ifndef MP-WEIXIN
				this.mediatype='all'
				this.$nextTick(() => {
					this.fileList = [];
					setTimeout(() => {
						this.$refs.filePicker.choose();
					}, 100);
				});
				// #endif
			},
			// 处理文件选择
			handleFileSelect(tempFiles) {
				tempFiles.forEach((file) => {
					this.uploadFile(file);
				});
			},
			// 上传文件
			uploadFile(file) {
				// 获取基础URL
				const baseUrl = process.env.NODE_ENV === 'development' ?
					settings.devUrl : settings.prodUrl;
				// 获取token
				const token = uni.getStorageSync('token');
				
				uni.showLoading({
					title: '上传中...'
				});
			
				uni.uploadFile({
					url: baseUrl + '/common/upload',
					filePath: file.path,
					name: 'file',
					header: {
						'Authorization': 'Bearer ' + token
					},
					success: (uploadFileRes) => {
						uni.hideLoading();
						console.log(uploadFileRes.data,"uploadFileResuploadFileRes");
						let result;
						try {
							result = JSON.parse(uploadFileRes.data);
							if (result.code == 200) {
								// 将上传成功的文件信息添加到任务表单的listData数组
								this.files={
									remark: file.name,
									url: result.fileName,
                                };
                                this.listData = { ...this.listData,...this.files}
								console.log(this.files,"this.files.files")
								this.getContractUpload()
								uni.showToast({
									title: '上传成功',
									icon: 'success'
								});
							} else { 
								uni.showToast({
									title: result.msg || '上传失败',
									icon: 'none'
								});
							}
						}catch (error) {
						  console.error('发生错误:', error.message);
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.log('上传失败:', err);
						uni.showToast({
							title: '上传失败，请重试',
							icon: 'none'
						});
					}
				});
			},
			onTimeConfirm(e) {
				this.formData.deadline = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}`;
				this.showPicker = false;
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f6f9;
	}
	
	.page-container {
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
	.filesBox{
		padding: 20rpx 32rpx;
	}
	.fileNameBox text {
		color: #007AFF;
		font-size: 26rpx;
		flex: 1;
	}
	
	.fileNameBox .delete-icon {
		width: 32rpx;
		height: 32rpx;
		color: #6c757d;
		cursor: pointer;
		margin-left: 20rpx;
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
	
	.participants-subtitle {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}
	
	.participants-list {
		padding: 0 32rpx;
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 80rpx 0;
		color: #C0C4CC;
		font-size: 28rpx;
	}
	
	.empty-text {
		margin-top: 20rpx;
	}
	
	.participant-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 0;
		border-bottom: 2rpx solid #f5f5f5;
	}
	
	.participant-info {
		display: flex;
		align-items: center;
	}
	
	.selection-indicator {
		margin-right: 20rpx;
		padding: 10rpx;
	}
	
	.participant-details {
		margin-left: 20rpx;
	}
	
	.participant-name {
		font-size: 28rpx;
		color: #333;
	}
	
	.participant-type {
		font-size: 24rpx;
		color: #999;
	}
	
	.participant-actions {
		display: flex;
		align-items: center;
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