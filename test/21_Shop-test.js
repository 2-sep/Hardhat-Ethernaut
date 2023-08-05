const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Shop", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Shop")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const AttackContractFactory = await ethers.getContractFactory("AttackShop")
    const attackContract = await AttackContractFactory.connect(attacker).deploy(contractAddress)
    await attackContract.waitForDeployment()

    return { contract, attackContract, attacker }
  }

  it("Should consecutiveWins", async () => {
    const { contract, attackContract, attacker } = await loadFixture(deployFallbackFixture)

    // 攻击合约进行attack()
    const attakTx = await attackContract.attack()
    attakTx.wait()

    // 断言
    expect(await contract.price()).to.below(100)

  })
})