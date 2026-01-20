import api from './index';

export const adPlanApi = {
  create: (data) => api.post('/ad-plan', data),
  list: (params) => api.get('/ad-plan', { params }),
  detail: (id) => api.get(`/ad-plan/${id}`),
  update: (id, data) => api.put(`/ad-plan/${id}`, data),
  delete: (id) => api.delete(`/ad-plan/${id}`),
  batchUpdateStatus: (ids, status) => api.post('/ad-plan/batch/status', { ids, status }),
  batchDelete: (ids) => api.post('/ad-plan/batch/delete', { ids }),
};
