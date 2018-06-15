const CoinMarketCap = require('coinmarketcap-api');
 
const client = new CoinMarketCap();

//client.getListings().then(console.log).catch(console.error)

client.getTicker({id : 1765}).then(result => {
 console.log(result);
 console.log(result.quotes.USD.price);
}).catch(console.error);
