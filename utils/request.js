/**
 * 通用请求方法封装
 * 基于uni-app和uView的请求方法封装
 */

import {
	devUrl,
	prodUrl,
	contentType,
	showLoading,
	loadingText,
	loadingTime,
	headerTokenName,
	userTokenName,
	codeName,
	successCode,
	invalidCode,
} from '@/common/settings'

/**
 * 请求封装
 * @param {Object} options - 请求配置
 * @param {String} options.url - 请求地址
 * @param {String} options.method - 请求方法
 * @param {Object} options.data - 请求数据
 * @param {Object} options.header - 请求头
 * @param {Boolean} options.loading - 是否显示加载中
 * @param {String} options.loadingText - 加载中文字
 * @param {Number} options.timeout - 超时时间
 * @returns {Promise} Promise对象
 */
const request = (options = {}) => {
	// 合并请求参数
	options.url = options.url || '';
	options.method = options.method || 'GET';
	options.data = options.data || {};
	options.header = options.header || {};
	options.loading = options.loading !== false;
	options.loadingText = options.loadingText || loadingText;
	options.timeout = options.timeout || 30000;

	// 显示加载中
	if (options.loading) {
		uni.showLoading({
			title: options.loadingText,
			mask: true
		});
	}

	// 获取完整URL
	const baseUrl = process.env.NODE_ENV === 'development' ? devUrl : prodUrl;
	const url = options.url.startsWith('http') ? options.url : (baseUrl + options.url);

	// 获取Token
	const token = uni.getStorageSync('userInfo') ? 
		JSON.parse(uni.getStorageSync('userInfo'))[userTokenName] : '';

	// 设置请求头
	const header = {
		'content-type': contentType,
		...options.header
	};
	
	// 添加Token到请求头
	if (token) {
		header[headerTokenName] = token;
	}

	// 发起请求
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: options.method,
			data: options.data,
			header,
			timeout: options.timeout,
			success: (res) => {
				// 服务端返回的数据
				let data;
				
				try {
					// 安全地解析数据，处理可能的非JSON格式响应
					if (typeof res.data === 'string') {
						data = JSON.parse(res.data);
					} else {
						data = res.data;
					}
				} catch (e) {
					console.error('JSON解析错误:', e);
					uni.showToast({
						title: '数据解析错误',
						icon: 'none'
					});
					reject(e);
					return;
				}

				// 请求成功处理
				if (data[codeName] === successCode) {
					resolve(data);
				} else if (data[codeName] == 401 || data[codeName] == 403) {
					// 401或403状态码，关闭所有页面，跳转到登录页
					
					// 清除本地存储的用户信息
					uni.removeStorageSync('userInfo');
					
					// 显示提示
					uni.showToast({
						title: '登录已过期，请重新登录',
						icon: 'none'
					});
					
					// 关闭所有页面，跳转到登录页
					setTimeout(() => {
						uni.reLaunch({
							url: '/subpkg_login/pages/login/login'
						});
					}, 1500);
					
					reject(data);
				} else if (data[codeName] === invalidCode) {
					// token失效，跳转到登录页
					uni.showToast({
						title: '登录已过期，请重新登录',
						icon: 'none'
					});
					
					// 清除本地存储的用户信息
					uni.removeStorageSync('userInfo');
					
					// 延迟跳转到登录页
					setTimeout(() => {
						uni.reLaunch({
							url: '/subpkg_login/pages/login/login'
						});
					}, 1500);
					
					reject(data);
				} else {
					// 其他错误
					uni.showToast({
						title: data.msg || '请求失败',
						icon: 'none'
					});
					reject(data);
				}
			},
			fail: (err) => {
				// 请求失败处理
				uni.showToast({
					title: '网络请求失败',
					icon: 'none'
				});
				reject(err);
			},
			complete: () => {
				// 隐藏加载中
				if (options.loading) {
					uni.hideLoading();
				}
			}
		});
	});
};

/**
 * GET请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 请求配置
 * @returns {Promise} Promise对象
 */
const get = (url, data = {}, options = {}) => {
	return request({
		url,
		method: 'GET',
		data,
		...options
	});
};

/**
 * POST请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 请求配置
 * @returns {Promise} Promise对象
 */
const post = (url, data = {}, options = {}) => {
	return request({
		url,
		method: 'POST',
		data,
		...options
	});
};

/**
 * PUT请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 请求配置
 * @returns {Promise} Promise对象
 */
const put = (url, data = {}, options = {}) => {
	return request({
		url,
		method: 'PUT',
		data,
		...options
	});
};

/**
 * DELETE请求
 * @param {String} url - 请求地址
 * @param {Object} data - 请求参数
 * @param {Object} options - 请求配置
 * @returns {Promise} Promise对象
 */
const del = (url, data = {}, options = {}) => {
	return request({
		url,
		method: 'DELETE',
		data,
		...options
	});
};

/**
 * 上传文件
 * @param {String} url - 上传地址
 * @param {String} filePath - 文件路径
 * @param {String} name - 文件对应的key
 * @param {Object} formData - 附加的表单数据
 * @param {Object} options - 其他选项
 * @returns {Promise} Promise对象
 */
const upload = (url, filePath, name = 'file', formData = {}, options = {}) => {
	const baseUrl = process.env.NODE_ENV === 'development' ? devUrl : prodUrl;
	const uploadUrl = url.startsWith('http') ? url : (baseUrl + url);
	
	// 获取Token
	const token = uni.getStorageSync('userInfo') ? 
		JSON.parse(uni.getStorageSync('userInfo'))[userTokenName] : '';
		
	// 设置请求头
	const header = {
		...options.header
	};
	
	// 添加Token到请求头
	if (token) {
		header[headerTokenName] = token;
	}
	
	if (options.loading !== false) {
		uni.showLoading({
			title: options.loadingText || '上传中...',
			mask: true
		});
	}
	
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: uploadUrl,
			filePath,
			name,
			formData,
			header,
			success: (res) => {
				// 字符串转JSON
				let data;
				try {
					data = JSON.parse(res.data);
				} catch (e) {
					data = res.data;
				}
				
				if (data[codeName] === successCode) {
					resolve(data);
				} else if (data[codeName] === invalidCode) {
					// token失效，跳转到登录页
					uni.showToast({
						title: '登录已过期，请重新登录',
						icon: 'none'
					});
					
					// 清除本地存储的用户信息
					uni.removeStorageSync('userInfo');
					
					// 延迟跳转到登录页
					setTimeout(() => {
						uni.reLaunch({
							url: '/subpkg_login/pages/login/login'
						});
					}, 1500);
					
					reject(data);
				} else {
					// 其他错误
					uni.showToast({
						title: data.msg || '上传失败',
						icon: 'none'
					});
					reject(data);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				});
				reject(err);
			},
			complete: () => {
				if (options.loading !== false) {
					uni.hideLoading();
				}
			}
		});
	});
};

export default {
	request,
	get,
	post,
	put,
	del,
	upload
} 