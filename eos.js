var Eos = require('eosjs') // Eos = require('./src')
var blockParse = require('./blockParse');

var botClient = require('./bot.js');
var url = process.env.MONGODB_URI;

const chainLogging = false;

// EOS
eosConfig = {
 httpEndpoint: "https://mainnet.eoscalgary.io"
}
eos = Eos(eosConfig) // 127.0.0.1:8888

// Getting starting block id
//var idx = 0;
var previousReadBlock = -1;

//set initial block
function getLatestBlock(){
 eos.getInfo({}).then(result => {
  startIndex = result.head_block_num;

  if(chainLogging == true)
   console.log("getinfo block", previousReadBlock);
  if(previousReadBlock <  startIndex){
   //idx = startIndex;
   //read block
   if(chainLogging == true)
    console.log("callong saveBlockInfo for block number");
   saveBlockInfo(startIndex);
  }else{
   setTimeout(getLatestBlock, 50);
   if(chainLogging == true)
    console.log("Do nothing", "previousReadBlock", "startIndex", "idx",previousReadBlock,startIndex) ;//do nothing
  }
 });
}

function formatData(data, type){
  if(type == "transfer"){
   msg = "Transfer Event";
   msg += "\n";
   msg += "To : " + data.to;
   msg += "\n";
   msg += "From : " + data.from;
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
  }else if(type == "ddos"){
   msg = "DDOS Event";
   msg += "\n";
   msg += "Memo : " + data.memo
  }else if(type == "issue"){
   msg = "Issue Event";
   msg += "\n";
   msg += "Quantity" + data.quantity;
   msg += "Memo : " + data.memo
  }else if(type == "bidname"){
   msg = "Account Bidding Event";
   msg += "\n";
   msg += "Account : " + data.newname   
   msg += "\n";
   msg += "Bidding Amount : " + data.bid
  }else if(type == "awakepet"){
   msg = "You waken PET";
  }else if(type == "createpet"){
   msg = "You created PET ";
   msg += data.pet_name;   
  }else if(type == "refund"){
   msg = "Refund Event";
  }else if(type == "updateauth"){
   msg = "Your Authority Updated";
   msg += "\n";
   msg += "Public Key " + data.auth.keys[0].key;
  }else if(type == "sellram"){
   msg = "You sell RAM";
   msg += "\n";
   msg += "Amount " + data.bytes;
  }else if(type == "buyram"){
   msg = "You buy RAM";
   msg += "\n";
   msg += "Amount " + data.quant + " to " + data.receiver;
  }else{
   //console.log("need to be implemented");
   msg = "This event will be supported in near future";
   msg += "\n";
   msg += "Event type : " + type;
   msg += "\n";
   //json object to stringfy
   const buf = Buffer.from(JSON.stringify(data));
   msg += buf;
  }
 
 return msg;
 
}
function saveData(block, account, data, type){
  var fData = formatData(data, type);
  botClient.sendAlarm(account, fData);
 /* Temporary disable saving data to MongoDB due to the size limit
  MongoClient.connect(url, function(err, db) {
   var dbo = db.db("heroku_9472rtd6");
   var fData = formatData(data, type);
   botClient.sendAlarm(account, fData);
   var myobj = { block : block, account : account, data : fData, report : false };
   dbo.collection("alarm").insertOne(myobj, function(err, res){
    if (err) throw err;
    //console.log("1 document inserted");
    db.close();   
   });
  }); 
  */
}
 
function checkAccount(result){
   //idx++;
 if(result.transactions.length == 0){
  return;
 }else{
  if(chainLogging == true)
  console.log("transaction length ", result.transactions.length);
  for(i = 0;i<result.transactions.length;i++){
  //check transaction type
  var trx = result.transactions[i].trx.transaction;
  if(trx == undefined)
   continue;
   for(j=0;j<trx.actions.length;j++){
    if(chainLogging == true)
    console.log("action length", trx.actions.length);
    if(trx.actions[j] ==  undefined)
     continue;
    
  var type = trx.actions[j].name;
  var data = trx.actions[j].data; 
  var account = null;
  if(type == "transfer"){
   account = data.to;
  }else if(type == "newaccount"){
   account = data.creator;
  }else if(type == "issue"){
   account = data.to;
  }else if(type == "voteproducer"){
   account = data.voter;  
  }else if(type == "undelegatebw"){
   account = data.from;
  }else if(type == "delegatebw"){
   account = data.from;
  }else if(type == "ddos"){
   account = trx.actions[0].account;
  }else if(type == "bidname"){
   account = data.bidder;
  }else if(type == "awakepet"){
   account = trx.actions[j].authorization[0].actor;
  }else if(type == "feedpet"){
   account = trx.actions[j].authorization[0].actor;
  }else if(type == "createpet"){
   account = trx.actions[j].authorization[0].actor;
  }else if(type == "refund"){
   account = data.owner;
  }else if(type == "buyram"){
   account = data.payer;
  }else if(type == "sellram"){
   account = data.account;
  }else if(type == "updateauth"){
   account = data.account;
  }else{
   //account = trx.actions[j].account //always exist
   //setting accountto from data with testing.
   account = blockParse.getAccountInfo (data);
   //console.log("need to be implemented", type);
  }
  
  //save data to proper account or new table?
  if(account != null){
   //save data to database and sending notification message to telegram client
   if(chainLogging == true)
   console.log("calling sendalarm in eosjs", account);
   saveData(result.block_num, account, data, type);
   account = null;
  }
   }//end of for, actions
 }//end of for of transaction
 }//end of else
 
}


 
function saveBlockInfo(idx){
 //console.log("saveBlockInfo for ",idx);
 eos.getBlock(idx).then(result => {
  retryCount = 0;
  if(chainLogging == true)
   console.log("read block suceess for block number", idx);
  checkAccount(result);
  //saving the latest success block number.
  previousReadBlock = idx;
  idx++;
  setTimeout(getLatestBlock, 50);
  })
 .catch((err) => {

  if(chainLogging == true)
   console.log("getblockfailed");

  console.log(err);
  setTimeout(getLatestBlock, 50);
 }); // end of getblock
} //end of function
                        
 setTimeout(getLatestBlock, 50);


