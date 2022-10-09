const { Controller } = require('egg');

class HomeController extends Controller {
  // ?token=123&address=123&contract=123
  async index() {
    const { ctx, service } = this;
    const { address, token, contract } = ctx.query;
    // this.ctx.body = {
    //   code: 200,
    //   data: 123123,
    //   success: true,
    // };
    const result = await ctx.curl('https://ifconfig.me/ip', {
      method: 'GET',
    });
    console.log(result.data.toString());
    return false;

    if (!address || !token || !contract) {
      this.ctx.throw(500, '参数异常');
    }
    const data = await ctx.service.home.getOpenseaData();
    ctx.body = {
      code: 200,
      data,
      success: true,
    };
  }
}

module.exports = HomeController;
