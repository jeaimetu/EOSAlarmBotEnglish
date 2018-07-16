var Telegraf = require('telegraf');   // Module to use Telegraf API.
var config = require('./config'); // Configuration file that holds telegraf_token API key.
var session = require('telegraf/session')
var Extra = require('telegraf/extra')
var Markup = require('telegraf/markup')
var tl = require('common-tags')
var partner = require('./partner.js');

// Mongo
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

// EOS
EosApi = require('eosjs-api')
eosconfig = {
 httpEndpoint: "https://mainnet.eoscalgary.io"
}

eos = EosApi(eosconfig)

// Menu
const keyboard = Markup.inlineKeyboard([
 [ Markup.callbackButton('😎 Add Account', 'id'),
   Markup.callbackButton('💰 EOS Balance', 'balance') ],
 [ Markup.callbackButton('📈 EOS Price', 'price'),
   Markup.callbackButton('🔮 Token Balance','token'),
   Markup.callbackButton('💾 RAM Price','ram'),
   Markup.callbackButton('🔧 Settings', 'setting') ]
])

// Reset
function reset(ctx){
 ctx.session.id = 'nil';
 ctx.session.transaction = 'nil';
}

// Initialization Message
function makeMessage(ctx){
  return `${ctx.session.id != 'nil' 
               ? 'Current account: ' + ctx.session.id 
               : 'Click Add Account button to get started.'}

<b>Please vote for eoscafeblock</b>, eosyskoreabp, eosnodeonebp, and acroeos12345.
© EOS Cafe Korea`
}

// Get token balance
async function getAddBalance(account){
 let bal = await eos.getTableRows({json : true,
                      code : "eosadddddddd",
                 scope: account,
                 table: "accounts",
                 }).catch((err) => {
  return null});
 if(bal.rows.length != 0)
 return bal.rows[0].balance;
 else
  return null;
}

async function getDacBalance(account){
 let bal = await eos.getTableRows({json : true,
                      code : "eosdactokens",
                 scope: account,
                 table: "accounts",
                 }).catch((err) => {
  return null});;
  if(bal.rows.length != 0)
 return bal.rows[0].balance;
 else
  return null;
}

async function getTokenBalanceEach(account, tokenCode){
 let bal = await eos.getTableRows({json : true,
                      code : tokenCode,
                 scope: account,
                 table: "accounts",
                 }).catch((err) => {
  return null});;
  if(bal.rows.length != 0)
 return bal.rows[0].balance;
 else
  return null;
}

async function getCetBalance(account){
 let bal = await eos.getTableRows({json : true,
                      code : "eosiochaince",
                 scope: account,
                 table: "accounts",
                 }).catch((err) => {
  return null});;
  if(bal.rows.length != 0)
 return bal.rows[0].balance;
 else
  return null;
}

async function getCetosBalance(account){
 let bal = await eos.getTableRows({json : true,
                      code : "gyztomjugage",
                 scope: account,
                 table: "accounts",
                 }).catch((err) => {
  return null});;
  if(bal.rows.length != 0)
 return bal.rows[0].balance;
 else
  return null;
}


