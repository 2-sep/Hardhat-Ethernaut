const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Elevator", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Elevator")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const AttackContractFactory = await ethers.getContractFactory("AttackElevator")
    const attackContract = await AttackContractFactory.connect(attacker).deploy(contractAddress)
    await attackContract.waitForDeployment()

    return { contract, attackContract, attacker }
  }

  it("attack and check", async () => {
    const { contract, attackContract, attacker } = await loadFixture(deployFallbackFixture)

    console.log(await contract.top())
    // attack()
    const attackTx = await attackContract.attack()
    await attackTx.wait()

    console.log(await contract.top())

    //
    // expect(await contract.consecutiveWins()).to.equal(10)

  })
})