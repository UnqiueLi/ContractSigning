<template>
    <view class="add-enterprise-form">
        <view class="form-container">
            <u-form :model="formData" ref="uForm" label-position="top">
                <!-- 企业名称 -->
                <u-form-item label="企业名称" prop="name" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.name" placeholder="请输入企业名称(必填)" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 手机号/邮箱 -->
                <u-form-item label="手机号" prop="mobile" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.mobile" placeholder="请输入手机号" :custom-style="{ padding: '8rpx' }" />
                </u-form-item>

                <!-- 真实企业名称 -->
                <!-- <u-form-item label="真实企业名称" prop="realName" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.realName" placeholder="请输入工商营业执照上的企业名称"
                        :custom-style="{ padding: '8rpx' }" />
                </u-form-item> -->

                <!-- 统一社会信用代码 -->
                <u-form-item label="统一社会信用代码" prop="companyCode" :label-style="{ padding: '8rpx' }">
                    <u-input v-model="formData.companyCode" placeholder="请输入统一社会信用代码"
                        :custom-style="{ padding: '8rpx' }" />
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
import { addUserApi } from '../../../api/user';
export default {
  data() {
    return {
      formData: {
        name: '',
            mobile: '',
            companyCode:''
      },
    }
  },
  methods: {
    onCancel() {
      uni.navigateBack();
    },
    onSubmit() {
        this.$refs.uForm.validate(async (valid) => {
            if (valid) {
                try {
                    const res = await addUserApi.add({
                        ...this.formData,
                        type: 1
                    })
                    if (res.code === 200) {
                        uni.showToast({
                            title: '保存成功',
                            icon: 'success'
                        });
                        // 发送刷新事件
                        uni.$emit('refreshUserList');
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