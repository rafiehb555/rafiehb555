import { ethers } from 'ethers';
import { initMoonbeamProvider } from './config';

// ERC20 ABI
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
  'event Approval(address indexed owner, address indexed spender, uint256 amount)',
];

export class MoonbeamToken {
  private contract: ethers.Contract;

  constructor(
    tokenAddress: string,
    provider: ethers.providers.JsonRpcProvider = initMoonbeamProvider()
  ) {
    this.contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  }

  // Get token balance
  async getBalance(address: string): Promise<ethers.BigNumber> {
    return await this.contract.balanceOf(address);
  }

  // Get token decimals
  async getDecimals(): Promise<number> {
    return await this.contract.decimals();
  }

  // Get token symbol
  async getSymbol(): Promise<string> {
    return await this.contract.symbol();
  }

  // Transfer tokens
  async transfer(
    signer: ethers.Signer,
    to: string,
    amount: ethers.BigNumber
  ): Promise<ethers.ContractTransaction> {
    const contract = this.contract.connect(signer);
    return await contract.transfer(to, amount);
  }

  // Approve tokens
  async approve(
    signer: ethers.Signer,
    spender: string,
    amount: ethers.BigNumber
  ): Promise<ethers.ContractTransaction> {
    const contract = this.contract.connect(signer);
    return await contract.approve(spender, amount);
  }

  // Get allowance
  async getAllowance(owner: string, spender: string): Promise<ethers.BigNumber> {
    return await this.contract.allowance(owner, spender);
  }

  // Transfer from (requires approval)
  async transferFrom(
    signer: ethers.Signer,
    from: string,
    to: string,
    amount: ethers.BigNumber
  ): Promise<ethers.ContractTransaction> {
    const contract = this.contract.connect(signer);
    return await contract.transferFrom(from, to, amount);
  }

  // Get token info
  async getTokenInfo(): Promise<{
    address: string;
    symbol: string;
    decimals: number;
  }> {
    const [symbol, decimals] = await Promise.all([
      this.contract.symbol(),
      this.contract.decimals(),
    ]);

    return {
      address: this.contract.address,
      symbol,
      decimals,
    };
  }

  // Get transfer events
  async getTransferEvents(
    fromBlock: number,
    toBlock: number | string = 'latest'
  ): Promise<ethers.Event[]> {
    const filter = this.contract.filters.Transfer();
    return await this.contract.queryFilter(filter, fromBlock, toBlock);
  }

  // Get approval events
  async getApprovalEvents(
    fromBlock: number,
    toBlock: number | string = 'latest'
  ): Promise<ethers.Event[]> {
    const filter = this.contract.filters.Approval();
    return await this.contract.queryFilter(filter, fromBlock, toBlock);
  }
}

// Predefined token addresses on Moonbeam
export const MOONBEAM_TOKENS = {
  WGLMR: '0xAcc15dC74880C9944775448304B263D191c6077F', // Wrapped GLMR
  USDC: '0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b', // USD Coin
  USDT: '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D', // Tether USD
  DAI: '0xc234A67a4F840E61adE794be47de455361b52413', // Dai Stablecoin
  WETH: '0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D029A8', // Wrapped Ether
  WBTC: '0x1DC78Acda13a8BC4408B207c9E48CDBc096D95e0', // Wrapped Bitcoin
  BUSD: '0x4Bf769b05E832FCf905f3A0A00A2fB5e8Ee8B5f5', // Binance USD
  AAVE: '0x2C5fF4107E35404B3359Ea00Fd7A0e2c5FaD5796', // Aave Token
  UNI: '0x8f552a71EFE5eeFd207bEf6E5Fc4c8D5B2b5934F', // Uniswap
  LINK: '0x3505918B0972a1931484055E6544fcd5a1Bdea62', // Chainlink
};
