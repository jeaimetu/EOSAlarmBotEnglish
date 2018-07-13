const Eos = require('eosjs')

eosConfig = {
 httpEndpoint: "https://mainnet.eoscalgary.io"
}

eos = Eos(eosConfig)

const blockIdx = 5498555;
function testBlock(){
  eos.getBlock(blockIdx).then(result => {
    const trx = result.transactions[0].trx.transaction;
    const type = trx.actions[0].name;
    const data = trx.actions[0].data;
    //check data feasibility
    console.log(data);
    //check account field test
    
    if(("authorization" in result) == 0)
      console.log("authorization field exist");
    if(("authorization" in trx) == 0)
      console.log("authorization field exist");
  });
    

  
  
}


testBlock();
