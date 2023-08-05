const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("PuzzleWallet", () => {
  async function deployFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    // ?
    const MAX_BALANCE = ethers.parseEther("1")
    const INIT_LEVEL_BALANCE = ethers.parseEther("0.001")

    const PuzzleWallet = await ethers.getContractFactory("PuzzleWallet")
    const puzzleWallet = await PuzzleWallet.connect(deployer).deploy()
    await puzzleWallet.waitForDeployment()
    const puzzleWalletAddress = await puzzleWallet.getAddress()
    // console.log(puzzleWalletAddress)

    // ?
    const initData = puzzleWallet.interface.encodeFunctionData("init", [
      MAX_BALANCE,
    ])
    // console.log(initData)

    const ProxyFactory = await ethers.getContractFactory("PuzzleProxy")
    let proxyContract = await ProxyFactory.deploy(deployer.address, puzzleWalletAddress, initData)
    await proxyContract.waitForDeployment()
    const proxyContractAddress = await proxyContract.getAddress()

    // 类似接口的形式, 逻辑合约的abi，代理合约的地址
    proxyContract = await ethers.getContractAt(
      "PuzzleWallet",
      proxyContractAddress
    )

    console.log(deployer.address)
    console.log("proxyContract的owner", await proxyContract.owner())

    await proxyContract.connect(deployer).addToWhitelist(deployer.address)
    await proxyContract.connect(deployer).deposit({ value: INIT_LEVEL_BALANCE })

    return { puzzleWallet }
  }

  it("attack and check", async () => {
    const { contract } = await loadFixture(deployFixture)

    // 攻击合约进行attack()
    // for (let index = 0; index < 10; index++) {
    //   await attackContract.attack()
    // }

    // 断言
    // expect(await contract.consecutiveWins()).to.equal(10)

  })
})