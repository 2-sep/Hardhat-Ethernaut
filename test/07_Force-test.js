const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Force", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Force")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const AttackContractFactory = await ethers.getContractFactory("AttackForce")
    const attackContract = await AttackContractFactory.connect(attacker).deploy()
    await attackContract.waitForDeployment()

    return { attacker, contract, attackContract }
  }

  it("attack and check", async () => {
    const { attacker, contract, attackContract } = await loadFixture(deployFallbackFixture)

    console.log(await ethers.provider.getBalance(await contract.getAddress()))

    // 向攻击合约发生 eth
    const tx = {
      to: await attackContract.getAddress(),
      value: ethers.parseUnits("1", "ether")
    }
    const receipt = await attacker.sendTransaction(tx)
    await receipt.wait()

    // 攻击合约自毁
    const attackTx = await attackContract.attack(await contract.getAddress())
    await attackTx.wait()
    console.log(await ethers.provider.getBalance(await contract.getAddress()))

    // 断言
    expect(await ethers.provider.getBalance(await contract.getAddress())).to.above(0)

  })
})