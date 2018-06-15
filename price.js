const CoinMarketCap = require('coinmarketcap-api'); 
const client = new CoinMarketCap();

//client.getListings().then(console.log).catch(console.error)

var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;


function getPrice(){
client.getTicker({id : 1765, convert : "KRW"}).then(result => {
 console.log(result);
 console.log(result.data.quotes.USD.price);
 console.log(result.data.quotes.KRW.price);
 //writing this value to DB
  MongoClient.connect(url, function(err, db) {
  var dbo = db.db("heroku_9472rtd6");
   var myobj = { $set : {exchange : "coinmarketcap", usd : result.data.quotes.USD.price, krw : result.data.quotes.KRW.price}  }
   dbo.collection("price").updateOne(myobj, function(err, res) {
        if (err) throw err;
          console.log("1 document updated");
              db.close();
        });
  });
   
   
}).catch(console.error);
}



//run query per minutes
setInterval(saveBlockInfo, 1000);
                                                    
