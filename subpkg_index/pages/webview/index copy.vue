<template>
    <view class="webview-container">
        <web-view :src="authUrl" @message="handleAuthMessage" @load="handleWebViewLoad"></web-view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            authUrl: ''
        }
    },
    onLoad(options) {
        // 从参数中获取认证类型
        this.authType = options.type || 'personal';
        this.authUrl = decodeURIComponent(options.url || '')
    },
    methods: {
        // web view 加载完成
        handleWebViewLoad(e) {
            console.log('认证页面加载完成');
        },

        // 处理认证消息
        handleAuthMessage(e) {
            const data = e.detail.data;
            console.log('认证结果:', data);

            if (data && data.success) {
                // 认证成功
                uni.showToast({
                    title: '认证成功',
                    icon: 'success'
                });

                // 返回上一页并刷新数据
                setTimeout(() => {
                    // 发送刷新事件
                    uni.$emit('refreshAuthStatus');
                    uni.navigateBack();
                }, 1500);
            } else {
                // 认证失败
                uni.showToast({
                    title: data.message || '认证失败',
                    icon: 'none'
                });
            }
        }
    }
}
</script>