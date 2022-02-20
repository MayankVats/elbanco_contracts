// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  address public minter;

  event MinterChanged(address indexed _from, address _to);

  constructor() payable ERC20("ElBanco Currency", "ELBC") {
    minter = msg.sender; //only initially
  }

  function passMinterRole(address _dBank) external returns (bool) {
    require(
      msg.sender == minter,
      "Error, only owner can change pass minter role"
    );
    minter = _dBank;

    emit MinterChanged(msg.sender, _dBank);
    return true;
  }

  function mint(address _account, uint256 _amount) external {
    require(
      msg.sender == minter,
      "Error, msg.sender does not have minter role"
    ); //dBank
    _mint(_account, _amount);
  }
}

// https://testnet.bscscan.com/address/0x565412B9E9983F6e85cdb17d27579c885BB148BA#code
