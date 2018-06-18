Eos = require('eosjs') // Eos = require('./src')

var mongo = require('mongodb');

var botClient = require('./bot.js');

var start = 0;
var pre_start = 0;


var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

 
eosConfig = {
httpEndpoint: "http://mainnet.eoscalgary.io"
}
 
eos = Eos(eosConfig) // 127.0.0.1:8888

//getting starting block id
idx = 0;




//set initial block
eos.getInfo({}).then(result => {
 console.log(result);
 startIndex = result.head_block_num;
 idx = startIndex - 3;
 setInterval(saveBlockInfo, 500);
});

function formatData(data, type){
  if(type == "transfer"){
   msg = "Transfer Event";
   msg += "\n";
   msg += "To : " + data.to;
   msg += "\n";
   msg += "Transfer Amount : " + data.quantity;
   msg += "\n";
   msg += "Memo : " + data.memo
  }else if(type == "newaccount"){
   msg = "New Account Event";
   msg += "\n";
   msg += "Created Account : " + data.name;
  }else if(type == "voteproducer"){
   msg = "Voting Event";
   msg += "\n";
   msg += "Voted to"
   msg += "\n";
   for(i = 0;i < data.producers.length;i++){
    msg += data.producers[i] + ", ";
   }
  }else if(type == "undelegatebw"){
   msg = "EOS Unstake Event";
   msg += "\n";
   msg += "Unstaked for Network : " + data.unstake_net_quantity
   msg += "\n";
   msg += "Unstaked for CPU : " + data.unstake_cpu_quantity
   
  }else if(type == "delegatebw"){
   msg = "EOS Staking Event";
   msg += "\n";
   msg += "Staked for Network : " + data.stake_net_quantity
   msg += "\n";
   msg += "Staked for CPU : " + data.stake_cpu_quantity
  }else{
   console.log("need to be implemented");
   msg = "This event will be supported in near future)";
   msg += type;
   msg += "\n";
   msg += data;
  }
 
 return msg;
 
}

function saveData(block, account, data, type){
  MongoClient.connect(url, function(err, db) {
   var dbo = db.db("heroku_9472rtd6");
   var fData = formatData(data, type);
   botClient.sendAlarm(account, fData);
   //performance check
    console.log("performance on eos ", Date.now() - start);
    console.log("setinterval duration ", start - pre_start);
    pre_start = start;
    //performance check
   var myobj = { block : block, account : account, data : fData, report : false };
   dbo.collection("alarm").insertOne(myobj, function(err, res){
    if (err) throw err;
    //console.log("1 document inserted");
    db.close();   

   });
  }); 
}
 
function checkAccount(result){
   idx++;
 if(result.transactions.length == 0){
  return;
 }else{
  //check transaction type
  var trx = result.transactions[0].trx.transaction;
  if(trx == undefined)
   return;
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
  }else if(type == "delegatebw"){
   account = data.from;
  }else{
   console.log("need to be implemented", type);
  }
  
  //save data to proper account or new table?
  if(account != null){
   //save data to database
   saveData(result.block_num, account, data, type);
  }
 }
 
}

 

function saveBlockInfo(){
 start = Date.now();
 //console.log("saveBlockInfo for ",idx);
 eos.getBlock(idx).then(result => {
  //console.log(result);
  //console.log(result.transactions[0].trx.transaction.actions[0]);
  //save data to Mongo DB with block number
  console.log("read Block info ", idx);
  checkAccount(result);

  /* save raw data
  MongoClient.connect(url, function(err, db) {
   
   if (err){
    console.log(err);
    throw err;
   }
   var dbo = db.db("heroku_9472rtd6");
   //var myobj = { bno : idx, info : result.transactions[0].trx.transaction.actions[0] }
   var myobj = { bno : idx, info : result }
   
   dbo.collection("eosblockinfo").insertOne(myobj, function(err, res) {
        if (err) throw err;
          //console.log("1 document inserted");
       idx++;
              db.close();
    }); //end of insert one
   }); //end of connect
  */
  }); // end of getblock

} //end of function
                        



