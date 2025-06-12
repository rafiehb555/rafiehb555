import { ethers } from 'ethers';

// Ethereum Mainnet RPC URL
const ETHEREUM_RPC_URL = 'https://eth-mainnet.g.alchemy.com/v2/eDD4O7rNwEj_65_TDJeudb-cwbj5e2Mn';

// Initialize Ethereum provider
export function initEthereumProvider(): ethers.providers.JsonRpcProvider {
  return new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_URL);
}

// Get network info
export async function getNetworkInfo(provider: ethers.providers.JsonRpcProvider) {
  const network = await provider.getNetwork();
  const blockNumber = await provider.getBlockNumber();
  const gasPrice = await provider.getGasPrice();

  return {
    chainId: network.chainId,
    name: network.name,
    blockNumber,
    gasPrice: gasPrice.toString(),
  };
}

// Get account balance
export async function getBalance(
  provider: ethers.providers.JsonRpcProvider,
  address: string
): Promise<string> {
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
}

// Get transaction info
export async function getTransaction(provider: ethers.providers.JsonRpcProvider, txHash: string) {
  return await provider.getTransaction(txHash);
}

// Get block info
export async function getBlock(provider: ethers.providers.JsonRpcProvider, blockNumber: number) {
  return await provider.getBlock(blockNumber);
}
