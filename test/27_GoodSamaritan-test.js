const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("GoodSamaritan", () => {
  async function deployFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("GoodSamaritan")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()


    // console.log(await ethers.provider.getTransactionCount(contractAddress))

    // 获取wallet实例
    const walletAddress = ethers.getCreateAddress({
      from: contractAddress,
      nonce: 1
    })
    // 两种方式
    // console.log(await contract.wallet())
    const wallet = await ethers.getContractAt("Wallet", walletAddress)

    // 获取coin实例
    const coinAddress = ethers.getCreateAddress({
      from: contractAddress,
      nonce: 2
    })
    let coin = await ethers.getContractAt("Wallet", coinAddress)

    const AttackContractFactory = await ethers.getContractFactory("AttackGoodSamaritan")
    const attackContract = await AttackContractFactory.connect(attacker).deploy()
    await attackContract.waitForDeployment()

    return { contract, attackContract, contractAddress }
  }

  it("attack and check", async () => {
    const { contract, attackContract, contractAddress } = await loadFixture(deployFixture)

    // 攻击合约进行attack()
    await attackContract.exploit(contractAddress)

    // 断言

  })
})

