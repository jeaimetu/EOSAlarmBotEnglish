
const coinmarketcap = require('coinmarketcap')

coinmarketcap.tickerByAsset('eos', (result) => {
  console.log(result);
});

