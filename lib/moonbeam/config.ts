import { ethers } from 'ethers';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

// Moonbase Alpha Testnet endpoints
const MOONBASE_RPC = 'https://rpc.api.moonbase.moonbeam.network';
const MOONBASE_WSS = 'wss://wss.api.moonbase.moonbeam.network';

// Initialize Moonbeam API (Ethereum compatible)
export function initMoonbeamProvider() {
  return new ethers.providers.JsonRpcProvider(MOONBASE_RPC);
}

// Initialize Polkadot API for Moonbeam
export async function initMoonbeamPolkadotAPI() {
  await cryptoWaitReady();

  const wsProvider = new WsProvider(MOONBASE_WSS);
  const api = await ApiPromise.create({ provider: wsProvider });

  return api;
}

// Get account balance
export async function getBalance(provider: ethers.providers.JsonRpcProvider, address: string) {
  return await provider.getBalance(address);
}

// Get gas price
export async function getGasPrice(provider: ethers.providers.JsonRpcProvider) {
  return await provider.getGasPrice();
}

// Get network info
export async function getNetworkInfo(provider: ethers.providers.JsonRpcProvider) {
  const [blockNumber, gasPrice] = await Promise.all([
    provider.getBlockNumber(),
    provider.getGasPrice(),
  ]);

  return {
    blockNumber,
    gasPrice: gasPrice.toString(),
    chainId: (await provider.getNetwork()).chainId,
  };
}

// Send transaction
export async function sendTransaction(
  provider: ethers.providers.JsonRpcProvider,
  signer: ethers.Signer,
  to: string,
  value: ethers.BigNumber,
  data: string = '0x'
) {
  const gasPrice = await provider.getGasPrice();
  const gasLimit = await provider.estimateGas({
    to,
    value,
    data,
  });

  const tx = await signer.sendTransaction({
    to,
    value,
    data,
    gasPrice,
    gasLimit,
  });

  return await tx.wait();
}

// Get transaction receipt
export async function getTransactionReceipt(
  provider: ethers.providers.JsonRpcProvider,
  txHash: string
) {
  return await provider.getTransactionReceipt(txHash);
}

// Get block info
export async function getBlockInfo(
  provider: ethers.providers.JsonRpcProvider,
  blockNumber: number
) {
  return await provider.getBlock(blockNumber);
}

// Export constants
export const MOONBEAM_CONFIG = {
  rpc: MOONBASE_RPC,
  wss: MOONBASE_WSS,
  chainId: 1287, // Moonbase Alpha chain ID
  name: 'Moonbase Alpha',
  currency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18,
  },
};
