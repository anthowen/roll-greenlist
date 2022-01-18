// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const addresses = [
  "0x1f30C1C257457e37178DCd007F2f41B10d4B5DC9",
  "0x45c5d06827801854a424bC866cCc974FBf4bF7ee",
  "0xeeA60b6137b6e575645444714Cf4FaDaF0BcE0dF",
  "0x636E44814418Fab08429B1607ff45f69Ed94F042",
];
const spot = 2900;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const RollGreenList = await hre.ethers.getContractFactory("RollGreenList");
  const roller = await RollGreenList.deploy(spot, addresses);

  await roller.deployed();

  console.log("RollGreenList deployed to:", roller.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
