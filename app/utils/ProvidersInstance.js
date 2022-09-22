const ethers = require('ethers');
let instance = null;
module.exports.getProvidersInstance = function () {
  if (!instance)
    instance = new ethers.providers.JsonRpcProvider(
      `https://api.opensea.io/jsonrpc/v1/`
    );
  return instance;
};
