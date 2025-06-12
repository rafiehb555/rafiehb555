import {
  initEthereumProvider,
  getNetworkInfo,
  getBalance,
  getTransaction,
  getBlock,
} from './config';

async function testEthereumFunctionality() {
  try {
    console.log('Testing Ethereum Functionality...');

    // Initialize provider
    const provider = initEthereumProvider();
    console.log('\nProvider initialized');

    // Get network info
    const networkInfo = await getNetworkInfo(provider);
    console.log('\nNetwork Info:', networkInfo);

    // Test address (Ethereum Foundation)
    const testAddress = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe';

    // Get balance
    const balance = await getBalance(provider, testAddress);
    console.log('\nBalance for', testAddress, ':', balance, 'ETH');

    // Get latest block
    const latestBlock = await getBlock(provider, networkInfo.blockNumber);
    console.log('\nLatest Block:', {
      number: latestBlock.number,
      hash: latestBlock.hash,
      timestamp: new Date(latestBlock.timestamp * 1000).toISOString(),
      transactions: latestBlock.transactions.length,
    });

    console.log('\nAll Ethereum tests completed successfully!');
  } catch (error) {
    console.error('Error testing Ethereum:', error);
  }
}

// Run the tests
testEthereumFunctionality();
