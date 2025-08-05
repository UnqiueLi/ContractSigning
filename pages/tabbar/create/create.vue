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
                            <u-input v-model="formData.initiator" placeholder="请输入发起方" disabled/>
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
                        <view class="upload-btn" @click="triggerFile">
                            <view class="custom-upload-btn">添加文档</view>
                        </view>
                    </view>
                </view>
                <view class="form-card filesBox" v-if="files.length>0">
                    <view class="fileNameBox" v-for="(item, index) in files" :key="index">
                        <text>{{item.fileName}}</text>
                        <u-icon name="trash" size="22" color="#6c757d" class="delete-icon"
                            @click="deleteFile(index)"></u-icon>
                    </view>
                </view>
                <!-- 参与方 -->
                <view class="form-card">
                    <view class="participants-header">
                        <view class="participants-title">参与方 ({{ listData.length }})</view>
                        <view class="participants-subtitle">{{ selectedParticipant ? '已选择参与方' : '请选择一个参与方' }}</view>
                    </view>

                    <view class="participants-list">
                        <!-- 参与方列表 -->
                        <view v-if="listData.length > 0">
                            <view class="participant-item" v-for="item in listData" :key="item.id" @click="selectParticipant(item.id)">
                            <view class="participant-info">
                                <view class="selection-indicator">
                                    <u-icon 
                                        :name="selectedParticipant === item.id ? 'checkbox-mark' : 'circle'" 
                                        :color="selectedParticipant === item.id ? '#3758FE' : '#C0C4CC'" 
                                        size="20">
                                    </u-icon>
                                </view>
                                <u-avatar src="/static/image/userInfo.png" size="35"></u-avatar>
                                <view class="participant-details">
                                    <text class="participant-name">{{ item.name }}</text>
                                    <text class="participant-type">{{ item.type === 1 ? '企业' : '个人' }}</text>
                                </view>
                            </view>
                            <view class="participant-actions" @click.stop="delFun(item.id)">
                                <u-icon name="trash" size="22" color="#6c757d" class="delete-icon"></u-icon>
                            </view>
                        </view>
                            </view>
                    </view>

                    <view class="btn-group">
                        <view class="custom-btn" @click="addUser(1)">
                            <u-icon name="account" size="16" color="#3758FE"></u-icon>
                            <text>添加个人</text>
                        </view>
                        <view class="custom-btn" @click="addUser(2)">
                            <u-icon name="home" size="16" color="#3758FE"></u-icon>
                            <text>添加企业</text>
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
				files:[],
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
                listData:[],
                selectedParticipant: null
			};
		},
		onLoad() {
				this.formData.initiator=uni.getStorageSync('phoneNumber');
				console.log(this.formData.initiator,"this.formData.initiator")
				// 监听刷新事件
				uni.$on('refreshUserList', () => {
				    this.getList();
				}); 
		},
    onUnload() {
        // 页面卸载时移除监听
        uni.$off('refreshUserList');
    },
		onShow() {
            // 页面显示时执行
            this.getList()
		},
    methods: {
        // 参与方列表

         async  getList() {
            const res = await addUserApi.list({})
            if (res.code === 200) {
                console.log(res)
                this.listData=res?.data
            }
         },
		 async  getContractInfo(id) {
		    const res = await userApi.contractInfo(id)
		    if (res.code === 200) {
		   
		    }
		 },
        selectParticipant(id) {
            this.selectedParticipant = id;
        },
        async  delFun(id) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个参与方吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							const result = await addUserApi.merchantRemove(id)
							if (result.code === 200) {
								// 如果删除的参与方是当前选中的，清空选择
								if (this.selectedParticipant === id) {
									this.selectedParticipant = null;
								}
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								this.getList()
							} else {
								uni.showToast({
									title: result.msg || '删除失败',
									icon: 'none'
								});
							}
						} catch (error) {
							uni.showToast({
								title: '删除失败，请重试',
								icon: 'none'
							});
						}
					}
				}
			});
        },
		getAddContract() {
			// 验证必填字段
			if (!this.formData.title.trim()) {
				uni.showToast({
					title: '请输入任务主题',
					icon: 'none'
				});
				return;
			}
			
			if (!this.formData.deadline) {
				uni.showToast({
					title: '请选择截止时间',
					icon: 'none'
				});
				return;
			}
			
			if (this.listData.length === 0) {
				uni.showToast({
					title: '请至少添加一个参与方',
					icon: 'none'
				});
				return;
			}
			
			if (!this.selectedParticipant) {
				uni.showToast({
					title: '请选择一个参与方',
					icon: 'none'
				});
				return;
			}
			
			const parmas={
				title:this.formData.title,
				url:this.files[0].url,
				merchantId:uni.getStorageSync('userId'),
				status:'1',
				participantsBy:this.selectedParticipant,
				deadline:this.formData.deadline,
				selectedParticipant: this.selectedParticipant,
				remark:this.files[0].fileName
			}
			userApi.addContract(parmas).then(res => {
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
								// 将上传成功的文件信息添加到任务表单的files数组
								this.files.push({
									fileName: file.name,
									url: result.fileName,
									fileType:result.fileType
								});
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
			deleteFile(index) {
				this.files.splice(index, 1);
			},
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
			},
			

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