async function getTokenBalance(account, cb){
 let [addBalance, dacBalance, cetBalance, ednaBalance, horusBalance,eoxBalance, evrBalance, esbBalance, atdBalance,
      octBalance, iqBalance, pglBalance, poorBalance, chlBalance] = 
     await Promise.all([getAddBalance(account), 
                        getDacBalance(account), 
                        getCetBalance(account),
                        getTokenBalanceEach(account, "ednazztokens"),
                        getTokenBalanceEach(account, "horustokenio"),            
                        getTokenBalanceEach(account, "eoxeoxeoxeox"),
                        getTokenBalanceEach(account, "eosvrtokenss"),
                        getTokenBalanceEach(account, "esbcointoken"),
                        getTokenBalanceEach(account, "eosatidiumio"),
                        getTokenBalanceEach(account, "octtothemoon"),
                        getTokenBalanceEach(account, "everipediaiq"),
                        getTokenBalanceEach(account, "prospectorsg"),
                        getTokenBalanceEach(account, "poormantoken"),
                        getTokenBalanceEach(account, "challengedac")
                       ]);
//console.log(addBalance, dacBalance, cetosBalance);
 msg = "Current account : " + account;
 msg += "\n";
 msg += "<b>Token Balance</b>"; 
 msg += "\n";
 
 
   if(iqBalance != null){
  t = iqBalance.split(" ");
  msg += t[1] + " : " + t[0];}
 else
  msg += "IQ : 0";
 msg += "\n";
 
 if(addBalance != null){
  t = addBalance.split(" ");
 msg += t[1] + " : " + t[0];}
 else
  msg += "ADD : 0";
 msg += "\n";
 
   if(atdBalance != null){
    t = atdBalance.split(" ");
   msg += t[1] + " : " + t[0];}
 else
  msg += "ATD : 0";
   msg += "\n"; 
 
  if(cetBalance != null){
    t = cetBalance.split(" ");
   msg += t[1] + " : " + t[0];}
  else
   msg += "CET : 0";
   msg += "\n"; 
 
  
  if(chlBalance != null){
    t = chlBalance.split(" ");
   msg += t[1] + " : " + t[0];}
  else
   msg += "CHL : 0";
   msg += "\n"; 
 

 
if(eoxBalance != null){
  t = eoxBalance.split(" ");
  msg += t[1] + " : " + t[0];}
 else
  msg += "EOX : 0";
 msg += "\n";
 
 if(evrBalance != null){
  t = evrBalance.split(" ");
  msg += t[1] + " : " + t[0];}
 else
  msg += "EVR : 0";
 msg += "\n";
 
 if(esbBalance != null){
  t = esbBalance.split(" ");
  msg += t[1] + " : " + t[0];}
 else
  msg += "ESB : 0";
 msg += "\n";
 



 
   if(octBalance != null){
  t = octBalanceOCT.split(" ");
  msg += t[1] + " : " + t[0];}
 else
  msg += "OCT : 0";
 msg += "\n";
 
   if(pglBalance != null){
  t = pglBalance.split(" ");
  msg += t[1] + " : " + t[0];}
 else
  msg += "PGL : 0";
 msg += "\n";
 
 
 
   if(ednaBalance != null){
   t = ednaBalance.split(" ");
 msg += t[1] + " : " + t[0];}
 else
  msg += "EDNA : 0";
 msg += "\n";
 
    if(poorBalance != null){
   t = poorBalance.split(" ");
 msg += t[1] + " : " + t[0];}
 else
  msg += "POOR : 0";
 msg += "\n";
 
 
   if(horusBalance != null){
    t = horusBalance.split(" ");
    msg += t[1] + " : " + t[0];}
   else
    msg += "HORUS : 0";
   msg += "\n";
 


 
 if(dacBalance != null){
    t = dacBalance.split(" ");
 msg += t[1] + " : " + t[0];}
else
  msg += "EOSDAC : 0";


 cb(msg);
}
//Get token balance

function loadData(ctx, cb){
 MongoClient.connect(url, function(err, db) {
 var dbo = db.db("heroku_9472rtd6");
 var findquery = {chatid : ctx.chat.id, primary : true};
 dbo.collection("customers").findOne(findquery, function(err, result){
  if(result == null){
   //if result is null, then return -1
   var findqueryInTheLoop = {chatid : ctx.chat.id};
   dbo.collection("customers").findOne(findqueryInTheLoop, function(err, result){
    if(result == null){
   var msg = "Please set your primary account in setting menu";
   ctx.telegram.sendMessage(ctx.from.id, msg)
   cb(-1);
    }else{
     cb(result.eosid);    
    }
    db.close();
   });
   
  }else{
   cb(result.eosid);
  }
  db.close();
 });
 });
}

function getRamPrice(ctx){
eos.getTableRows({json : true,
                 code : "eosio",
                 scope: "eosio",
                 table: "rammarket",
                 limit: 10}).then(res => {
 msg = "RAM Price : ";
 var a1 = res.rows[0].quote.balance.split(" ");
 var a2 = res.rows[0].base.balance.split(" ");
 var a3 = (parseFloat(a1[0]) / parseFloat(a2[0])) * 1024;
 msg += a3.toFixed(4);
 msg += " EOS per KiB";

 //console.log(res);
 //console.log(res.rows[0].base);
 //console.log(res.rows[0].quote);
 


 ctx.telegram.sendMessage(ctx.from.id, msg).then(payload => {
  msg = makeMessage(ctx);
  ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard));
 });
});
}

