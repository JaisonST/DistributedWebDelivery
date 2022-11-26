require('dotenv').config(); 

const env = process.env; 
const { CONTRACT_ABI } = require('./sol_abi.js');

const Web3 = require('web3');
const web3 = new Web3(env.IP);

let contract = new web3.eth.Contract(CONTRACT_ABI, env.CONTRACT_ID); 


const args = process.argv.slice(2);

if (args[0] == "--live"){
    //get live server function call  
    contract.methods.getLiveSite().call().then(console.log);
}

if (args[0] == "--test"){
    //get test server function call 
    contract.methods.getTestSite().call().then(console.log);
}

if (args[0] == "--hasUpdate"){
    //check if there is an update
    contract.methods.hasUpdate().call().then(val => {
        if(val == 0 ){
            console.log("\n\nNO updates"); 
        }
        else 
            console.log("\n\nAVAILABLE updates, use --getUpdate for more information"); 
    });
}

if (args[0] == "--getUpdate"){
    //get oldest update
    try{
        contract.methods.getUpdate().call().then(console.log);
    }catch(e){
        console.log("NO updates");
    }
}

if (args[0] == "--createUpdate"){
    if(!args[1] || !args[2]){
        console.log("dev error: missing parameters")
        process.exit(1);        
    }
    if(!env.PUBLIC_KEY){
        console.log("user not registerd")
        process.exit(1); 
    }
    contract.methods.createUpdate(`"${args[1]}"`,`"${args[2]}"`).send({ from: env.PUBLIC_KEY, gas: 2000000 }).then(console.log); 
}

if (args[0] == "--vote"){
    if(!args[1]){
        console.log("dev error: missing parameters")
        process.exit(1);        
    }
    if(!env.PUBLIC_KEY){
        console.log("user not registerd")
        process.exit(1); 
    }
    var vote = (args[1] === 'true');
    contract.methods.vote(vote).send({ from: env.PUBLIC_KEY, gas: 2000000 }).then(console.log); 
}