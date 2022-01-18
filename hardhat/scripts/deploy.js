// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const spotAmount = 2900;
const addresses = require('../../kryptosigned_addresses.json');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const RollGreenList = await hre.ethers.getContractFactory("RollGreenList");
  const roller = await RollGreenList.deploy(spotAmount);

  await roller.deployed();

  console.log("RollGreenList deployed to:", roller.address);

  const limit = 300;
  const blockTime = 5000; // actually 4s
  const total = addresses.length;

  for (let i = 0; i < total; i += limit) {
    await sleep(blockTime);

    try {
      const end = i + limit > total ? total : i + limit;
      await roller.initialize(addresses.slice(i, end))

      console.log(`Initialize done from ${i} to ${end}`);
    } catch (e) {
      console.log('Initialize error', e);
      break;
    }
  }

  console.log("Initialize done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
