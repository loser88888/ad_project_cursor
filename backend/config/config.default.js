'use strict';

module.exports = appInfo => {
  const config = {};

  config.keys = appInfo.name + '_ad_buying_plane_2024';

  // 数据库配置
  config.mongoose = {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/ad_buying_plane',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  };

  // JWT配置
  config.jwt = {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: '7d',
  };

  // CORS配置
  config.cors = {
    origin: process.env.CORS_ORIGIN || '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
  };

  // 安全配置
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 加密配置
  config.crypto = {
    secret: process.env.CRYPTO_SECRET || 'your-crypto-secret-key-change-in-production',
  };

  // 基础URL配置
  config.baseUrl = process.env.BASE_URL || 'http://localhost:7001';

  // 中间件配置
  config.middleware = ['response'];

  return config;
};
