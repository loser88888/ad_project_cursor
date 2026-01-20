'use strict';

module.exports = () => {
  return async function responseHandler(ctx, next) {
    try {
      await next();
      
      // 如果响应已经设置，直接返回
      if (ctx.body !== undefined) {
        // 如果已经是统一格式，直接返回
        if (ctx.body.code !== undefined) {
          return;
        }
        
        // 转换为统一格式
        ctx.body = {
          code: ctx.status === 200 ? 200 : ctx.status,
          message: ctx.body.message || '操作成功',
          data: ctx.body,
        };
      }
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = {
        code: err.status || 500,
        message: err.message || '服务器内部错误',
        data: null,
      };
      ctx.app.emit('error', err, ctx);
    }
  };
};
