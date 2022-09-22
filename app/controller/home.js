const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx, service } = this;
    const data = await ctx.service.home.getOpenseaData();
    ctx.body = data;
  }
}

module.exports = HomeController;
