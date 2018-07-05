const Telegraf = require('telegraf');   // Module to use Telegraf API.
const config = require('./config'); // Configuration file that holds telegraf_token API key.
const session = require('telegraf/session')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const Composer = require('telegraf/composer')
const WizardScene = require('telegraf/scenes/wizard')
const Stage = require('telegraf/stage')


var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI;

Eos = require('eosjs') // Eos = require('./src')
 
eosconfig = {
httpEndpoint: "http://mainnet.eoscalgary.io"
}
 
eos = Eos(eosconfig) // 127.0.0.1:8888


const keyboard = Markup.inlineKeyboard([
  Markup.callbackButton('Account', 'id'),
  Markup.callbackButton('Price', 'price'),
  Markup.callbackButton('Balance', 'balance'),
  Markup.callbackButton('Setting', 'setting')
  //Markup.callbackButton('History','history')
  //Markup.callbackButton('Confirm','confirm')
], {column: 3})


function makeMessage(ctx){
  
  var finalResult;
 
 if(ctx.session.id != "nil"){
    finalResult = "Current account : " + ctx.session.id;
  finalResult += "\n";
 finalResult += "\n";
  finalResult += "Please vote eoscafeblock, eosyskoreabp, eosnodeonebp.";
   finalResult += "\n";
  finalResult += "copyright EOS.Cafe Korea";
  
 }
 else{
  finalResult = "Touch an account button to register EOS account.";
 finalResult += "\n";
  finalResult += "Please vote eoscafeblock, eosyskoreabp, eosnodeonebp.";
   finalResult += "\n\n";
    finalResult += "copyright EOS.Cafe Korea";
 }
  return finalResult;
}

function initMessage(ctx){
 ctx.session.id = 'nil';
 ctx.session.transaction = 'nil';
}

function checkData(ctx){
  if(ctx.session.email == "nil")
    return false;
  if(ctx.session.etw == "nil")
    return false;
  if(ctx.session.bts == "nil")
    return false;
  if(ctx.session.ncafe == "nil")
    return false;
  if(ctx.session.email == null)
    return false;
  if(ctx.session.etw == null)
    return false;
  if(ctx.session.bts == null)
    return false;
  if(ctx.session.ncafe == null)
    return false;
  return true;
}

function loadData(ctx, cb){
 MongoClient.connect(url, function(err, db) {
 var dbo = db.db("heroku_9472rtd6");
 var findquery = {chatid : ctx.chat.id};
 dbo.collection("customers").findOne(findquery, function(err, result){
  if(result == null){
   //if result is null, then return -1
   cb(-1);
  }else{
   cb(result.eosid);
  }
  db.close();
 });
 });
}

