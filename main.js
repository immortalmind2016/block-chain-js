const { SHA256 } = require("crypto-js");

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
    //to store the pending transaction between the 10 min interval because of our proof of work difficulty 
}

class Block {
  //previous hash to ensure the integrity
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    //a random number to change it if we want to recreate a new hash without changing any real data
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      //to change the hash and avoid the endless loop
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty=5
    this.pendingTransactions=[]
    this.miningReward=100;
  }

  //Create Genesis block
  createGenesisBlock() {
    return new Block("01/01/2022", "Genesis Block", "0");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash; 
    newBlock.mineBlock(this.difficulty);

    this.chain.push(newBlock);
  }

  minePendingTransactions(miningRewardAddress){
   let block=new Block(Date.now(),this.pendingTransactions);
   block.mineBlock(this.difficulty);
   
   console.log("Block  successfully mined!")
   this.chain.push(block);
   this.pendingTransactions=[
       //null = > means it comes from the system
       new Transaction(null,miningRewardAddress,this.miningReward)
   ]
  }

  createTransaction(transaction){
      this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress(address){
      let balance=0;
      for(const block of this.chain){
          for(const trans of block.transactions){
              if(trans.toAddress===address){
                  balance+=trans.amount
              }
              if(trans.fromAddress===address){
                balance-=trans.amount
            }
          }
      }
      return balance
  }

  //Check the integrity
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      //if the hash of the block still valid
      if (
        currentBlock.hash !== currentBlock.calculateHash() ||
        currentBlock.previousHash !== previousBlock.hash
      ) {
        return false;
      }
    }
    return true;
  }
}

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
