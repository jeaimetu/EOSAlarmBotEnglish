const CoinMarketCap = require('coinmarketcap-api'); 
const client = new CoinMarketCap();

const Bithumb = require('bithumb.js')
const bithumb = new Bithumb('', '');

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
   
   var findquery = { exchange : "coinmarketcap" };
   dbo.collection("price").findOne(findquery, function(err, res){
    if(res == null){
     //insert
     var myobj = { exchange : "coinmarketcap", usd : result.data.quotes.USD.price, krw : result.data.quotes.KRW.price }
     dbo.collection("price").insertOne(myobj, function(err, res) {
        if (err) throw err;
          console.log("1 document inserted");
              db.close();
        });
    }else{
     //update
     var myobj = { $set : {exchange : "coinmarketcap", usd : result.data.quotes.USD.price, krw : result.data.quotes.KRW.price}  }
     dbo.collection("price").updateOne(findquery, myobj, function(err, res) {
        if (err) throw err;
          console.log("1 document updated");
              db.close();
        });//end of updateone
    }//end of else
   });//end of find query
  });//end of mongo
   
   
}).catch(console.error);
}

function getPriceBithumb(){
bithumb.getTicker('EOS', function(result){
 console.log(result);
 console.log(result.data.sell_price);
 console.log(result.data.buy_price );
 //writing this value to DB
  MongoClient.connect(url, function(err, db) {
  var dbo = db.db("heroku_9472rtd6");
   
   var findquery = { exchange : "bithumb" };
   dbo.collection("price").findOne(findquery, function(err, res){
    if(res == null){
     //insert
     var myobj = { exchange : "bithumb", krw : result.data.sell_price, krwbuy : result.data.buy_price }
     dbo.collection("price").insertOne(myobj, function(err, res) {
        if (err) throw err;
          console.log("1 document inserted");
              db.close();
        });
    }else{
     //update
     var myobj = { $set : {exchange : "bithumb", krw : result.data.sell_price, krwbuy : result.data.buy_price}  }
     dbo.collection("price").updateOne(findquery, myobj, function(err, res) {
        if (err) throw err;
          console.log("1 document updated");
              db.close();
        });//end of updateone
    }//end of else
   });//end of find query
  });//end of mongo
   
   
}).catch(console.error);
}



//run query per minutes
setInterval(getPrice,getPriceBithumb, 1000);

                                                    
