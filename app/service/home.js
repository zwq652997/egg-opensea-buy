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
      'https://api.opensea.io/v2/orders/ethereum/seaport/listings?asset_contract_address=0x36967c741e2e9c3b012e7a85595d1e3cc514b6e1&limit=1&token_ids=2584&order_by=created_date&order_direction=desc',
      {
        // 自动解析 JSON response
        dataType: 'json',
        headers: {
          accept: 'application/json',
        },
        // 10 秒超时
        timeout: 10000,
      }
    );
    //return result.data.orders[0];
    console.log(result.headers);
    if (result.data.orders.length == 0) {
      this.ctx.throw(500, 'not order');
      return false;
    }

    return await this.seaportFunction(result.data.orders[0].protocol_data);
  }
  async seaportFunction(orderInfo) {
    const { actions, executeAllFulfillActions } =
      await this.seaport.fulfillOrder({
        order: orderInfo,
        accountAddress: '0x556d83E8ABf3abdE00cC36B08A2f2dD7dc61ff17',
      });

    let obj = await actions[0].transactionMethods.buildTransaction();
    // await actions[0].transactionMethods.estimateGas();
    let gas = await this.provider.estimateGas(obj);
    let gasLimit = Math.ceil(parseInt(gas) * 1.3);
    return { ...obj, gasLimit };
  }
};
