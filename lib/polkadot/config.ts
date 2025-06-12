import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { BN } from '@polkadot/util';

// Network endpoints
const POLKADOT_RPC =
  'https://polkadot.api.onfinality.io/rpc?apikey=598bada2-1e1b-41ae-acbe-0f8f610f1fa1';
const POLKADOT_WSS =
  'wss://polkadot.api.onfinality.io/ws?apikey=598bada2-1e1b-41ae-acbe-0f8f610f1fa1';

// Initialize Polkadot API
export async function initPolkadotAPI() {
  await cryptoWaitReady();

  const wsProvider = new WsProvider(POLKADOT_WSS);
  const api = await ApiPromise.create({ provider: wsProvider });

  return api;
}

// Staking functions
export async function getStakingInfo(api: ApiPromise, address: string) {
  const [stashInfo, controllerInfo] = await Promise.all([
    api.query.staking.ledger(address),
    api.query.staking.bonded(address),
  ]);

  return {
    stashInfo,
    controllerInfo,
  };
}

export async function getValidatorInfo(api: ApiPromise, address: string) {
  const [validatorPrefs, validatorExposure] = await Promise.all([
    api.query.staking.validators(address),
    api.query.staking.erasStakers.active(api.consts.staking.activeEra, address),
  ]);

  return {
    validatorPrefs,
    validatorExposure,
  };
}

// Nomination functions
export async function nominateValidator(api: ApiPromise, controller: string, targets: string[]) {
  const tx = api.tx.staking.nominate(targets);
  return tx.signAndSend(controller);
}

// Staking functions
export async function bond(api: ApiPromise, controller: string, value: BN, payee: string) {
  const tx = api.tx.staking.bond(value, payee);
  return tx.signAndSend(controller);
}

export async function unbond(api: ApiPromise, controller: string, value: BN) {
  const tx = api.tx.staking.unbond(value);
  return tx.signAndSend(controller);
}

// Governance functions
export async function submitProposal(api: ApiPromise, proposer: string, proposal: any) {
  const tx = api.tx.democracy.propose(proposal, api.consts.democracy.minimumDeposit);
  return tx.signAndSend(proposer);
}

export async function vote(api: ApiPromise, voter: string, referendumIndex: number, vote: boolean) {
  const tx = api.tx.democracy.vote(referendumIndex, vote);
  return tx.signAndSend(voter);
}

// Validator functions
export async function validate(api: ApiPromise, validator: string, commission: number) {
  const tx = api.tx.staking.validate(commission);
  return tx.signAndSend(validator);
}

export async function chill(api: ApiPromise, validator: string) {
  const tx = api.tx.staking.chill();
  return tx.signAndSend(validator);
}

// Utility functions
export function createKeyring() {
  return new Keyring({ type: 'sr25519' });
}

export async function getBalance(api: ApiPromise, address: string) {
  const { data: balance } = await api.query.system.account(address);
  return balance;
}

// Export constants
export const POLKADOT_CONFIG = {
  rpc: POLKADOT_RPC,
  wss: POLKADOT_WSS,
  types: {
    // Add custom types if needed
  },
};
