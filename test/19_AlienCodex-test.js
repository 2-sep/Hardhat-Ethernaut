const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")

describe("CoinFlip", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("AlienCodex")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    const AttackContractFactory = await ethers.getContractFactory("AttackAlienCodex")
    const attackContract = await AttackContractFactory.connect(attacker).deploy(contractAddress)
    await attackContract.waitForDeployment()

    return { contract, attackContract, attacker }
  }

  it("Should consecutiveWins ", async () => {
    const { contract, attackContract, attacker } = await loadFixture(deployFallbackFixture)

    // 攻击合约进行attack()
    const attackTx = await attackContract.attack()
    await attackTx.wait()

    const r = await ethers.provider.getStorage(await contract.getAddress(), 0)
    console.log(r)
    console.log(attacker.address)

    // 断言：被攻击合约的连胜应为10
    // expect(await contract.consecutiveWins()).to.equal(10)

  })
})