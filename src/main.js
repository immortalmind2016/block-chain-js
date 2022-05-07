const {BlockChain,Transaction}=require("./main")

let moCoin = new BlockChain();
//in reality address 1 and address 2 will be the public key of someone's wallet
moCoin.createTransaction(new Transaction("address1","address2",100));
moCoin.createTransaction(new Transaction("address1","address2",50))

console.log("\n starting the miner")
moCoin.minePendingTransactions("mo-address");

console.log("\n address of mo is ",moCoin.getBalanceOfAddress("mo-address"))

console.log("\n starting the miner again")
moCoin.minePendingTransactions("mo-address");

console.log("\n address of mo is ",moCoin.getBalanceOfAddress("mo-address"))
