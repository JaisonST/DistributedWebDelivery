const Web3 = require('web3');
const web3 = new Web3('http://192.168.0.2:7545');
//web3.eth.getAccounts().then(console.log);


let contract = new web3.eth.Contract([
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newDeposit",
				"type": "uint256"
			}
		],
		"name": "send",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "initialAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "initialValue",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
], "0x81EeD8961604E99438c9616d16d037E2c8F1B48c");

contract.methods.getBalance().call().then(console.log);

