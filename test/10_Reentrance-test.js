const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Reentrance", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Reentrance")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const tx = await contract.donate(await deployer.getAddress(), { value: ethers.parseUnits("50", "ether") })
    await tx.wait()

    const AttackContractFactory = await ethers.getContractFactory("AttackReentrance")
    const attackContract = await AttackContractFactory.connect(attacker).deploy(contractAddress)
    await attackContract.waitForDeployment()

    return { contract, attacker, attackContract }
  }

  it("attack and check", async () => {
    const { contract, attacker, attackContract } = await loadFixture(deployFallbackFixture)

    // 攻击合约进行attack()
    const attackTx = await attackContract.attack({ value: ethers.parseUnits("1", "ether") })
    await attackTx.wait()

    console.log(await ethers.provider.getBalance(await attackContract.getAddress()))
    console.log(await ethers.provider.getBalance(await contract.getAddress()))
    // 
    // expect(await contract.consecutiveWins()).to.equal(10)

  })
})