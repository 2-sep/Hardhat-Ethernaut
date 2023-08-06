const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("CoinFlip", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Recovery")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    // console.log(await ethers.provider.getTransactionCount(deployer.address))
    // console.log(await ethers.provider.getTransactionCount(contractAddress))

    // const receipt = await deployer.sendTransaction({
    //   to: attacker.address,
    //   value: ethers.parseEther("0.001")
    // })
    // await receipt.wait()

    const generateTx = await contract.generateToken("scc", 100)
    await generateTx.wait()

    // console.log(await ethers.provider.getTransactionCount(deployer.address))
    // console.log(await ethers.provider.getTransactionCount(contractAddress))

    const simpleTokenAddress = ethers.getCreateAddress({
      from: contractAddress,
      nonce: 1
    })

    const simpleToken = await ethers.getContractAt("SimpleToken", simpleTokenAddress)
    // console.log(await simpleToken.name())

    return { contract }
  }

  it("attack and check", async () => {
    const { contract } = await loadFixture(deployFallbackFixture)

    // 攻击合约进行attack()
    // for (let index = 0; index < 10; index++) {
    //   await attackContract.attack()
    // }

    // 断言：被攻击合约的连胜应为10
    // expect(await contract.consecutiveWins()).to.equal(10)

  })
})