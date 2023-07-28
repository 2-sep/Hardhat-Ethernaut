const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")
const { text } = require("node:stream/consumers")
const { parse } = require("path")

describe("King", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("King")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const AttackContractFactory = await ethers.getContractFactory("AttackKing")
    const attackContract = await AttackContractFactory.connect(attacker).deploy(contractAddress, { value: ethers.parseUnits("1", "ether") })
    await attackContract.waitForDeployment()

    return { deployer, attacker, contract, attackContract }
  }

  it("Should consecutiveWins ", async () => {
    const { deployer, attacker, contract, attackContract } = await loadFixture(deployFallbackFixture)

    try {
      const testTx = {
        to: await contract.getAddress(),
        value: ethers.parseUnits("2", "ether")
      }

      const receipt = await attacker.sendTransaction(testTx)
      await receipt.wait()
    } catch (error) {
      console.log(error, "无法发送ETH到合约地址")
    }

    //  断言：被攻击合约的连胜应为10
    // expect(await contract.consecutiveWins()).to.equal(10)

  })
})