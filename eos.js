Eos = require('eosjs') // Eos = require('./src')

var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

 
eosConfig = {
httpEndpoint: "http://mainnet.eoscalgary.io"
}
 
eos = Eos(eosConfig) // 127.0.0.1:8888

//getting starting block id
idx = 825992;




/*
eos.getInfo({}).then(result => {
 console.log(result);
 startIndex = result.last_irreversible_block_num;
 idx = startIndex - 1000;
});
*/

function saveData(block, account, data){
  MongoClient.connect(url, function(err, db) {
   var dbo = db.db("heroku_9472rtd6");
   var myobj = { block : block, account : account, data : data };
   dbo.collection("alarm").insertOne(myobj, function(err, res){
    if (err) throw err;
    console.log("1 document inserted");
    db.close();   
   });
  }); 
}
 
function checkAccount(result){
 if(result.transactions.length == 0){
  return;
 }else{
  //check transaction type
  var trx = result.transactions[0].trx.transaction;
  var type = trx.actions[0].name;
  var data = trx.actions[0].data;
  var account = null;
  if(type == "transfer"){
   account = data.from;
  }else if(type == "newaccount"){
   account = data.creator;
  }else if(type == "voteproducer"){
   account = data.voter;  
  }else if(type == "undelegatebw"){
   account = data.from;
  }else{
   console.log("need to be implemented");
  }
  
  //save data to proper account or new table?
  if(account != null){
   //save data to database
   saveData(result.block_num, account, data);
  }
 }
 
}

 
function saveBlockInfo(){
 console.log("saveBlockInfo for ",idx);
 eos.getBlock(idx).then(result => {
  console.log(result);
  //console.log(result.transactions[0].trx.transaction.actions[0]);
  //save data to Mongo DB with block number
  MongoClient.connect(url, function(err, db) {
   
   if (err){
    console.log(err);
    throw err;
   }
   var dbo = db.db("heroku_9472rtd6");
   //var myobj = { bno : idx, info : result.transactions[0].trx.transaction.actions[0] }
   var myobj = { bno : idx, info : result }
   checkAccount(result);
   dbo.collection("eosblockinfo").insertOne(myobj, function(err, res) {
        if (err) throw err;
          console.log("1 document inserted");
       idx++;
              db.close();
    }); //end of insert one
   }); //end of connect

  }); // end of getblock
} //end of function
                        


setInterval(saveBlockInfo, 500);
