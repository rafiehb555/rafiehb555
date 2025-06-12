import { ApiPromise } from '@polkadot/api';
import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';

export interface ProposalInfo {
  proposer: string;
  value: BN;
  beneficiary: string;
  bond: BN;
}

export interface ReferendumInfo {
  end: number;
  proposal: any;
  threshold: string;
  delay: number;
  votes: {
    aye: BN;
    nay: BN;
  };
}

export class PolkadotGovernance {
  constructor(private api: ApiPromise) {}

  // Democracy functions
  async propose(signer: KeyringPair, proposal: any, value: BN) {
    const tx = this.api.tx.democracy.propose(proposal, value);
    return tx.signAndSend(signer);
  }

  async second(signer: KeyringPair, proposalIndex: number, secondsUpperBound: number) {
    const tx = this.api.tx.democracy.second(proposalIndex, secondsUpperBound);
    return tx.signAndSend(signer);
  }

  async vote(signer: KeyringPair, refIndex: number, vote: boolean, conviction: number) {
    const tx = this.api.tx.democracy.vote(refIndex, { Standard: { vote, conviction } });
    return tx.signAndSend(signer);
  }

  async getProposals(): Promise<ProposalInfo[]> {
    const proposals = await this.api.query.democracy.proposals();
    return proposals.map(([propIndex, proposal]) => ({
      proposer: proposal.proposer.toString(),
      value: proposal.value,
      beneficiary: proposal.beneficiary.toString(),
      bond: proposal.bond,
    }));
  }

  async getReferendums(): Promise<ReferendumInfo[]> {
    const referendums = await this.api.query.democracy.referendumInfoOf.entries();
    return referendums.map(([key, info]) => {
      const refIndex = key.args[0].toNumber();
      const data = info.unwrap();
      return {
        end: data.end.toNumber(),
        proposal: data.proposal,
        threshold: data.threshold.toString(),
        delay: data.delay.toNumber(),
        votes: {
          aye: data.ayes || new BN(0),
          nay: data.nays || new BN(0),
        },
      };
    });
  }

  // Council functions
  async proposeCouncilMotion(signer: KeyringPair, proposal: any, threshold: number) {
    const tx = this.api.tx.council.propose(threshold, proposal);
    return tx.signAndSend(signer);
  }

  async voteCouncilMotion(
    signer: KeyringPair,
    proposalHash: string,
    proposalIndex: number,
    approve: boolean
  ) {
    const tx = this.api.tx.council.vote(proposalHash, proposalIndex, approve);
    return tx.signAndSend(signer);
  }

  async getCouncilMembers() {
    const members = await this.api.query.council.members();
    return members.map(member => member.toString());
  }

  async getCouncilProposals() {
    const proposals = await this.api.query.council.proposals();
    return proposals.map(proposal => ({
      proposer: proposal.proposer.toString(),
      proposal: proposal.proposal,
      votes: proposal.votes,
    }));
  }

  // Treasury functions
  async proposeTreasurySpend(signer: KeyringPair, value: BN, beneficiary: string) {
    const tx = this.api.tx.treasury.proposeSpend(value, beneficiary);
    return tx.signAndSend(signer);
  }

  async approveTreasuryProposal(signer: KeyringPair, proposalId: number) {
    const tx = this.api.tx.treasury.approveProposal(proposalId);
    return tx.signAndSend(signer);
  }

  async getTreasuryProposals() {
    const proposals = await this.api.query.treasury.proposals();
    return proposals.map(proposal => ({
      proposer: proposal.proposer.toString(),
      value: proposal.value,
      beneficiary: proposal.beneficiary.toString(),
      bond: proposal.bond,
    }));
  }

  // Technical Committee functions
  async proposeTechnicalMotion(signer: KeyringPair, proposal: any, threshold: number) {
    const tx = this.api.tx.technicalCommittee.propose(threshold, proposal);
    return tx.signAndSend(signer);
  }

  async getTechnicalCommitteeMembers() {
    const members = await this.api.query.technicalCommittee.members();
    return members.map(member => member.toString());
  }
}
