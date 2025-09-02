import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: '/api', // 基础URL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以添加认证信息等
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 处理响应数据
    return response.data;
  },
  (error) => {
    // 处理响应错误
    if (error.response) {
      // 根据状态码处理错误
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          window.location.href = '/login';
          break;
        case 403:
          // 禁止访问
          console.error('禁止访问');
          break;
        case 404:
          // 资源不存在
          console.error('请求资源不存在');
          break;
        default:
          // 其他错误
          console.error('请求出错', error.response.data);
      }
    } else if (error.request) {
      // 请求已发送但未收到响应
      console.error('无响应', error.request);
    } else {
      // 设置请求时发生错误
      console.error('请求错误', error.message);
    }
    return Promise.reject(error);
  }
);

export default request;