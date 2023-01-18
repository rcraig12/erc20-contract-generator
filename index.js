const generator = require('./contract-generator/contract-generator');

generator.setName("Test Token A");
generator.setSymbol("TTA");
generator.setTotalSupply(1000000);
generator.setDecimals(9);

generator.Save('solidity.sol');