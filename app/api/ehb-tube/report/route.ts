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
    const { videoId, reportType, reason } = body;

    // Validate required fields
    if (!videoId || !reportType || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        creator: {
          select: {
            id: true,
            franchiseId: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Create report
    const report = await prisma.videoReport.create({
      data: {
        videoId,
        reporterId: session.user.id,
        reportType,
        reason,
        status: 'PENDING',
      },
    });

    // Notify franchise if creator is local
    if (video.creator.franchiseId) {
      await notifyFranchise(video.creator.franchiseId, {
        type: 'VIDEO_REPORT',
        videoId,
        reportId: report.id,
        creatorId: video.creator.id,
      });
    }

    // Update video status if report count exceeds threshold
    const reportCount = await prisma.videoReport.count({
      where: {
        videoId,
        status: 'PENDING',
      },
    });

    if (reportCount >= 5) {
      await prisma.video.update({
        where: { id: videoId },
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
