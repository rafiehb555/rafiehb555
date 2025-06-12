import { MoonbeamToken, MOONBEAM_TOKENS } from './tokens';

async function testTokenFunctionality() {
  try {
    console.log('Testing Moonbeam Token Functionality...');

    // Test WGLMR token
    const wglmr = new MoonbeamToken(MOONBEAM_TOKENS.WGLMR);
    console.log('\nTesting WGLMR Token:');

    // Get token info
    const info = await wglmr.getTokenInfo();
    console.log('Token Info:', info);

    // Test USDC token
    const usdc = new MoonbeamToken(MOONBEAM_TOKENS.USDC);
    console.log('\nTesting USDC Token:');

    // Get token info
    const usdcInfo = await usdc.getTokenInfo();
    console.log('USDC Info:', usdcInfo);

    // Test USDT token
    const usdt = new MoonbeamToken(MOONBEAM_TOKENS.USDT);
    console.log('\nTesting USDT Token:');

    // Get token info
    const usdtInfo = await usdt.getTokenInfo();
    console.log('USDT Info:', usdtInfo);

    // Test DAI token
    const dai = new MoonbeamToken(MOONBEAM_TOKENS.DAI);
    console.log('\nTesting DAI Token:');

    // Get token info
    const daiInfo = await dai.getTokenInfo();
    console.log('DAI Info:', daiInfo);

    // Test WETH token
    const weth = new MoonbeamToken(MOONBEAM_TOKENS.WETH);
    console.log('\nTesting WETH Token:');

    // Get token info
    const wethInfo = await weth.getTokenInfo();
    console.log('WETH Info:', wethInfo);

    // Test WBTC token
    const wbtc = new MoonbeamToken(MOONBEAM_TOKENS.WBTC);
    console.log('\nTesting WBTC Token:');

    // Get token info
    const wbtcInfo = await wbtc.getTokenInfo();
    console.log('WBTC Info:', wbtcInfo);

    // Test BUSD token
    const busd = new MoonbeamToken(MOONBEAM_TOKENS.BUSD);
    console.log('\nTesting BUSD Token:');

    // Get token info
    const busdInfo = await busd.getTokenInfo();
    console.log('BUSD Info:', busdInfo);

    // Test AAVE token
    const aave = new MoonbeamToken(MOONBEAM_TOKENS.AAVE);
    console.log('\nTesting AAVE Token:');

    // Get token info
    const aaveInfo = await aave.getTokenInfo();
    console.log('AAVE Info:', aaveInfo);

    // Test UNI token
    const uni = new MoonbeamToken(MOONBEAM_TOKENS.UNI);
    console.log('\nTesting UNI Token:');

    // Get token info
    const uniInfo = await uni.getTokenInfo();
    console.log('UNI Info:', uniInfo);

    // Test LINK token
    const link = new MoonbeamToken(MOONBEAM_TOKENS.LINK);
    console.log('\nTesting LINK Token:');

    // Get token info
    const linkInfo = await link.getTokenInfo();
    console.log('LINK Info:', linkInfo);

    console.log('\nAll token tests completed successfully!');
  } catch (error) {
    console.error('Error testing tokens:', error);
  }
}

// Run the tests
testTokenFunctionality();
