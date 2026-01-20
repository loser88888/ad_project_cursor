'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const jwt = middleware.jwt();

  // 公开路由（无需认证）
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/check-email', controller.user.checkEmail); // 调试用：检查邮箱是否存在

  // 需要认证的路由
  router.get('/api/user/info', jwt, controller.user.getUserInfo);
  router.put('/api/user/info', jwt, controller.user.updateUserInfo);
  router.put('/api/user/password', jwt, controller.user.changePassword);

  // 广告账户相关路由
  router.post('/api/ad-account', jwt, controller.adAccount.create);
  router.get('/api/ad-account', jwt, controller.adAccount.list);
  router.get('/api/ad-account/:id', jwt, controller.adAccount.detail);
  router.put('/api/ad-account/:id', jwt, controller.adAccount.update);
  router.delete('/api/ad-account/:id', jwt, controller.adAccount.delete);
  router.post('/api/ad-account/:id/sync', jwt, controller.adAccount.sync);
  router.get('/api/ad-account/auth/url', jwt, controller.adAccount.getAuthUrl);

  // 广告计划相关路由
  router.post('/api/ad-plan', jwt, controller.adPlan.create);
  router.get('/api/ad-plan', jwt, controller.adPlan.list);
  router.get('/api/ad-plan/:id', jwt, controller.adPlan.detail);
  router.put('/api/ad-plan/:id', jwt, controller.adPlan.update);
  router.delete('/api/ad-plan/:id', jwt, controller.adPlan.delete);
  router.post('/api/ad-plan/batch/status', jwt, controller.adPlan.batchUpdateStatus);
  router.post('/api/ad-plan/batch/delete', jwt, controller.adPlan.batchDelete);

  // 广告创意相关路由
  router.post('/api/ad-creative/upload', jwt, controller.adCreative.upload);
  router.post('/api/ad-creative', jwt, controller.adCreative.create);
  router.get('/api/ad-creative', jwt, controller.adCreative.list);
  router.get('/api/ad-creative/:id', jwt, controller.adCreative.detail);
  router.put('/api/ad-creative/:id', jwt, controller.adCreative.update);
  router.delete('/api/ad-creative/:id', jwt, controller.adCreative.delete);

  // 统计数据相关路由
  router.get('/api/statistics', jwt, controller.statistics.getStatistics);
};
