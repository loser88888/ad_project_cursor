import api from './index';

export const userApi = {
  // 用户注册
  register: (data) => {
    return api.post('/user/register', {
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
  },
  
  // 用户登录
  login: (data) => {
    return api.post('/user/login', {
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
  },
  
  // 获取用户信息
  getUserInfo: () => {
    return api.get('/user/info');
  },
  
  // 更新用户信息
  updateUserInfo: (data) => {
    return api.put('/user/info', {
      username: data.username,
      avatar: data.avatar,
    });
  },
  
  // 修改密码
  changePassword: (data) => {
    return api.put('/user/password', {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  },
};
