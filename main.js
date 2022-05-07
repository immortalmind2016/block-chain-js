const { SHA256 } = require("crypto-js");
class Block {
  //previous hash to ensure the integrity
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  //Create Genesis block
  createGenesisBlock() {
    return new Block(0, "01/01/2022", "Genesis Block", "0");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;

    //Because we changed the previous hash so we should recalculate the hash
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
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
moCoin.addBlock(new Block(1, "10/01/2022", { amount: 4 }));
moCoin.addBlock(new Block(1, "20/01/2022", { amount: 5 }));
moCoin.addBlock(new Block(1, "30/01/2022", { amount: 6 }));

console.log(JSON.stringify(moCoin, null, 4));

//Expected output will be true
console.log("Is blockchain valid? ",moCoin.isChainValid())

moCoin.chain[1].data={amount:500}
//Expected output will be false
console.log("Is blockchain valid? ",moCoin.isChainValid())

//So smart !!
moCoin.chain[1].hash=moCoin.chain[1].calculateHash()
//Expected output will be false , because the relation with the prev block is broken
console.log("Is blockchain valid? ",moCoin.isChainValid())
