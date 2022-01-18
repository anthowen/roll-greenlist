const ethers = require('ethers');
const { abi } = require('../hardhat/artifacts/contracts/RollGreenList.sol/RollGreenList.json');

require('dotenv').config();

const ROLL_CONTRACT_ADDRESS = '0x289dffb17ecc3082b9ecb57476e36320118b3059';

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(ROLL_CONTRACT_ADDRESS, abi, signer);


async function run() {
  let startEtherBalance = await signer.getBalance();
  const spotNum = (await contract.spotNum()).toNumber();
  const addresses = [];
  let execution = 0;

  console.log('Spot count', spotNum);

  contract.on("RollWinned", (address, event) => {
    console.log(`RollWinned: `, address);
    
    addresses.push(address);
  });


  while (addresses.length < spotNum) {
    try {
      await contract.rollGreenList();
      execution ++;
    } catch (e) {
      console.log(`${spotNum} spots are already filled`, e);
      break;
    }
  }

  console.log('Total runs: ', execution);
  console.log('Ether consumed amount:', ethers.utils.parseEther((await signer.getBalance()).sub(startEtherBalance)));
}

run();
