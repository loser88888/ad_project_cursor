import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../store';
import router from '../router';

// 创建Axios实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 后端返回的统一格式：{ code, message, data }
    // 直接返回 data 字段，方便前端使用
    return response.data;
  },
  error => {
    // 处理错误响应
    if (error.response) {
      const { status, data } = error.response;
      
      // 401 未授权，清除token并跳转登录
      if (status === 401) {
        const userStore = useUserStore();
        userStore.logout();
        ElMessage.error('登录已过期，请重新登录');
        router.push('/login');
        return Promise.reject(data);
      }
      
      // 其他错误，显示错误信息
      const message = data?.message || '请求失败';
      ElMessage.error(message);
      return Promise.reject(data || { code: status, message, data: null });
    }
    
    // 网络错误
    ElMessage.error('网络错误，请检查网络连接');
    return Promise.reject({ code: 0, message: '网络错误', data: null });
  }
);

export default api;
