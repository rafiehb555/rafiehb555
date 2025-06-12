import { initPolkadotAPI, getBalance, getStakingInfo, getValidatorInfo } from './config';

async function testPolkadot() {
  try {
    console.log('Initializing Polkadot API...');
    const api = await initPolkadotAPI();

    // Test address (replace with your test address)
    const testAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

    console.log('Testing balance check...');
    const balance = await getBalance(api, testAddress);
    console.log('Balance:', balance.toString());

    console.log('Testing staking info...');
    const stakingInfo = await getStakingInfo(api, testAddress);
    console.log('Staking Info:', stakingInfo);

    console.log('Testing validator info...');
    const validatorInfo = await getValidatorInfo(api, testAddress);
    console.log('Validator Info:', validatorInfo);

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Error testing Polkadot integration:', error);
  }
}

// Run the test
testPolkadot();
