'use strict';

module.exports = () => {
  return async function jwtAuth(ctx, next) {
    const token = ctx.request.header.authorization;
    
    if (!token) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: '未提供认证令牌',
        data: null,
      };
      return;
    }

    try {
      const decoded = ctx.app.jwt.verify(
        token.replace('Bearer ', ''),
        ctx.app.config.jwt.secret
      );
      ctx.state.user = decoded;
      await next();
    } catch (err) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: '认证令牌无效或已过期',
        data: null,
      };
    }
  };
};
