const CoinMarketCap = require('coinmarketcap-api');
 
const client = new CoinMarketCap();

client.getTicker({currency: ''}).then(console.log).catch(console.error);
