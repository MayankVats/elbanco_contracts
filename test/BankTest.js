const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Bank Test", function () {
  let Instance;
  let Token;
  let Bank;

  let owner;
  let user1, user2;
  let addrs;

  beforeEach(async function () {
    [owner, user1, user2, ...addrs] = await ethers.getSigners();

    Instance = await ethers.getContractFactory("Token");
    Token = await Instance.deploy();

    Instance = await ethers.getContractFactory("elBanco");
    Bank = await Instance.deploy(Token.address);

    await Token.passMinterRole(Bank.address);
  });

  // afterEach(async function () {
  //   let balance = await ethers.provider.getBalance(owner.address);
  //   let formattedBalance = ethers.utils.formatEther(balance);
  //   console.log("Balance Of Owner: ", formattedBalance);

  //   balance = await ethers.provider.getBalance(user1.address);
  //   formattedBalance = ethers.utils.formatEther(balance);
  //   console.log("Balance Of User1: ", formattedBalance);

  //   balance = await ethers.provider.getBalance(user2.address);
  //   formattedBalance = ethers.utils.formatEther(balance);
  //   console.log("Balance Of User2: ", formattedBalance);
  // });

  describe("Deposit Test", function () {
    it("Should fail to deposit (insufficient Ether supplied)", async function () {
      await expect(
        Bank.connect(user1).deposit({
          value: ethers.utils.parseEther("0.001"),
        })
      ).to.be.revertedWith("insufficient amount, min. deposit: 0.01 ETH");
    });

    it("Should successfully deposit", async function () {
      await Bank.connect(user1).deposit({
        value: ethers.utils.parseEther("0.01"),
      });

      expect(await Bank.isDeposited(user1.address)).to.equal(true);
      expect(await Bank.etherBalanceOf(user1.address)).to.equal(
        ethers.utils.parseEther("0.01")
      );
    });

    it("Should fail to deposit (already deposited)", async function () {
      await Bank.connect(user1).deposit({
        value: ethers.utils.parseEther("0.01"),
      });

      expect(await Bank.isDeposited(user1.address)).to.equal(true);
      expect(await Bank.etherBalanceOf(user1.address)).to.equal(
        ethers.utils.parseEther("0.01")
      );

      await expect(
        Bank.connect(user1).deposit({
          value: ethers.utils.parseEther("0.01"),
        })
      ).to.be.revertedWith("cannot deposit more than once");
    });
  });

  describe("Withdraw Test", function () {
    it("Should fail to withdraw (did not deposit)", async function () {
      await expect(Bank.connect(user1).withdraw()).to.be.revertedWith(
        "Error, no previous deposit"
      );
    });

    it("Should successfully withdraw", async function () {
      await Bank.connect(user1).deposit({
        value: ethers.utils.parseEther("0.02"),
      });

      await network.provider.send("evm_increaseTime", [3600]);
      await network.provider.send("evm_mine");

      const interest = await Bank.getAccruedInterest(user1.address);
      await Bank.connect(user1).withdraw();
      const tokenAmount = await Token.balanceOf(user1.address);
      expect(interest).to.equal(tokenAmount);
    });
  });
});
