import api from './index';

export const adCreativeApi = {
  create: (data) => api.post('/ad-creative', data),
  list: (params) => api.get('/ad-creative', { params }),
  detail: (id) => api.get(`/ad-creative/${id}`),
  update: (id, data) => api.put(`/ad-creative/${id}`, data),
  delete: (id) => api.delete(`/ad-creative/${id}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/ad-creative/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