function saveData(ctx){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("heroku_9472rtd6");
 
   var findquery = {chatid : ctx.chat.id, eosid : ctx.session.id, primary : true};
   dbo.collection("customers").findOne(findquery, function(err, result){
    if(result == null){
     //insert
        var myobj = { chatid : ctx.chat.id, eosid : ctx.session.id, primary : true }
     dbo.collection("customers").insertOne(myobj, function(err, res) {
        if (err) throw err;
          console.log("1 document inserted");
              db.close();
        });
    }/*else{
     //update
     var newobj = {$set : {chatid : ctx.chat.id, eosid : ctx.session.id }};        
     dbo.collection("customers").updateOne(findquery, newobj, function(err, res) {
        if (err) throw err;
          console.log("1 document updated");
          db.close();
        });
    } //end else*/
   }); //end pf findquery
  }); //end MongoClient
}

function setPrimary(ctx, account){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("heroku_9472rtd6");
 //, eosid : ctx.session.id, primary : true};
   var updateQuery = {chatid : ctx.chat.id };
   var newvalues = {$set : {primary : false}};
   dbo.collection("customers").updateMany(updateQuery, newvalues,function(err, res){
    var findquery = {eosid : account};
    var pValue = {$set : {primary : true }};
    dbo.collection("customers").updateOne(findquery, pValue, function(err, result){
     console.log("Primary flag update completed", ctx.session.id);
     msg = account;
     msg += "<b>is primary account now setted</b>";
     ctx.session.id = account;
     ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard))
     db.close();  
   }); //end of updateOne
   }); //end of updateMany query
   
  }); //end MongoClient
}

function deleteAccount(ctx, account){
 MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("heroku_9472rtd6");
  var deleteQuery = {eosid : account};
  dbo.collection("customers").deleteOne(deleteQuery, function(err, res){
   if(err) throw err;
   console.log("delete account", account);
   msg = account;
   msg += " is deleted";
   ctx.session.id = "nil";
   ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard))
   db.close();
  });
 });
 
}

//check current step and save value to context
function stepCheck(ctx){
  if(ctx.session.step == 4){
    console.log("email",ctx.message.text);
    ctx.session.email = ctx.message.text;
  }else if(ctx.session.step == 3){
        ctx.session.etw = ctx.message.text;
  }else if(ctx.session.step == 2){
   ;
    
  }else if(ctx.session.step == 1){
    ctx.session.id = ctx.message.text;
    saveData(ctx);
    console.log("id",ctx.message.text);
   msg = ctx.session.id + " is successfuly registered";
    ctx.telegram.sendMessage(ctx.from.id, msg)
    //save id to mongo DB
  }else{
    console.log("other data");
  }
}

//bot init
const bot = new Telegraf(config.telegraf_token);    // Let's instantiate a bot using our token.
bot.use(session())
//bot.use(Telegraf.log())


bot.start((ctx) => {
 
  // Save etc values
  ctx.session.telegram = ctx.message.chat.username
  ctx.session.language = ctx.message.from.language_code
 
  reset(ctx)
  let msg = makeMessage(ctx)
  
  loadData(ctx, id => {
   ctx.session.id = id;
   ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard))
  })
  
  ctx.reply('Hello')
})

bot.on('message', ctx => {
  stepCheck(ctx);

  let msg = makeMessage(ctx);
  ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard))
});

function price(ctx){

   // Get price
   MongoClient.connect(url, function(err, connection) {
     let db = connection.db("heroku_9472rtd6")
    
     db.collection("price").find().toArray(function(err, res){
       let partnetMessage = partner.makePartnerMessage();
       ctx.telegram.sendMessage(ctx.from.id, partnetMessage, Extra.HTML());
       let message = tl.stripIndents`Current Account: ${ctx.session.id ? ctx.session.id : 'None Selected'}

                                     EOS Price: $${(res[0].usd).toFixed(2)}
                                     EOS Price: ${Math.floor(res[0].krw)}KRW
                                     Provided by: ${res[0].exchange}

                                     EOS Selling Price: ${res[1].krw}KRW
                                     EOS Buying Price: ${res[1].krwbuy}KRW
                                     Provided by: ${res[1].exchange}`

       ctx.telegram.sendMessage(ctx.from.id, message, Extra.HTML().markup(keyboard))
       ctx.session.step = 2
      
       // Close connection
       connection.close()
     })
   })
}

