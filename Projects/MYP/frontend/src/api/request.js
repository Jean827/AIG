import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: typeof import.meta !== 'undefined' ? (import.meta.env.VITE_API_BASE_URL || '/') : '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理错误
    if (error.response) {
      // 服务器返回错误状态码
      if (error.response.status === 401) {
        // 未授权，跳转到登录页面
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default request;