const hre = require("hardhat");

async function main() {
  const Bank = await hre.ethers.getContractFactory("elBanco");
  const bank = await Bank.deploy("0x565412B9E9983F6e85cdb17d27579c885BB148BA");

  await bank.deployed();

  console.log("Bank deployed to:", bank.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