function saveData(ctx){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("heroku_9472rtd6");
 
   var findquery = {chatid : ctx.chat.id, eosid : ctx.session.id};
   dbo.collection("customers").findOne(findquery, function(err, result){
    if(result == null){
     //insert
        var myobj = { chatid : ctx.chat.id, eosid : ctx.session.id }
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
bot.use(Telegraf.log())



module.exports.sendAlarm = function(account, msg){
 //get chatid
 MongoClient.connect(url, function(err, db) {
  var dbo = db.db("heroku_9472rtd6");
  var findquery = {eosid : account};
  dbo.collection("customers").findOne(findquery, function(err, result){
   if(result == null){
    console.log("no matched account for ", account);
   }else{
     //send message
    bot.telegram.sendMessage(result.chatid, msg);
   }
   db.close();
  });//end of findOne
   
 });//end of mongoclient
 
}



bot.start((ctx) => {

  //save etc values
  ctx.session.telegram = ctx.message.chat.username;
  ctx.session.language = ctx.message.from.language_code;
  initMessage(ctx);
  var msg = makeMessage(ctx);
  ctx.telegram.sendMessage(ctx.from.id, msg, Extra.markup(keyboard))
  
  ctx.reply('Hello')
})

bot.on('message', (ctx) => {
  stepCheck(ctx);

  var msg = makeMessage(ctx);
  ctx.telegram.sendMessage(ctx.from.id, msg, Extra.HTML().markup(keyboard))
});

bot.action('id',(ctx) => {
  ctx.reply("Please input EOS account. You can check your account with EOS public key on http://eosflare.io .");

  ctx.session.step = 1;
});

function makePriceMessage(res){
 
 msg = "EOS Price : " + "$" + res[0].usd;
 msg += "\n";
 msg += "EOS Price : " + Math.floor(res[0].krw) + "KRW";
 msg += "\n";
 msg += "Provided by ";
 msg += res[0].exchange;
 msg += "\n";
 msg += "EOS Selling Price : " + res[1].krw + "KRW";
 msg += "\n";
 msg += "EOS Buying Price : " + res[1].krwbuy + "KRW";
  msg += "\n";
 msg += "Provided by " + res[1].exchange;
 //diff =  res[0].krw - res[1].krw;
 //msg += "Market difference : " + diff + "KRW";
 return msg; 
}

bot.action('price',(ctx) => {
  ctx.reply("Retrieving EOS price...");
      //get price
   MongoClient.connect(url, function(err, db) {
    var dbo = db.db("heroku_9472rtd6");       
    dbo.collection("price").find().toArray(function(err, res){
     console.log(res)
     msg = makePriceMessage(res);
     ctx.telegram.sendMessage(ctx.from.id, msg, Extra.markup(keyboard));
     ctx.session.step = 2;
     db.close();
    });
   });
});

bot.action('setting',(ctx) => {
  ctx.reply("setting...");
      var idListString = [];
      //get price
   MongoClient.connect(url, function(err, db) {
    var dbo = db.db("heroku_9472rtd6");     
    var findquery = {chatid : ctx.chat.id};
    dbo.collection("customers").find({}).toArray(function(err, res){
     console.log(res)
     //make id array

     for(i = 0;i<res.length;i++){
      idListString.push({text : res.eosid, callback_data : res.eosid});
     }

  });
 
  var keyboardStr = JSON.stringify({
      inline_keyboard: [
        idListString
      ]
   });
           
  var idList = {reply_markup: JSON.parse(keyboardStr)};
     
     ctx.telegram.sendMessage(ctx.from.id, msg, Extra.markup(idList));
     ctx.session.step = 2;
     db.close();
    });
   });
});

bot.action('balance',(ctx) => {
 loadData(ctx, function(id){
  ctx.session.id = id;
 if(ctx.session.id == -1){
  msg = "Please register your EOS account.";
  ctx.telegram.sendMessage(ctx.from.id, msg, Extra.markup(keyboard));
 }else{
  ctx.reply("Retrieving account balance...");
  
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
      console.log(result.self_delegated_bandwidth.net_weight, result.self_delegated_bandwidth.cpu_weight, result.voter_info.unstaking)
      v1 = result.self_delegated_bandwidth.net_weight.split(" ");
      v2 = result.self_delegated_bandwidth.cpu_weight.split(" ");
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
      msg = "Total Balance : ";
      msg += parseFloat(v1[0]) + parseFloat(v2[0]) + parseFloat(v3[0]) + refund;   
      msg += " EOS\n";
      msg += "Unstaked : " + parseFloat(v3[0]);
      msg += " EOS\n";
      msg += "Staking for CPU : "
      msg += result.self_delegated_bandwidth.cpu_weight;
      msg += "\n";
      msg += "Staking for Network : "
      msg += result.self_delegated_bandwidth.net_weight;
      msg += "\n";
      msg += "Refund : ";
      msg += refund;
      ctx.telegram.sendMessage(ctx.from.id, msg, Extra.markup(keyboard));
     });//end of getTableRow
     }); //end of get Account
  }); //end of getCurrencyBalance
   }//end if 계정정보
 }); //end of first load data

//console.log('currency balance', balance);
  ctx.session.step = 3;
}); //end of bot action



// We can get bot nickname from bot informations. This is particularly useful for groups.
bot.telegram.getMe().then((bot_informations) => {
    bot.options.username = bot_informations.username;
    console.log("Server has initialized bot nickname. Nick: "+bot_informations.username);
});



// Start bot polling in order to not terminate Node.js application.
bot.startPolling();
