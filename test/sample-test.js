const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample", function () {
  let owner;
  let user1, user2;
  let addrs;

  beforeEach(async function () {
    [owner, user1, user2, ...addrs] = await ethers.getSigners();

    let balance = await ethers.provider.getBalance(owner.address);
    let formattedBalance = ethers.utils.formatEther(balance);
    console.log("Balance Of Owner: ", formattedBalance);

    balance = await ethers.provider.getBalance(user1.address);
    formattedBalance = ethers.utils.formatEther(balance);
    console.log("Balance Of User1: ", formattedBalance);

    balance = await ethers.provider.getBalance(user2.address);
    formattedBalance = ethers.utils.formatEther(balance);
    console.log("Balance Of User2: ", formattedBalance);
  });

  it("Sample test case", async function () {});
});