function balance(ctx){
 loadData(ctx, function(id){
  ctx.session.id = id;
 if(ctx.session.id == -1){
  msg = "Please register your EOS account.";
  ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard));
 }else{
  
  
    eos.getCurrencyBalance("eosio.token",ctx.session.id).then(result => {
     console.log("getCurrencyBalance", result)
     if(result[0] != undefined && result[0] != 'undefined' && result[0] != null){
      v3 = result[0].split(" ");
     }else{
      v3 = ["0", "EOS"];
     }
     console.log("calling getAccount", ctx.session.id);
     eos.getAccount(ctx.session.id).then(result => {
      console.log("getAccount", result);
      console.log(result.total_resources.net_weight, result.total_resources.cpu_weight, result.voter_info.unstaking)
      v1 = result.total_resources.net_weight.split(" ");
      v2 = result.total_resources.cpu_weight.split(" ");
     eos.getTableRows({json : true,
                 code : "eosio",
                 scope: ctx.session.id,
                 table: "refunds",
                 limit: 500}).then(res => {
        var refund;
       if(res.rows.length == 0){
        refund = 0;
       }else{
       var a = res.rows[0].net_amount.split(" ");
       var b = res.rows[0].cpu_amount.split(" ");
       refund = parseFloat(a[0]) + parseFloat(b[0]);
      }
 console.log("refund size", refund)
      //console.log(parseInt(v1[0],10) + parseInt(v2[0],10));
      msg = "<b>EOS Information</b>" + "\n";
      msg += "Total Balance : ";
      msg += (parseFloat(v1[0]) + parseFloat(v2[0]) + parseFloat(v3[0]) + refund).toFixed(4);
      msg += " EOS\n";      
      msg += "Unstaked : " + parseFloat(v3[0]);
      msg += " EOS\n";
      msg += "Staking for CPU : "
      msg += result.total_resources.cpu_weight;
      msg += "\n";
      msg += "Staking for NET : "
      msg += result.total_resources.net_weight;
      msg += "\n";
      msg += "Refund : ";
      msg += refund + " EOS";
      msg += "\n";
      msg += "\n";
      msg += "<b>RAM Information </b>" + "\n";
      msg += "Total RAM : " + result.ram_quota + " bytes" + "\n";
      msg += "Used RAM : " + result.ram_usage + " bytes" + "\n"
      var ramSellSize = result.ram_quota - result.ram_usage - 2048;
      msg += "Safe Selling : " + ramSellSize + " bytes" + "\n"
      ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard));
     });//end of getTableRow
     }); //end of get Account
  }); //end of getCurrencyBalance
   }//end if 계정정보
 }); //end of first load data

//console.log('currency balance', balance);
  ctx.session.step = 3;
}

function token(ctx){

 loadData(ctx, function(id){
  ctx.session.id = id;
  console.log("Token balance", ctx.session.id);
  getTokenBalance(ctx.session.id,(result)=>{
  ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard));
   });
 });
}

function account(ctx){
   ctx.reply("Please input EOS account. You can check your account with EOS public key on http://eosflare.io .");

  ctx.session.step = 1;
}

function setting(ctx){
 const keyboard = Markup.inlineKeyboard([
  Markup.callbackButton('📝 Set Primary Account', 'primary'),
  Markup.callbackButton('♻️ Delete Account', 'delete'),
  Markup.callbackButton('🆔 List Accounts', 'list')
], {column: 1});
 msg = "Please select the operation";
 ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard)); 
}

