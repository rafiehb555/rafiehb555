import { generateText } from './openai';
import { getProducts } from './shopify';
import { getAccountBalance } from './payoneer';

async function testAPIs() {
  try {
    // Test OpenAI
    console.log('Testing OpenAI...');
    const text = await generateText('Hello, how are you?');
    console.log('OpenAI Response:', text);

    // Test Shopify
    console.log('\nTesting Shopify...');
    const products = await getProducts();
    console.log('Shopify Products:', products);

    // Test Payoneer
    console.log('\nTesting Payoneer...');
    const balance = await getAccountBalance();
    console.log('Payoneer Balance:', balance);

    console.log('\nAll API tests completed successfully!');
  } catch (error) {
    console.error('API Test Error:', error);
  }
}

// Run the tests
testAPIs();

const response = await fetch('/api/polkadot?address=YOUR_ADDRESS&action=staking');
const data = await response.json();

const responseValidator = await fetch('/api/polkadot?address=YOUR_ADDRESS&action=validator');
const dataValidator = await responseValidator.json();

const responseMoonbeam = await fetch('/api/moonbeam?action=network');
const dataMoonbeam = await responseMoonbeam.json();

const responseBalance = await fetch('/api/moonbeam?action=balance&address=YOUR_ADDRESS');
const dataBalance = await responseBalance.json();

const response = await fetch('/api/moonbeam?action=gas');
const data = await response.json();

const response = await fetch('/api/moonbeam?action=transaction&txHash=YOUR_TX_HASH');
const data = await response.json();

const response = await fetch('/api/moonbeam?action=block&blockNumber=BLOCK_NUMBER');
const data = await response.json();
