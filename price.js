const CoinMarketCap = require('coinmarketcap-api');
 
const client = new CoinMarketCap();

//client.getListings().then(console.log).catch(console.error)

client.getTicker({id : 5}).then(console.log).catch(console.error);
