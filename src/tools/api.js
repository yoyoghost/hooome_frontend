import axios from 'axios';

// 创建一个 axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:6633', // 你的后端 API 基础路径
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    // 其他默认头部信息
  },
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如，添加认证令牌
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data; // 返回响应的数据部分
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.error('Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('Network Error:', error.request);
    } else {
      // 发生了一些问题，导致请求无法发出
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;