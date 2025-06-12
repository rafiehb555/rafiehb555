import { ApiPromise } from '@polkadot/api';
import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';

export interface StakingInfo {
  totalStaked: BN;
  activeStaked: BN;
  unlocking: BN;
  rewards: BN;
  nominations: string[];
  validatorStatus: string;
}

export interface ValidatorInfo {
  commission: number;
  totalStake: BN;
  ownStake: BN;
  nominatorCount: number;
  nominators: Array<{
    address: string;
    stake: BN;
  }>;
  isActive: boolean;
  isElected: boolean;
}

export class PolkadotStaking {
  constructor(private api: ApiPromise) {}

  // Get staking information for an account
  async getStakingInfo(address: string): Promise<StakingInfo> {
    const [ledger, bonded, validators, activeEra] = await Promise.all([
      this.api.query.staking.ledger(address),
      this.api.query.staking.bonded(address),
      this.api.query.staking.validators(address),
      this.api.query.staking.activeEra(),
    ]);

    const totalStaked = ledger?.active || new BN(0);
    const unlocking =
      ledger?.unlocking?.reduce((acc, { value }) => acc.add(value), new BN(0)) || new BN(0);
    const activeStaked = totalStaked.sub(unlocking);

    return {
      totalStaked,
      activeStaked,
      unlocking,
      rewards: new BN(0), // Calculate from history
      nominations: ledger?.nominators?.map(n => n.toString()) || [],
      validatorStatus: validators ? 'active' : 'inactive',
    };
  }

  // Get validator information
  async getValidatorInfo(address: string): Promise<ValidatorInfo> {
    const [prefs, exposure, activeEra] = await Promise.all([
      this.api.query.staking.validators(address),
      this.api.query.staking.erasStakers.active(activeEra, address),
      this.api.query.staking.activeEra(),
    ]);

    const commission = prefs?.commission?.toNumber() || 0;
    const totalStake = exposure?.total || new BN(0);
    const ownStake = exposure?.own || new BN(0);
    const nominators = exposure?.others || [];

    return {
      commission,
      totalStake,
      ownStake,
      nominatorCount: nominators.length,
      nominators: nominators.map(n => ({
        address: n.who.toString(),
        stake: n.value,
      })),
      isActive: true,
      isElected: true, // Check from active validators
    };
  }

  // Bond funds for staking
  async bond(
    signer: KeyringPair,
    value: BN,
    controller: string,
    payee: 'Staked' | 'Stash' | 'Controller' | string
  ) {
    const tx = this.api.tx.staking.bond(value, payee);
    return tx.signAndSend(signer);
  }

  // Unbond funds
  async unbond(signer: KeyringPair, value: BN) {
    const tx = this.api.tx.staking.unbond(value);
    return tx.signAndSend(signer);
  }

  // Withdraw unbonded funds
  async withdrawUnbonded(signer: KeyringPair, numSlashingSpans: number) {
    const tx = this.api.tx.staking.withdrawUnbonded(numSlashingSpans);
    return tx.signAndSend(signer);
  }

  // Nominate validators
  async nominate(signer: KeyringPair, targets: string[]) {
    const tx = this.api.tx.staking.nominate(targets);
    return tx.signAndSend(signer);
  }

  // Set validator preferences
  async setValidatorPrefs(signer: KeyringPair, commission: number, blocked: boolean = false) {
    const tx = this.api.tx.staking.validate({ commission, blocked });
    return tx.signAndSend(signer);
  }

  // Chill (stop validating)
  async chill(signer: KeyringPair) {
    const tx = this.api.tx.staking.chill();
    return tx.signAndSend(signer);
  }

  // Get active validators
  async getActiveValidators() {
    const [activeEra, validators] = await Promise.all([
      this.api.query.staking.activeEra(),
      this.api.query.session.validators(),
    ]);

    const validatorInfo = await Promise.all(
      validators.map(async address => {
        const [prefs, exposure] = await Promise.all([
          this.api.query.staking.validators(address),
          this.api.query.staking.erasStakers.active(activeEra, address),
        ]);

        return {
          address: address.toString(),
          commission: prefs?.commission?.toNumber() || 0,
          totalStake: exposure?.total || new BN(0),
          ownStake: exposure?.own || new BN(0),
          nominatorCount: exposure?.others?.length || 0,
        };
      })
    );

    return validatorInfo;
  }

  // Get staking rewards history
  async getRewardsHistory(address: string, eraCount: number = 10) {
    const [activeEra, history] = await Promise.all([
      this.api.query.staking.activeEra(),
      this.api.query.staking.erasRewardPoints.multi(
        Array.from({ length: eraCount }, (_, i) => activeEra - i)
      ),
    ]);

    return history.map((points, index) => ({
      era: activeEra - index,
      points: points.toJSON(),
    }));
  }
}
