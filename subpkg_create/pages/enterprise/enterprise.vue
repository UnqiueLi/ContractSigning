<template>
  <view class="add-enterprise-form">
    <view class="form-container">
      <u-form :model="formData" ref="uForm" label-position="top">
        <!-- 企业名称 -->
        <u-form-item label="企业名称" prop="name" :label-style="{ padding: '8rpx' }">
          <u-input 
            v-model="formData.name" 
            placeholder="请输入企业名称(必填)" 
            :custom-style="{ padding: '8rpx' }" 
          />
        </u-form-item>

        <!-- 手机号/邮箱 -->
        <u-form-item label="手机号/邮箱" prop="contact" :label-style="{ padding: '8rpx' }">
          <u-input 
            v-model="formData.contact" 
            placeholder="请输入手机号/邮箱" 
            :custom-style="{ padding: '8rpx' }" 
          />
        </u-form-item>

        <!-- 真实企业名称 -->
        <u-form-item label="真实企业名称" prop="realName" :label-style="{ padding: '8rpx' }">
          <u-input 
            v-model="formData.realName" 
            placeholder="请输入工商营业执照上的企业名称" 
            :custom-style="{ padding: '8rpx' }" 
          />
        </u-form-item>

        <!-- 统一社会信用代码 -->
        <u-form-item label="统一社会信用代码" prop="creditCode" :label-style="{ padding: '8rpx' }">
          <u-input 
            v-model="formData.creditCode" 
            placeholder="请输入统一社会信用代码" 
            :custom-style="{ padding: '8rpx' }" 
          />
        </u-form-item>

        <!-- 经办人签名 -->
        <u-form-item label="要求签名" prop="requireSignature" :label-style="{ padding: '8rpx' }">
          <view class="form-item-input">
            <text class="switch-label">要求签名</text>
            <u-switch v-model="formData.requireSignature" activeColor="#2979ff" />
          </view>
        </u-form-item>

        <!-- 意愿验证方式 -->
        <u-form-item label="意愿验证方式" prop="verifyType" :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
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
        </u-form-item>

        <!-- 签署阅读设置 -->
        <u-form-item label="签署阅读设置" prop="readAllDoc" :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }">
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
        </u-form-item>

        <!-- 附件要求 -->
        <u-form-item 
          :label="`附件要求 (剩余: ${attachmentRemain})`" 
          prop="attachmentRequired" 
          border-bottom="false"
          :label-style="{ backgroundColor: '#f6f7fb', padding: '8rpx' }"
        >
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
        creditCode: '',
        requireSignature: false,
        verifyType: '签署密码、短信验证、人脸识别',
        readAllDoc: false,
        readTimeLimit: false,
        attachmentRequired: false,
      },
      verifyTypeList: [
        { label: '签署密码、短信验证、人脸识别', value: '签署密码、短信验证、人脸识别' },
        { label: '仅签署密码', value: '仅签署密码' },
        { label: '仅短信验证', value: '仅短信验证' },
        { label: '仅人脸识别', value: '仅人脸识别' }
      ],
      showVerifyTypePicker: false,
      showVerifyTypeSelect: false,
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
    onVerifyTypeConfirm(e) {
      this.formData.verifyType = e[0].label;
      this.showVerifyTypePicker = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.add-enterprise-form {
  min-height: 100vh;
  background-color: #fff;
}

.form-container {
  height: calc(100vh - 100rpx);
  overflow-y: auto;
  padding: 22rpx 32rpx 100rpx;
}

.form-item-flex {
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