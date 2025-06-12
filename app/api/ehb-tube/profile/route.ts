import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId') || session?.user?.id;

    if (!creatorId) {
      return NextResponse.json({ error: 'Creator ID required' }, { status: 400 });
    }

    // Get creator profile
    const creator = await prisma.userProfile.findUnique({
      where: { userId: creatorId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        sqlLevel: true,
        franchiseId: true,
      },
    });

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    // Get video statistics
    const videoStats = await prisma.video.aggregate({
      where: {
        creatorId,
        status: 'PUBLISHED',
      },
      _count: {
        id: true,
      },
      _sum: {
        views: true,
      },
    });

    // Get monetization data if eligible
    let monetizationData = null;
    if (creator.sqlLevel !== 'FREE') {
      const earnings = await prisma.videoEarning.aggregate({
        where: {
          video: {
            creatorId,
          },
        },
        _sum: {
          amount: true,
        },
      });

      monetizationData = {
        totalEarnings: earnings._sum.amount || 0,
        isMonetized: true,
      };
    }

    // Get recent videos
    const recentVideos = await prisma.video.findMany({
      where: {
        creatorId,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        views: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // Get franchise data if applicable
    let franchiseData = null;
    if (creator.franchiseId) {
      const franchise = await prisma.franchise.findUnique({
        where: { id: creator.franchiseId },
        select: {
          id: true,
          name: true,
          location: true,
        },
      });

      if (franchise) {
        franchiseData = {
          id: franchise.id,
          name: franchise.name,
          location: franchise.location,
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        creator: {
          id: creator.id,
          name: creator.name,
          avatarUrl: creator.avatarUrl,
          sqlLevel: creator.sqlLevel,
        },
        stats: {
          totalVideos: videoStats._count.id,
          totalViews: videoStats._sum.views || 0,
          ...monetizationData,
        },
        recentVideos,
        franchise: franchiseData,
      },
    });
  } catch (error) {
    console.error('Error fetching creator profile:', error);
    return NextResponse.json({ error: 'Failed to fetch creator profile' }, { status: 500 });
  }
}
