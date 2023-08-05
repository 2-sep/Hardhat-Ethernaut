const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("CoinFlip", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("NaughtCoin")
    const contract = await ContractFactory.connect(deployer).deploy(deployer.address)
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    return { contract, deployer, attacker }
  }

  it("Should consecutiveWins ", async () => {
    const { contract, deployer, attacker } = await loadFixture(deployFallbackFixture)

    // 代币授权
    const approveTx = await contract.approve(attacker.address, await contract.balanceOf(deployer.address))
    await approveTx.wait()

    const amount = await contract.allowance(deployer.address, attacker.address)
    console.log(`攻击前player的余额:${ethers.formatUnits(amount, "ether")}`)

    // 通过transferFrom()转账
    const transferTx = await contract.connect(attacker).transferFrom(deployer.address, attacker.address, amount)
    await transferTx.wait()

    // 断言：被攻击合约的连胜应为10
    expect(await contract.balanceOf(deployer.address)).to.equal(0)

  })
})