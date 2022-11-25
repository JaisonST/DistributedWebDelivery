const Web3 = require('web3');
const web3 = new Web3('http://192.168.0.2:7545');
//web3.eth.getAccounts().then(console.log);

var sender = '0xC95808ddAc5B843846e8c9f296c4775D88BB8D66';

//METAMASK
var receiver = '0x581D6452A95985016bF06c2B3C42573289134703';
web3.eth.sendTransaction({to:receiver, from:sender, value:web3.utils.toWei("1.5", "ether")})
