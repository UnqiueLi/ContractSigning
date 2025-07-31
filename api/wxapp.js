/**
 * 微信小程序API接口封装
 */
import request from '../utils/request.js';
import settings from '../common/settings.js';

/**
 * 登录相关API
 */
const loginApi = {
  /**
   * 采购员登录
   * @param {Object} data - 登录参数
   * @param {String} data.username - 用户名/手机号
   * @param {String} data.password - 密码
   * @param {Number} data.roleType - 用户角色类型(1-牧户,2-采购员)
   * @returns {Promise} Promise对象
   */
  buyerLogin: (data) => {
    return new Promise((resolve, reject) => {
      const baseUrl = process.env.NODE_ENV === 'development' ? settings.devUrl : settings.prodUrl;
      
      uni.request({
        url: `${baseUrl}/mini/buyerLogin`,
        method: 'POST',
        data: data,
        header: {
          'content-type': settings.contentType
        },
        success: (res) => {
          console.log('登录响应原始数据:', res);
          
          let responseData;
          try {
            responseData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            console.log('处理后的响应数据:', responseData);
          } catch (e) {
            console.error('响应数据解析错误:', e);
            console.log('原始响应文本:', res.data);
            reject(new Error('服务器响应格式错误'));
            return;
          }
          
          resolve(responseData);
        },
        fail: (err) => {
          console.error('请求失败:', err);
          reject(err);
        }
      });
    });
  },

  /**
   * 获取用户信息
   * @returns {Promise} Promise对象
   */
  getUserInfo: () => request.get('/mini/getUserInfo'),
  
  /**
   * 退出登录
   * @returns {Promise} Promise对象
   */
  logout: () => request.post('/mini/logout'),

  /**
   * 刷新用户token
   * @returns {Promise} Promise对象
   */
  refreshToken: () => request.post('/mini/refreshToken')
};

/**
 * 其他微信小程序功能API
 */
const wxAppApi = {
  /**
   * 获取小程序码
   * @param {Object} params - 参数
   * @returns {Promise} Promise对象
   */
  getQrCode: (params) => request.post('/mini/getQrCode', params),
  
  /**
   * 微信小程序消息订阅
   * @param {Object} data - 参数
   * @returns {Promise} Promise对象
   */
  subscribeMessage: (data) => request.post('/mini/subscribe', data)
};

export {
  loginApi,
  wxAppApi
};
