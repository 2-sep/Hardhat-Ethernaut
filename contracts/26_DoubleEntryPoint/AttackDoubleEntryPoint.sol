// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "hardhat/console.sol";

interface IDetectionBot {
    function handleTransaction(address user, bytes calldata msgData) external;
}

interface IForta {
    function raiseAlert(address user) external;
}

contract AttackDoubleEntryPoint is IDetectionBot {
  address private cryptoVault;

  constructor(address _cryptoVault) {
    cryptoVault = _cryptoVault;
  }

  function handleTransaction(address user, bytes calldata msgData) external {
    //msgData为DoubleEntryPoint.delegateTransfer(address to,uint256 value,address origSender)的msg.data
    (,,address origSender) = abi.decode(msgData[4:],(address,uint256,address));
    //只过滤不能来自Vault即可，其他正常转
    if (origSender == cryptoVault) {
      IForta(msg.sender).raiseAlert(user);
    }
  }  
}