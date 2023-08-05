**3_CoinFlip**

目标：抛硬币，预测结果连胜 10 次

解题思路:**伪随机**

硬币的结果与 block.number 有关.构建攻击合约，在攻击函数中使用相同的环境变量（同一区块），可保证预测结果相同

**4_Telephont**

目标：改变所有权

解题思路：**tx.origin 与 msg.sender 的不同**

构建攻击合约，在构造函数中进行攻击

**5_Token**

目标：获得更多的 Token

解题思路：**整型溢出**，EVM 只能表示特定范围的数字

无论转账多少，合约中 balances[msg.sender]的检查都不会生效。转账超过余额，完成下溢

**6_Delegation**

目标：获得合约 Degation 的权限

解题思路：**delegatecall**

**7_Force**

目标：强制向合约转账

解题思路：**合约自毁**

**8_Vault**

目标：解锁 vault

解题思路：**插槽访问**

私有变量仍可通过插槽访问

**9_King**

目标：变成 King，并阻止别人变成 King

解题思路：**智能合约 拒绝服务**

**10_Re-entrancy**

目标：偷取合约的所有资金

解题思路：**重入攻击**

**11_Elevator**

目标：将 top 值改为 true

解题思路：**攻击合约**

理解 Building building = Building(msg.sender); 的本质

实现 isLastFloor()方法

**12_Privacy**

目标：解锁合约

解题思路：**私有变量访问**

**13_GateKeeper One**

目标：过门

解题思路：**gas 计算，类型转换 **

门 1：合约攻击

门 2：remix debugger

门 3：类型转换

​ https://www.tutorialspoint.com/solidity/solidity_conversions.htm

​ https://learnblockchain.cn/docs/solidity/types.html#types-conversion-elementary-types

​

**14_GatekeeperTwo**

目标：过门

解题思路：**内联汇编**

门 1：合约攻击

门 2：extcodesize() **绕过合约长度检查 合约构造函数**

门 3：编码、异或逆运算

**15_Naught Coin**

目标：在锁定期内转移代币

解题思路：**transferFrom** ERC20

合约只限制了 transfer()方法，erc20 的代币转移还有 transferFrom()方法

**16_Preservation**

目标：获得合约的所有权

解题思路：**delegatecall 时的插槽存储冲突问题**

第一次 delegatecall，改变 timeZone1Library

第二次 delegatecall

**17_Recovery**

目的：找到丢失的合约地址

解题思路：**智能合约地址预测**

ethers.getCreateAddress({from: , nonce: })

**18_MagicNumber**

目的：

解题思路：**Opcodes**

**19_Alien Codex**

目的：获得所有权

解题思路：**动态数组的存储布局**

https://blog.dixitaditya.com/ethernaut-level-19-alien-codex

攻击数组长度，使其下溢（所有存储空间都是动态数组的范围，使得 slot[0]可以被赋值）

动态数组元素的起始存储位置:keccak256(array slot)（slot 下标）

keccak256(1)+ X = 0 = 2^256-1 + 1

**20_Denial**

目的：不让提款成功

解题思路：**call transfer send 的区别**

攻击合约想办法耗尽 gas

**21_Shop**

目的：购买成功，并使 price 价格降低

解题思路：

**22_Dex**

目的：

解题思路：

**24_Puzzle Wallet**

目的：成为代理合约的管理员

库合约：UpgradeableProxy.sol

​ Proxy.sol

解题思路：

proxy 和 impl 的 storage 存在冲突，(1)可以通过 delegatecall setMaxBalance()来修改 proxy 的 admin，需要取光合约的余额。

(2)改变 proxy 的 pendingAdmin，就能使攻击行为通过 owner 检查

**25_Motorbike**

题干：

解题思路：

**26_DoubleEntryPoint**

题干：

解题思路：

**27**

**28_GateKeeper Three**

题干：进入大门。gateOne()：简单

gateTwo()：allowEntrance，利用 trick.checkPassword()

解题思路：

**29_Switch**

题干：要让 switchOn = true;留下的入口，flipSwitch()

解题思路:**动态类型的 Calldata 编码**

https://blog.softbinator.com/solving-ethernaut-level-29-switch/

设计 calldata，改变偏移量，满足 onlyOff 的同时，进行 turnSwitchOn()调用
