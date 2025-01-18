import { formatCurrency } from '../scripts/utils/money.js';

console.log('test suite: formatCurrency')

console.log('converts cents into dollars')

if (formatCurrency(1000) === '10.00') {
  console.log('Test passed');
} else {
    console.error('Test failed');
}

console.log('works with 0')

if (formatCurrency(0) === '0.00') {
  console.log('Test passed');
} else {
    console.error('Test failed');
}

console.log('rounds up to the nearest cent')

if (formatCurrency(2000.5) === '20.01') {
  console.log('Test passed');
} else {
    console.error('Test failed');
}