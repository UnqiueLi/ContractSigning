/**
 * 用户相关API接口封装
 */
import request from '../utils/request.js';
import settings from '../common/settings.js';

/**
 * 安全请求封装
 * 适用于特殊API，确保处理好JSON解析和错误
 * @param {String} url - 接口地址
 * @param {Object} data - 请求数据
 * @param {String} method - 请求方法
 * @returns {Promise} Promise对象
 */
const safeRequest = (url, data = {}, method = 'POST') => {
	return new Promise((resolve, reject) => {
		const baseUrl = process.env.NODE_ENV === 'development' ? settings.devUrl : settings.prodUrl;

		// 获取token
		const token = uni.getStorageSync('token');
		console.log(token,"---=====")
		uni.request({
			url: baseUrl + url,
			method: method,
			data: data,
			header: {
				'Authorization': 'Bearer ' + token
			},
			success: (res) => {
				console.log(`${url} 响应原始数据:`, res);

				let responseData;
				try {
					responseData = typeof res.data === 'string' ? JSON.parse(res.data) : res
						.data;
				} catch (e) {
					console.error('响应数据解析错误:', e);
					console.log('原始响应文本:', res.data);
					reject(new Error('服务器响应格式错误'));
					return;
				}

				resolve(responseData);
			},
			fail: (err) => {
				console.error(`${url} 请求失败:`, err);
				reject(err);
			}
		});
	});
};
const safeRequestGet = (url, method = 'get') => {
	return new Promise((resolve, reject) => {
		const baseUrl = process.env.NODE_ENV === 'development' ? settings.devUrl : settings.prodUrl;

		// 获取token
		const token = uni.getStorageSync('token');

		uni.request({
			url: baseUrl + url,
			method: method,
			// data: data,
			header: {
				'Authorization': 'Bearer ' + token
				// [settings.headerTokenName]: token // 添加token到header
			},
			success: (res) => {
				console.log(`${url} 响应原始数据:`, res);

				let responseData;
				try {
					responseData = typeof res.data === 'string' ? JSON.parse(res.data) : res
						.data;
				} catch (e) {
					console.error('响应数据解析错误:', e);
					console.log('原始响应文本:', res.data);
					reject(new Error('服务器响应格式错误'));
					return;
				}

				resolve(responseData);
			},
			fail: (err) => {
				console.error(`${url} 请求失败:`, err);
				reject(err);
			}
		});
	});
};


/**
 * 用户登录与认证相关API
 */
const authApi = {
	wxLogin: (data) => safeRequest('/mini/wxLogin', data), // 登录
	decryptPhone: (data) => safeRequest('/mini/decryptPhone',data), // 获取解密登录手机号
	myLogin: (data) => safeRequest('/mini/login', data),//获取token
	myInfo: () => safeRequestGet('/mini/getInfo'),//获取token
};

/**
 * 用户信息相关API
 */
const userApi = {
	register: (data) => safeRequest('/mini/register',data), //轮播图列表
	contractCount: () => safeRequestGet('/mini/getContractCount'), //首页统计
	upload: (data) => safeRequest('/common/upload',data), //附件上传
	// uploadPic: (data) => safeRequest('/mini/pasture/uploadPic', data), //上传图片
	// uploadVideo: (data) => safeRequest('/mini/pasture/uploadVideo', data), //上传视频
	// userList: (id) => safeRequestGet('/mini/pasture/list/' + id), //牧草信息列表
	// add: (data) => safeRequest('/mini/pasture/add', data), //新增牧草信息
	// edit: (data) => safeRequest('/mini/pasture/edit', data), //修改牧草信息
	// pastureList: (id) => safeRequestGet('/mini/pasture/' + id), //牧草信息列表
	// edit: (data) => safeRequest('/mini/pasture/edit', data), //修改牧草信息
	// userListCg: (id) => safeRequestGet('/mini/userList'),//牧户列表
	// addUser: (data) => safeRequest('/mini/addUser',data),//新增牧户
	
	// getUserInfo: (id) => safeRequestGet('/mini/getUserInfo/' + id), //牧草信息列表
	
	
	
};

export {
	authApi,
	userApi
};