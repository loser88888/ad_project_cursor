import api from './index';

export const adAccountApi = {
  // 创建广告账户
  create: (data) => {
    return api.post('/ad-account', {
      platform: data.platform,
      accountName: data.accountName,
      accountId: data.accountId,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    });
  },
  
  // 获取广告账户列表
  list: (params) => {
    return api.get('/ad-account', { params });
  },
  
  // 获取广告账户详情
  detail: (id) => {
    return api.get(`/ad-account/${id}`);
  },
  
  // 更新广告账户
  update: (id, data) => {
    return api.put(`/ad-account/${id}`, data);
  },
  
  // 删除广告账户
  delete: (id) => {
    return api.delete(`/ad-account/${id}`);
  },
  
  // 同步账户信息
  sync: (id) => {
    return api.post(`/ad-account/${id}/sync`);
  },
  
  // 获取授权URL
  getAuthUrl: (platform) => {
    return api.get('/ad-account/auth/url', { params: { platform } });
  },
};
