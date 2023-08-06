**1_Fallback**

题干：（1）获得合约的所有权 （2）将余额减少为 0。可以改变 owner 的方法 contribute()和 receive()

解题思路：receive()的逻辑漏洞

**2_Fallout**

题干：获得合约所有权

SafhMath.sol 是防止整型数据溢出的计算库

解题思路：旧版构造函数名打错

**3_CoinFlip**

题干：抛硬币，预测结果连胜 10 次

解题思路:**伪随机**

硬币的结果与 block.number 有关.构建攻击合约，在攻击函数中使用相同的环境变量（同一区块），可保证预测结果相同

**4_Telephont**

题干：改变所有权

解题思路：**tx.origin 与 msg.sender 的不同**

构建攻击合约，在构造函数中进行攻击

**5_Token**

题干：获得更多的 Token

解题思路：**整型溢出**，EVM 只能表示特定范围的数字，solidity 0.8 前不会检查整型溢出

无论转账多少，合约中 balances[msg.sender]的检查都不会生效。转账超过余额，完成下溢

**6_Delegation**

题干：获得合约 Degation 的权限

解题思路：**delegatecall**

B 合约 delegatecallC 合约，执行的是 B 的环境改变，改变的也是 B 的状态变量，C 合约只做逻辑处理

**7_Force**

题干：强制向合约转账

解题思路：**合约自毁**

如果一个合约没有接收 eth 的处理函数，无法接受转账。但合约自毁可以强制向其转账

**8_Vault**

题干：解锁 vault

解题思路：**插槽访问**

私有变量仍可通过插槽访问

**9_King**

题干：变成 King，并阻止别人变成 King

解题思路：**智能合约 拒绝服务**

在攻击合约中设置，收到 eth，revert()

**10_Re-entrancy**

题干：偷取合约的所有资金

解题思路：**重入漏洞**

预防：使用 检查-影响-交互模式书写逻辑 使用重入锁

**11_Elevator**

题干：将 top 值改为 true

解题思路：

理解 Building building = Building(msg.sender); 的本质

实现 isLastFloor()方法

**12_Privacy**

题干：解锁合约

解题思路：**私有变量访问**

定长数据类型的存储

**13_GateKeeper One**

题干：过门

解题思路：**gas 计算，类型转换 **

门 1：合约攻击

门 2：remix debugger

门 3：类型转换

​ https://www.tutorialspoint.com/solidity/solidity_conversions.htm

​ https://learnblockchain.cn/docs/solidity/types.html#types-conversion-elementary-types

​

**14_GatekeeperTwo**

题干：过门

解题思路：**内联汇编**

门 1：合约攻击

门 2：extcodesize() **绕过合约长度检查 合约构造函数**

门 3：编码、异或逆运算

**15_Naught Coin**

题干：在锁定期内转移代币

解题思路：**transferFrom** ERC20

合约只限制了 transfer()方法，erc20 的代币转移还有 transferFrom()方法

**16_Preservation**

题干：获得合约的所有权

解题思路：**call 注入攻击 delegatecall 时的插槽存储冲突问题**

第一次 delegatecall，改变 timeZone1Library

第二次 delegatecall

**17_Recovery**

题干：找到丢失的合约地址

解题思路：**智能合约地址预测**

用户 A 调用智能合约 B 创建智能合约 C，创建者是智能合约 B。A 和 B 的 nonce 都会增加。目前不确定智能合约还会在哪种情况下增加 nonce

ethers.getCreateAddress({from: , nonce: })

**18_MagicNumber**

题干：

解题思路：**Opcodes**

**19_Alien Codex**

题干：获得所有权

解题思路：**动态数组的存储布局**

https://blog.dixitaditya.com/ethernaut-level-19-alien-codex

攻击数组长度，使其下溢（所有存储空间都是动态数组的范围，使得 slot[0]可以被赋值）

动态数组元素的起始存储位置:keccak256(其索引的 slot)

keccak256(1)+ X = 0 = 2^256-1 + 1

**20_Denial**

目的：不让提款成功

解题思路：**call transfer send 的区别**

攻击合约想办法耗尽 gas

**21_Shop**

目的：购买成功，并使 price 价格降低

解题思路：判断逻辑。让攻击合约的 price 和 Shop 的 isSold 挂钩

**22_Dex**

目的：

解题思路：

**23_Dex Two**

**24_Puzzle Wallet**

目的：成为代理合约的管理员

库合约：UpgradeableProxy.sol

​ Proxy.sol

解题思路：

proxy 和 impl 的 storage 存在冲突，(1)可以通过 delegatecall setMaxBalance()来修改 proxy 的 admin，需要取光合约的余额。

(2)改变 proxy 的 pendingAdmin，就能使攻击行为通过 owner 检查

**25_Motorbike**

题干：？？？

解题思路：

**26_DoubleEntryPoint**

题干：？？？

解题思路：

**27_Good Samaritan**

题干：取走钱包中所有的份额。入口函数 GoodSamaritan.requestDonation()

解题思路：利用 Coin.transfer 中的 INotifyable(dest*).notify(amount*);恶意触发 revert "NotEnoughBalance()"

如果一个合约的 mapping 类型是 public，但没有声明 getter 函数，ethers.js 该怎么获得呢？如果通过 slot 是不是太麻烦了

**28_GateKeeper Three**

题干：进入大门。gateOne()：简单

gateTwo()：allowEntrance，利用 trick.checkPassword()

解题思路：

**29_Switch**

题干：要让 switchOn = true;留下的入口，flipSwitch()

解题思路:**动态类型的 Calldata 编码**

https://blog.softbinator.com/solving-ethernaut-level-29-switch/

设计 calldata，改变偏移量，满足 onlyOff 的同时，进行 turnSwitchOn()调用

```
一般情况下动态类型的Calldata编码
0x
30c13ade	->函数选择器
0000000000000000000000000000000000000000000000000000000000000020	->偏移量
0000000000000000000000000000000000000000000000000000000000000004	->长度
20606e1500000000000000000000000000000000000000000000000000000000	->实际值
```

```
应对题目onlyOff()检查
30c13ade-> 功能选择器

0000000000000000000000000000000000000000000000000000000000000060-> 偏移量，现在 = 96 字节

0000000000000000000000000000000000000000000000000000000000000000-> 额外字节

20606e1500000000000000000000000000000000000000000000000000000000-> 这里是对字节的检查68，但与调用无关

0000000000000000000000000000000000000000000000000000000000000004-> 数据长度

76227e1200000000000000000000000000000000000000000000000000000000-> turnSwitchOn()的选择器
```

https://ethernaut.openzeppelin.com/

https://github.com/OpenZeppelin/ethernaut/blob/master/contracts/contracts/levels/Motorbike.sol

https://www.youtube.com/watch?v=MaGAVBRwvbg&list=PLiAoBT74VLnmRIPZGg4F36fH3BjQ5fLnz D-Squared

https://www.youtube.com/watch?v=TQKj2xvsGec&list=PLO5VPQH6OWdWh5ehvlkFX-H3gRObKvSL6 Smart Contract Programmer

https://dev.to/bin2chen/ethernautxi-lie-level-26doubleentrypoint-27i5 全解

https://github.com/bin2chen66/ethernaut/blob/main/contracts/26DoubleEntryPointRun.sol
