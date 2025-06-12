import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { configureChains, createConfig } from 'wagmi';
import { moonbeam, bsc, polkadot } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

// Network RPC URLs
const MOONBEAM_RPC = 'https://moonbeam.blastapi.io/e163baac-c3e2-4068-bb55-a905a3b6bb81';
const BSC_RPC = 'https://bsc-mainnet.core.chainstack.com/5b9b0b5336cd42ee064790fdc05efc04';
const POLKADOT_RPC =
  'https://polkadot.api.onfinality.io/rpc?apikey=598bada2-1e1b-41ae-acbe-0f8f610f1fa1';

// WebSocket URLs
const MOONBEAM_WSS = 'wss://moonbeam.blastapi.io/e163baac-c3e2-4068-bb55-a905a3b6bb81';
const BSC_WSS = 'wss://bsc-mainnet.core.chainstack.com/5b9b0b5336cd42ee064790fdc05efc04';
const POLKADOT_WSS =
  'wss://polkadot.api.onfinality.io/ws?apikey=598bada2-1e1b-41ae-acbe-0f8f610f1fa1';

// Configure chains
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    {
      ...moonbeam,
      rpcUrls: {
        default: { http: [MOONBEAM_RPC] },
        public: { http: [MOONBEAM_RPC] },
      },
    },
    {
      ...bsc,
      rpcUrls: {
        default: { http: [BSC_RPC] },
        public: { http: [BSC_RPC] },
      },
    },
    {
      ...polkadot,
      rpcUrls: {
        default: { http: [POLKADOT_RPC] },
        public: { http: [POLKADOT_RPC] },
      },
    },
  ],
  [publicProvider()]
);

// Create WalletConnect connector
const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  },
});

// Create wagmi config
export const config = createConfig({
  autoConnect: true,
  connectors: [walletConnectConnector],
  publicClient,
  webSocketPublicClient,
});

// Create ethers providers
export const moonbeamProvider = new ethers.providers.JsonRpcProvider(MOONBEAM_RPC);
export const bscProvider = new ethers.providers.JsonRpcProvider(BSC_RPC);
export const polkadotProvider = new ethers.providers.JsonRpcProvider(POLKADOT_RPC);

// WebSocket providers
export const moonbeamWsProvider = new ethers.providers.WebSocketProvider(MOONBEAM_WSS);
export const bscWsProvider = new ethers.providers.WebSocketProvider(BSC_WSS);
export const polkadotWsProvider = new ethers.providers.WebSocketProvider(POLKADOT_WSS);

export { chains };
