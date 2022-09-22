const ethers = require('ethers');
const Seaport = require('@opensea/seaport-js');
let instance = null;
module.exports.getSeaportInstance = function (provider) {
  if (!instance) {
    const CROSS_CHAIN_DEFAULT_CONDUIT_KEY =
      '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000';
    const CROSS_CHAIN_DEFAULT_CONDUIT =
      '0x1e0049783f008a0085193e00003d00cd54003c71';

    const CONDUIT_KEYS_TO_CONDUIT = {
      [CROSS_CHAIN_DEFAULT_CONDUIT_KEY]: CROSS_CHAIN_DEFAULT_CONDUIT,
    };

    instance = new Seaport.Seaport(provider, {
      conduitKeyToConduit: CONDUIT_KEYS_TO_CONDUIT,
      overrides: {
        defaultConduitKey: CROSS_CHAIN_DEFAULT_CONDUIT_KEY,
      },
    });
  }
  return instance;
};
