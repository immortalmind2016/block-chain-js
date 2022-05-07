const {SHA256}=require("crypto-js")
class Block{
    //previous hash to ensure the integrity 
    constructor(index,timestamp,data,previousHash="") {
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash()
        
        
    }

    calculateHash(){
        return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString()
    }
    
}

class BlockChain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
        //Create Genesis block
    }

    createGenesisBlock(){
        return new Block(0,"01/01/2022","Genesis Block","0")
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1]

    }
    addBlock(newBlock){
       newBlock.previousHash=this.getLatestBlock().hash
       //Because we changed the previuse hash so we should recalculate the hash
       newBlock.hash=newBlock.calculateHash()
       this.chain.push(newBlock)
    }
}


let moCoin=new BlockChain();
moCoin.addBlock(new Block(1,"10/01/2022",{amount:4}))
moCoin.addBlock(new Block(1,"20/01/2022",{amount:5}))
moCoin.addBlock(new Block(1,"30/01/2022",{amount:6}))

console.log(JSON.stringify(moCoin,null,4))