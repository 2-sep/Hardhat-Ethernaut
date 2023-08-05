const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("CoinFlip", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("CoinFlip")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const AttackContractFactory = await ethers.getContractFactory("AttackCoinFlip")
    const attackContract = await AttackContractFactory.connect(attacker).deploy(contractAddress)
    await attackContract.waitForDeployment()

    return { contract, attackContract }
  }

  it("attack and check", async () => {
    const { contract, attackContract } = await loadFixture(deployFallbackFixture)

    // 攻击合约进行attack()
    for (let index = 0; index < 10; index++) {
      await attackContract.attack()
    }

    // 断言：被攻击合约的连胜应为10
    expect(await contract.consecutiveWins()).to.equal(10)

  })
})