import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    // Get filter parameters
    const category = searchParams.get('category');
    const region = searchParams.get('region');
    const sqlLevel = searchParams.get('sqlLevel');
    const adType = searchParams.get('adType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter conditions
    const where: any = {
      status: 'APPROVED',
    };

    // Apply category filter
    if (category) {
      where.category = category;
    }

    // Apply region filter
    if (region) {
      where.region = region;
    }

    // Apply ad type filter
    if (adType) {
      where.adType = adType;
    }

    // Apply SQL level filter
    if (sqlLevel) {
      where.sqlLevel = sqlLevel;
    } else if (!session?.user) {
      // Non-authenticated users can only see FREE content
      where.sqlLevel = 'FREE';
    }

    // Get total count for pagination
    const total = await prisma.advertisement.count({ where });

    // Fetch ads with pagination
    const ads = await prisma.advertisement.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            sqlLevel: true,
            franchiseId: true,
          },
        },
        _count: {
          select: {
            views: true,
            clicks: true,
          },
        },
      },
      orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format response
    const formattedAds = ads.map(ad => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      category: ad.category,
      adType: ad.adType,
      region: ad.region,
      isPremium: ad.isPremium,
      images: ad.images,
      sqlLevel: ad.sqlLevel,
      views: ad._count.views,
      clicks: ad._count.clicks,
      creator: {
        id: ad.creator.id,
        name: ad.creator.name,
        avatarUrl: ad.creator.avatarUrl,
        sqlLevel: ad.creator.sqlLevel,
        isFranchise: !!ad.creator.franchiseId,
      },
      createdAt: ad.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        ads: formattedAds,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ error: 'Failed to fetch advertisements' }, { status: 500 });
  }
}
