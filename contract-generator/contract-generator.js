const fs = require('fs');

exports.props = {
  name: "untitled token",
  symbol: "NA",
  totalSupply: 1000000000,
  decimals: 18,
  license: "MIT",
  solidityVersion: "0.8.9",
  contractName: "UntitledToken",
}

exports.setName = name = (name) => {
  this.props.name = name;
  this.props.contractName = this.props.name.replace(/\s/g,'');
}

exports.setSymbol = (symbol) => {
  this.props.symbol = symbol;
}

exports.setTotalSupply = (totalSupply) => {
  this.props.totalSupply = totalSupply;
}

exports.setDecimals = (decimals) => {
  this.props.decimals = decimals;
}

exports.setLicense = (license) => {
  this.props.license = license;
}

exports.setSolidityVersion = (version) => {
  this.props.solidityVersion = version;
}

exports.Save = (filename) => {

var interfaces = [];
var abstractContracts = [];

var newLine = `
`;

var SPDX = `// SPDX-License-Identifier: ${this.props.license}`;

var pragma = `pragma solidity ^${this.props.solidityVersion};`

interfaces.push(`interface IERC20 {
  function totalSupply() external view returns (uint256);

  function balanceOf(address account) external view returns (uint256);

  function transfer(address recipient, uint256 amount) external returns (bool);

  function allowance(address owner, address spender) external view returns (uint256);

  function approve(address spender, uint256 amount) external returns (bool);

  function transferFrom(
      address sender,
      address recipient,
      uint256 amount
  ) external returns (bool);

  event Transfer(address indexed from, address indexed to, uint256 value);

  event Approval(address indexed owner, address indexed spender, uint256 value);
}`);

interfaces.push(`interface IFactory{
  function createPair(address tokenA, address tokenB) external returns (address pair);
}`);

interfaces.push(`interface IRouter {
  function factory() external pure returns (address);
  function WETH() external pure returns (address);
  function addLiquidityETH(
      address token,
      uint amountTokenDesired,
      uint amountTokenMin,
      uint amountETHMin,
      address to,
      uint deadline
  ) external payable returns (uint amountToken, uint amountETH, uint liquidity);

  function swapExactTokensForETHSupportingFeeOnTransferTokens(
      uint amountIn,
      uint amountOutMin,
      address[] calldata path,
      address to,
      uint deadline) external;
}`);

abstractContracts.push(`abstract contract Context {
  function _msgSender() internal view virtual returns (address) {
      return msg.sender;
  }

  function _msgData() internal view virtual returns (bytes calldata) {
      this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
      return msg.data;
  }
}`);

abstractContracts.push(`abstract contract Ownable is Context {
  address private _owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  constructor() {
      _setOwner(_msgSender());
  }

  function owner() public view virtual returns (address) {
      return _owner;
  }

  modifier onlyOwner() {
      require(owner() == _msgSender(), "Ownable: caller is not the owner");
      _;
  }

  function renounceOwnership() public virtual onlyOwner {
      _setOwner(address(0));
  }

  function transferOwnership(address newOwner) public virtual onlyOwner {
      require(newOwner != address(0), "Ownable: new owner is the zero address");
      _setOwner(newOwner);
  }

  function _setOwner(address newOwner) private {
      address oldOwner = _owner;
      _owner = newOwner;
      emit OwnershipTransferred(oldOwner, newOwner);
  }
}`);

var constractStart = `contract ${this.props.contractName} is Ownable, IERC20 {`;

var constructor = `  constructor () {

  }`;

var contractEnd =`}`;

var contract  = SPDX
              += newLine += newLine
              += pragma
              += newLine += newLine
              += interfaces[0]
              += newLine += newLine
              += interfaces[1]
              += newLine += newLine
              += interfaces[2]
              += newLine += newLine
              += abstractContracts[0]
              += newLine += newLine
              += abstractContracts[1]
              += newLine += newLine
              += constractStart
              += newLine += newLine
              += constructor
              += newLine += newLine
              += contractEnd


  const solidityFile = fs.writeFileSync(filename, contract, { encoding: 'utf8', flag: 'w' } );

}

