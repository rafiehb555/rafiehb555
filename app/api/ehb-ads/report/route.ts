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

    const body = await req.json();
    const { adId, reason, reportType } = body;

    // Validate required fields
    if (!adId || !reason || !reportType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if ad exists
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

    // Create report
    const report = await prisma.adReport.create({
      data: {
        adId,
        reporterId: session.user.id,
        reportType,
        reason,
        status: 'PENDING',
      },
    });

    // Notify franchise if creator is local
    if (ad.creator.franchiseId) {
      await notifyFranchise(ad.creator.franchiseId, {
        type: 'AD_REPORT',
        adId,
        reportId: report.id,
        creatorId: ad.creator.id,
      });
    }

    // Update ad status if report count exceeds threshold
    const reportCount = await prisma.adReport.count({
      where: {
        adId,
        status: 'PENDING',
      },
    });

    if (reportCount >= 3) {
      await prisma.advertisement.update({
        where: { id: adId },
        data: { status: 'UNDER_REVIEW' },
      });
    }

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        status: report.status,
      },
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

async function notifyFranchise(franchiseId: string, data: any) {
  // TODO: Implement franchise notification
  console.log('Notifying franchise:', { franchiseId, data });
}
