import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin/franchise permissions
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        role: true,
        franchiseId: true,
      },
    });

    if (!userProfile || (userProfile.role !== 'ADMIN' && !userProfile.franchiseId)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await req.json();
    const { adId, action, reason } = body;

    if (!adId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get ad with creator info
    const ad = await prisma.advertisement.findUnique({
      where: { id: adId },
      include: {
        creator: {
          select: {
            id: true,
            franchiseId: true,
          },
        },
      },
    });

    if (!ad) {
      return NextResponse.json({ error: 'Advertisement not found' }, { status: 404 });
    }

    // Verify franchise permissions
    if (userProfile.role !== 'ADMIN' && userProfile.franchiseId !== ad.creator.franchiseId) {
      return NextResponse.json({ error: 'Not authorized to verify this ad' }, { status: 403 });
    }

    let newStatus: string;
    let sqlLevel: string | undefined;

    switch (action) {
      case 'APPROVE':
        newStatus = 'APPROVED';
        break;
      case 'REJECT':
        newStatus = 'REJECTED';
        break;
      case 'UPGRADE':
        newStatus = 'APPROVED';
        sqlLevel = 'PREMIUM';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update ad status
    const updatedAd = await prisma.advertisement.update({
      where: { id: adId },
      data: {
        status: newStatus,
        ...(sqlLevel && { sqlLevel }),
        verificationHistory: {
          create: {
            verifiedBy: session.user.id,
            action,
            reason,
            previousStatus: ad.status,
          },
        },
      },
    });

    // If upgraded to premium, sync with Wallet
    if (action === 'UPGRADE') {
      await syncWithWallet(ad.creatorId, {
        type: 'AD_UPGRADED_TO_PREMIUM',
        adId,
      });
    }

    return NextResponse.json({
      success: true,
      ad: {
        id: updatedAd.id,
        status: updatedAd.status,
        sqlLevel: updatedAd.sqlLevel,
      },
    });
  } catch (error) {
    console.error('Error verifying ad:', error);
    return NextResponse.json({ error: 'Failed to verify advertisement' }, { status: 500 });
  }
}

async function syncWithWallet(userId: string, data: any) {
  // TODO: Implement Wallet sync
  console.log('Syncing with Wallet:', { userId, data });
}
