/**
 * API调用示例
 * 演示如何使用封装的请求方法
 */
import request from './request.js';
import settings from '../common/settings.js';

/**
 * 登录请求的专用方法，处理特殊情况
 * @param {Object} data - 登录数据
 * @returns {Promise} Promise对象
 */
const login = (data) => {
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
};

// 用户相关接口
const userApi = {
  // 用户登录
  login,
  
  // 获取用户信息
  getUserInfo: () => request.get('/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => request.put('/user/info', data)
};

// 牧草相关接口
const grassApi = {
  // 获取牧草列表
  getGrassList: (params) => request.get('/grass/list', params),
  
  // 获取牧草详情
  getGrassDetail: (id) => request.get(`/grass/detail/${id}`),
  
  // 添加牧草
  addGrass: (data) => request.post('/grass/add', data),
  
  // 更新牧草信息
  updateGrass: (data) => request.put('/grass/update', data),
  
  // 删除牧草
  deleteGrass: (id) => request.del(`/grass/delete/${id}`),
  
  // 上传牧草图片
  uploadGrassImage: (filePath) => request.upload('/upload/image', filePath)
};

// 牧户相关接口
const herdsmanApi = {
  // 获取牧户列表
  getHerdsmanList: (params) => request.get('/herdsman/list', params),
  
  // 获取牧户详情
  getHerdsmanDetail: (id) => request.get(`/herdsman/detail/${id}`),
  
  // 添加牧户
  addHerdsman: (data) => request.post('/herdsman/add', data),
  
  // 更新牧户信息
  updateHerdsman: (data) => request.put('/herdsman/update', data),
  
  // 删除牧户
  deleteHerdsman: (id) => request.del(`/herdsman/delete/${id}`)
};

// 微信相关接口
const wxApi = {
  // 小程序登录
  wxappLogin: (code) => request.get('/Index/wxappLogin', { code }),
  
  // 公众号授权登录
  wechatLogin: (params) => request.get('/Wechatoauth/accesstoken', params),
  
  // 获取签名
  getSign: (params) => request.get('/WechatScript/getSignPackage', params)
};

export {
  userApi,
  grassApi,
  herdsmanApi,
  wxApi
}; 