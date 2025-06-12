import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    // Get filter parameters
    const sqlLevel = searchParams.get('sqlLevel');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const creatorId = searchParams.get('creatorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter conditions
    const where: any = {
      status: 'PUBLISHED',
    };

    // Apply SQL level filter
    if (sqlLevel) {
      where.sqlLevel = sqlLevel;
    } else if (!session?.user) {
      // Non-authenticated users can only see FREE content
      where.sqlLevel = 'FREE';
    }

    // Apply category filter
    if (category) {
      where.category = category;
    }

    // Apply tag filter
    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    // Apply creator filter
    if (creatorId) {
      where.creatorId = creatorId;
    }

    // Get total count for pagination
    const total = await prisma.video.count({ where });

    // Fetch videos with pagination
    const videos = await prisma.video.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            sqlLevel: true,
          },
        },
        _count: {
          select: {
            views: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format response
    const formattedVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnailUrl: video.thumbnailUrl,
      tags: video.tags,
      isVip: video.isVip,
      sqlLevel: video.sqlLevel,
      views: video._count.views,
      likes: video._count.likes,
      creator: {
        id: video.creator.id,
        name: video.creator.name,
        avatarUrl: video.creator.avatarUrl,
        sqlLevel: video.creator.sqlLevel,
      },
      createdAt: video.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        videos: formattedVideos,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
