module.exports = () => {
  return async function errrorHanlder(ctx, next) {
    try {
      await next();
    } catch (error) {
      // 记录日志用
      ctx.app.emit('error', error, ctx);
      // 同一异常返回
      ctx.status = 200;
      ctx.body = {
        success: Boolean(false),
        data: error.message,
        code: 500,
      };
    }
  };
};