function listAccounts(ctx){
  var idListString = [];
      //get price
 console.log("before making ", idListString);
 console.log("setting chat id ", ctx.from.id);
   MongoClient.connect(url, function(err, db) {
    var dbo = db.db("heroku_9472rtd6");     
    var findquery = {chatid : ctx.from.id};
    dbo.collection("customers").find(findquery).toArray(function(err, res){
     console.log(res)
     //make id array

     for(i = 0;i<res.length;i++){
      console.log("setting push data", res[i].eosid);
      idListString.push({text : res[i].eosid, callback_data : res[i].eosid});
     }
         console.log("after making", idListString);
 
    var keyboardStr = JSON.stringify({
      inline_keyboard: [ idListString ]
      
   });
     const keyboardId = Markup.inlineKeyboard(idListString, {column: 3});     
    var msg = "Your registered accounts";
     ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboardId));
      msg = makeMessage(ctx);
  ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard));
    
     //ctx.session.step = 2;
     db.close();
   });


  });
}

function accountAction(ctx){
  var idListString = [];
      //get price
 console.log("before making ", idListString);
 console.log("setting chat id ", ctx.from.id);
   MongoClient.connect(url, function(err, db) {
    var dbo = db.db("heroku_9472rtd6");     
    var findquery = {chatid : ctx.from.id};
    dbo.collection("customers").find(findquery).toArray(function(err, res){
     console.log(res)
     //make id array

     for(i = 0;i<res.length;i++){
      console.log("setting push data", res[i].eosid);
      idListString.push({text : res[i].eosid, callback_data : res[i].eosid});
     }
         console.log("after making", idListString);
 
    var keyboardStr = JSON.stringify({
      inline_keyboard: [ idListString ]
      
   });
     const keyboardId = Markup.inlineKeyboard(idListString, {column: 3});     
    var msg = "Select your account";
     ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboardId));
    
     //ctx.session.step = 2;
     db.close();
   });


  });
}

bot.on('callback_query', (ctx) => {
 const action = ctx.callbackQuery.data;
 let partnetMessage = partner.makePartnerMessage();
 switch(action) {
     case "price":
         ctx.reply("Retrieving EOS price...")
         price(ctx)
         break
     case "balance":
         ctx.reply("Retrieving Account balance...")
         ctx.telegram.sendMessage(ctx.from.id, partnetMessage, Extra.HTML());
         balance(ctx)
         break
     case "token":
         ctx.reply("Retrieving token balance...")
         ctx.telegram.sendMessage(ctx.from.id, partnetMessage, Extra.HTML());
         token(ctx)
         break
     case "id":
         account(ctx);
         break
     case "ram":
         ctx.telegram.sendMessage(ctx.from.id, partnetMessage, Extra.HTML());    
         getRamPrice(ctx);
         
         break
     case "setting":
         setting(ctx)
         break
     case "primary":
         ctx.session.accountAction = "primary"
         accountAction(ctx)
         break
     case "delete":
         ctx.session.accountAction = "delete"
         accountAction(ctx)
         break
     case "list":
         listAccounts(ctx);
         break
     default:
         if (ctx.session.accountAction === "primary") {
           ctx.session.accountAction = "nil";
           console.log("set primary account case", action);
           setPrimary(ctx, action);
         } else {
           ctx.session.accountAction = "nil";
           console.log("delete account case", action);
           deleteAccount(ctx, action);
         }
 }
});

// We can get bot nickname from bot informations. This is particularly useful for groups.
bot.telegram.getMe().then((bot_informations) => {
    bot.options.username = bot_informations.username;
    console.log("Server has initialized bot nickname. Nick: "+bot_informations.username);
});

function sendAlarm(){
	console.log("Memory heap usage ", process.memoryUsage().heapTotal/(1024*1024));
	console.log("Memory rss usage ", process.memoryUsage().rss/(1024*1024));

	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("heroku_9472rtd6");
		var findquery = {report  : false};
		dbo.collection("alarm").findOne(findquery, function(err, result){
			if(result == null){
				db.close();
			}else{
				//get chatid

				bot.telegram.sendMessage(result.chatid, result.data).catch((error) => {
					console.log(error);
				});
				var ObjectID = require('mongodb').ObjectID;
				var o_id = new ObjectID(result._id);
				var updateQuery = { _id : o_id };
				var updateObj = { $set: {report : true}};
				dbo.collection("alarm").updateOne(updateQuery, updateObj).then((obj)=>{
					console.log("update success", result.account);
					db.close();
				});													   

			} //end of else
		}); //end of findone alarm
	});//end of MongoClient
}

// Start bot polling in order to not terminate Node.js application.
bot.startPolling();
setInterval(sendAlarm, 100);
