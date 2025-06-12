import { initMoonbeamProvider, getBalance, getNetworkInfo, getGasPrice } from './config';

async function testMoonbeam() {
  try {
    console.log('Initializing Moonbeam Testnet provider...');
    const provider = initMoonbeamProvider();

    // Test address (replace with your test address)
    const testAddress = '0x0000000000000000000000000000000000000000';

    console.log('Testing network info...');
    const networkInfo = await getNetworkInfo(provider);
    console.log('Network Info:', networkInfo);

    console.log('Testing balance check...');
    const balance = await getBalance(provider, testAddress);
    console.log('Balance:', ethers.utils.formatEther(balance), 'DEV');

    console.log('Testing gas price...');
    const gasPrice = await getGasPrice(provider);
    console.log('Gas Price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Error testing Moonbeam integration:', error);
  }
}

// Run the test
testMoonbeam();
