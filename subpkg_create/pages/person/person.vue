<template>
    <view class="add-person-form">
        <view class="form-container">
            <u-form :model="formData" ref="uForm" label-position="top">
                <!-- 个人名称 -->
                <u-form-item label="个人名称" prop="name" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.name" placeholder="请输入个人名称(必填)" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 手机号/邮箱 -->
                <u-form-item label="手机号/邮箱" prop="contact" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.contact" placeholder="请输入手机号/邮箱" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 真实姓名 -->
                <u-form-item label="真实姓名" prop="realName" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.realName" placeholder="请输入真实姓名" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 证件类型 -->
                <u-form-item label="证件类型" prop="idType" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.idType" placeholder="请选择证件类型" @click="showIdTypePicker = true"
                        readonly="true" right-icon="arrow-right" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 证件号 -->
                <u-form-item label="证件号" prop="idNumber" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.idNumber" placeholder="请输入证件号" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 签署方式 -->
                <u-form-item label="签署方式" prop="signType"
                    :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
                    <u-input v-model="formData.signType" disabled placeholder="请选择签署方式"
                        @click="showSignTypePicker = true" readonly :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 意愿验证方式 -->
                <u-form-item label="意愿验证方式" prop="verifyType"
                    :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
                    <u-input v-model="formData.verifyType" disabled placeholder="请选择意愿验证方式"
                        @click="showVerifyTypePicker = true" readonly :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 签署阅读设置 -->
                <u-form-item label="签署阅读设置" prop="readAllDoc"
                    :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
                    <view class="form-item-input">
                        <text class="switch-label">所有文档需阅读至末页才可提交签署</text>
                        <u-switch v-model="formData.readAllDoc" activeColor="#2979ff" />
                    </view>
                    <view class="form-item-input">
                        <text class="switch-label">阅读固定时长才可提交签署</text>
                        <u-switch v-model="formData.readTimeLimit" activeColor="#2979ff" />
                    </view>
                </u-form-item>
                <!-- 附件要求 -->
                <u-form-item :label="`附件要求 (剩余: ${attachmentRemain})`" prop="attachmentRequired"
                    :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
                    <view class="form-item-input">
                        <text class="switch-label">要求上传附件</text>
                        <u-switch v-model="formData.attachmentRequired" activeColor="#2979ff" />
                    </view>
                </u-form-item>
            </u-form>
        </view>

        <!-- 底部按钮 -->
        <view class="form-actions">
            <u-button type="default" @click="onCancel" class="cancel-btn">取消</u-button>
            <u-button type="primary" @click="onSubmit" class="save-btn">保存</u-button>
        </view>

        <!-- 选择器弹窗：证件类型、签署方式和意愿验证方式 -->
        <u-picker mode="selector" :show="showIdTypePicker" :columns="[idTypeList]" @confirm="onIdTypeConfirm"
            @cancel="showIdTypePicker = false" />
        <u-picker mode="selector" :show="showSignTypePicker" :columns="[signTypeList]" @confirm="onSignTypeConfirm"
            @cancel="showSignTypePicker = false" />
        <u-picker mode="selector" :show="showVerifyTypePicker" :columns="[verifyTypeList]"
            @confirm="onVerifyTypeConfirm" @cancel="showVerifyTypePicker = false" />
    </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        contact: '',
        realName: '',
        idType: '',
        idNumber: '',
        signType: '不限制签名方式',
        verifyType: '签署密码、短信验证、人脸识别',
        readAllDoc: false,
        readTimeLimit: false,
        attachmentRequired: false,
      },
      idTypeList: [
        '中国居民身份证',
        '护照',
        '军官证',
        '港澳通行证',
        '台湾通行证'
      ],
      signTypeList: [
        '不限制签名方式',
        '手写签名',
        '电子签名',
        '印章签名'
      ],
      verifyTypeList: [
        '签署密码、短信验证、人脸识别',
        '仅签署密码',
        '仅短信验证',
        '仅人脸识别'
      ],
      showIdTypePicker: false,
      showSignTypePicker: false,
      showVerifyTypePicker: false,
      attachmentRemain: 9,
    }
  },
  methods: {
    onCancel() {
      uni.navigateBack();
    },
    onSubmit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      });
    },
    onIdTypeConfirm(e) {
      this.formData.idType = e.value[0];
      this.showIdTypePicker = false;
    },
    onSignTypeConfirm(e) {
      this.formData.signType = e.value[0];
      this.showSignTypePicker = false;
    },
    onVerifyTypeConfirm(e) {
      this.formData.verifyType = e.value[0];
      this.showVerifyTypePicker = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.add-person-form {
  padding: 22rpx 32rpx;
  min-height: 100vh;
  background-color: #fff;
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