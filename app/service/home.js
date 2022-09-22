const Service = require('egg').Service;
const { getProvidersInstance } = require('../utils/ProvidersInstance.js');
const { getSeaportInstance } = require('../utils/SeaportInstance.js');

module.exports = class HomeService extends Service {
  constructor(ctx) {
    super(ctx);
    this.provider = getProvidersInstance();
    this.seaport = getSeaportInstance(this.provider);
  }
  async getOpenseaData() {
    const result = await this.ctx.curl(
      'https://api.opensea.io/v2/orders/ethereum/seaport/listings?asset_contract_address=0xfa89a298755282c827af308ad73d24e56f30e30c&limit=1&token_ids=7112&order_by=created_date&order_direction=desc',
      {
        // 自动解析 JSON response
        dataType: 'json',
        headers: {
          accept: 'application/json',
          'X-API-KEY': '3ab57c2b1f344f138531b564544acdef',
        },
        // 10 秒超时
        timeout: 10000,
      }
    );
    return await this.seaportFunction(result.data.orders[0].protocol_data);
  }
  async seaportFunction(orderInfo) {
    const { actions } = await this.seaport.fulfillOrder({
      order: orderInfo,
      accountAddress: '0x556d83E8ABf3abdE00cC36B08A2f2dD7dc61ff17',
    });
    return await actions[0].transactionMethods.buildTransaction();
  }
};
