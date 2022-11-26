require('dotenv').config(); 

const env = process.env; 
const { CONTRACT_ABI } = require('./sol_abi.js');

const Web3 = require('web3');
const web3 = new Web3(env.IP);

let contract = new web3.eth.Contract(CONTRACT_ABI, env.CONTRACT_ID); 

//get live server function call  
contract.methods.getLiveSite().call().then(console.log);

//get test server function call 
contract.methods.getLiveSite().call().then(console.log);