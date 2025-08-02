<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 url: ''
			}
		},
		methods: {
			 onLoad(options) {
			    // 解码参数中的URL
			    this.url = decodeURIComponent(options.url || '')
				console.log(this.url,"this.urlthis.url")
			  }
		}
	}
</script>

<style>

</style>
