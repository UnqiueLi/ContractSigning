<template>
    <view class="add-person-form">
        <view class="form-container">
            <u-form :model="formData" ref="uForm" label-position="top">
                <!-- 个人名称 -->
                <u-form-item label="个人名称" prop="name" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.name" placeholder="请输入个人名称(必填)" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 手机号/邮箱 -->
                <u-form-item label="手机号" prop="mobile" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.mobile" placeholder="请输入手机号" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 真实姓名 -->
                <!-- <u-form-item label="真实姓名" prop="realName" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.realName" placeholder="请输入真实姓名" :custom-style="{ padding: '8rpx' }" />
                </u-form-item> -->

                <!-- 证件类型 -->
                <!-- <u-form-item label="证件类型" prop="idType" :label-style="{ padding: '8rpx' }">
                    <u-input type="select" :select-open="selectShow"  v-model="formData.idType" placeholder="请选择证件类型"
                        @click="showIdTypePicker = true" :custom-style="{ padding: '8rpx' }" />
                    <u-select v-model="showIdTypePicker" mode="single-column" :list="idTypeList"
                        @confirm="onIdTypeConfirm" @cancel="showIdTypePicker = false" />
                </u-form-item> -->

                <!-- 证件号 -->
                <u-form-item label="证件号" prop="idCard" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.idCard" placeholder="请输入证件号" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 签署方式 -->
                <!-- <u-form-item label="签署方式" prop="signType" :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
                    <u-input 
                        type="select" 
                        :select-open="showSignTypeSelect" 
                        v-model="formData.signType" 
                        placeholder="请选择签署方式"
                        @click="showSignTypePicker = true" 
                        :custom-style="{ padding: '8rpx' }" 
                    />
                    <u-select 
                        v-model="showSignTypePicker" 
                        mode="single-column" 
                        :list="signTypeList"
                        @confirm="onSignTypeConfirm" 
                        @cancel="showSignTypePicker = false" 
                    />
                </u-form-item> -->

                <!-- 意愿验证方式 -->
                <!-- <u-form-item label="意愿验证方式" prop="verifyType" :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
                    <u-input 
                        type="select" 
                        :select-open="showVerifyTypeSelect" 
                        v-model="formData.verifyType" 
                        placeholder="请选择意愿验证方式"
                        @click="showVerifyTypePicker = true" 
                        :custom-style="{ padding: '8rpx' }" 
                    />
                    <u-select 
                        v-model="showVerifyTypePicker" 
                        mode="single-column" 
                        :list="verifyTypeList"
                        @confirm="onVerifyTypeConfirm" 
                        @cancel="showVerifyTypePicker = false" 
                    />
                </u-form-item> -->

                <!-- 签署阅读设置 -->
                <!-- <u-form-item label="签署阅读设置" prop="readAllDoc"
                    :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
                    <view class="form-item-flex">
                        <view class="form-item-input">
                            <text class="switch-label">所有文档需阅读至末页才可提交签署</text>
                            <u-switch v-model="formData.readAllDoc" activeColor="#2979ff" />
                        </view>
                        <view class="form-item-input">
                            <text class="switch-label">阅读固定时长才可提交签署</text>
                            <u-switch v-model="formData.readTimeLimit" activeColor="#2979ff" />
                        </view>
                    </view>
                </u-form-item> -->
                <!-- 附件要求 -->
                <!-- <u-form-item :label="`附件要求 (剩余: ${attachmentRemain})`" prop="attachmentRequired" :border-bottom="false"
                    :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
                    <view class="form-item-input">
                        <text class="switch-label">要求上传附件</text>
                        <u-switch v-model="formData.attachmentRequired" activeColor="#2979ff" />
                    </view>
                </u-form-item> -->
            </u-form>
        </view>

        <!-- 底部按钮 -->
        <view class="form-actions">
            <u-button type="default" @click="onCancel" class="cancel-btn">取消</u-button>
            <u-button type="primary" @click="onSubmit" class="save-btn">保存</u-button>
        </view>


    </view>
</template>

<script>
import { addUserApi } from '../../../api/user';

export default {
  data() {
    return {
      formData: {
        name: '',
            mobile: '',
        idCard:'',
   
      },
      idTypeList: [
        { label: '中国居民身份证', value: '中国居民身份证' },
       
      ],
       
      showIdTypePicker: false,
   
    }
  },
  methods: {
    onCancel() {
      uni.navigateBack();
    },
    onSubmit() {
        this.$refs.uForm.validate(async (valid) => {
          if (valid){
            try {
                const res = await addUserApi.add({
                    ...this.formData,
                    type:2
                })
                if (res.code === 200) {
                      uni.showToast({
                        title: '保存成功',
                        icon: 'success'
                      });
                    
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    });
                }
            } catch (error) {
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                });
            }
     
        }
      });
    },
    onIdTypeConfirm(e) {
      this.formData.idType = e[0].label;
      this.showIdTypePicker = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.add-person-form {
  min-height: 100vh;
  background-color: #fff;
}
.form-container{
    // height: calc(100vh - 100rpx);
    // overflow-y: auto;
    padding: 22rpx 32rpx 100rpx;
}
.form-item-flex{
        display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
}
.form-item-input {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-label {
  color: #666;
  font-size: 28rpx;
}

.attachment-tip {
  color: #999;
  font-size: 24rpx;
  margin-top: 10rpx;
  margin-left: 60rpx;
}

.form-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 20rpx 40rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.cancel-btn {
  flex: 1;
  margin-right: 20rpx;
}

.save-btn {
  flex: 1;
  margin-left: 20rpx;
}
</style>