const { Controller } = require('egg');
const axios = require('axios');

class HomeController extends Controller {
  async index() {
    const { ctx, service } = this;
    const data = await ctx.service.home.getOpenseaData();
    ctx.body = data;
  }
}

module.exports = HomeController;
