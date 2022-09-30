const ethers = require('ethers');
let instance = null;
module.exports.getProvidersInstance = function () {
  if (!instance)
    instance = new ethers.providers.JsonRpcProvider(
      //`https://api.opensea.io/jsonrpc/v1/`
      'https://eth-mainnet.g.alchemy.com/v2/Kc3NPEq2oqwd9_p1bo_wsMcucm3OUMiE'
    );
  return instance;
};
