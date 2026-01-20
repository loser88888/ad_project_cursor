import api from './index';

export const statisticsApi = {
  getStatistics: (params) => api.get('/statistics', { params }),
};
