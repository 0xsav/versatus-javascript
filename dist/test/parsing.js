import { parseAmountToBigInt } from '../index.js';
console.log('PARSE VERSE');
console.log();
console.log('0');
console.log(parseAmountToBigInt(0));
console.log(parseAmountToBigInt('0'));
console.log();
console.log('0.000001');
console.log(parseAmountToBigInt(0.000001));
console.log(parseAmountToBigInt('0.000001'));
console.log();
console.log('1');
console.log(parseAmountToBigInt(1));
console.log(parseAmountToBigInt('1'));
console.log();
console.log('1.1234123');
console.log(parseAmountToBigInt(1.1234123));
console.log(parseAmountToBigInt('1.1234123'));