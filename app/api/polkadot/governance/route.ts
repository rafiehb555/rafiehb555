import { NextRequest, NextResponse } from 'next/server';
import { initPolkadotAPI } from '../../../../lib/polkadot/config';
import { PolkadotGovernance } from '../../../../lib/polkadot/governance';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get('action');

    const api = await initPolkadotAPI();
    const governance = new PolkadotGovernance(api);

    switch (action) {
      case 'proposals':
        const proposals = await governance.getProposals();
        return NextResponse.json({ proposals });

      case 'referendums':
        const referendums = await governance.getReferendums();
        return NextResponse.json({ referendums });

      case 'council-members':
        const councilMembers = await governance.getCouncilMembers();
        return NextResponse.json({ councilMembers });

      case 'council-proposals':
        const councilProposals = await governance.getCouncilProposals();
        return NextResponse.json({ councilProposals });

      case 'treasury-proposals':
        const treasuryProposals = await governance.getTreasuryProposals();
        return NextResponse.json({ treasuryProposals });

      case 'technical-committee':
        const techCommitteeMembers = await governance.getTechnicalCommitteeMembers();
        return NextResponse.json({ techCommitteeMembers });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Polkadot Governance API Error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
