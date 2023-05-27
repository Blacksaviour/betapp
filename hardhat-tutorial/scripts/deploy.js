const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  // Compile the contract
  const Betapp = await ethers.getContractFactory("Betapp");
  
  // Deploy the contract
  const contract = await Betapp.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
