const Service = require('egg').Service;
const ethers = require('ethers');
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
      'https://api.opensea.io/v2/orders/ethereum/seaport/listings?asset_contract_address=0xedf5d556975509303790f53bca834230c72f3f6e&limit=1&token_ids=4290&order_by=created_date&order_direction=desc',
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
    if (result.data.orders.length == 0) {
      this.ctx.throw(500, 'not order');
      return false;
    } else if (result.data.orders[0].order_type != 'basic') {
      this.ctx.throw(500, 'order_type not basic');
      return false;
    }
    return await this.seaportFunction(
      result.data.orders[0].protocol_data,
      result.data.orders[0].current_price
    );
  }
  async seaportFunction(orderInfo, current_price) {
    const { actions, executeAllFulfillActions } =
      await this.seaport.fulfillOrder({
        order: orderInfo,
        accountAddress: '0x556d83E8ABf3abdE00cC36B08A2f2dD7dc61ff17',
      });

    let obj = await actions[0].transactionMethods.buildTransaction();
    // await actions[0].transactionMethods.estimateGas();
    let gas = await this.provider.estimateGas(obj);
    let gasLimit = Math.ceil(parseInt(gas) * 1.3);
    console.log(
      ethers.utils.parseUnits('0.035000000000000000').toString() ===
        current_price
    );
    return {
      ...obj,
      gasLimit,
      price: current_price,
    };
  }
};
