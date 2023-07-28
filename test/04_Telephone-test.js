const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Telephone", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Telephone")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const attackAddress = await attacker.getAddress()

    const AttackContractFactory = await ethers.getContractFactory("AttackTelephone")
    const attackContract = await AttackContractFactory.connect(attacker).deploy(contractAddress, attackAddress)
    await attackContract.waitForDeployment()

    return { contract, attackAddress }
  }

  it("Should consecutiveWins ", async () => {
    const { contract, attackAddress } = await loadFixture(deployFallbackFixture)


    // 断言：被攻击合约的连胜应为10
    expect(await contract.owner()).to.equal(attackAddress)

  })
})