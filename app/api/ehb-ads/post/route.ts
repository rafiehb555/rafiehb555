import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyUserEligibility } from '@/lib/verification';
import { moderateContent } from '@/lib/ai-moderation';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const adType = formData.get('adType') as string;
    const description = formData.get('description') as string;
    const images = formData.getAll('images') as File[];
    const region = formData.get('region') as string;
    const isPremium = formData.get('isPremium') === 'true';

    // Validate required fields
    if (!title || !category || !adType || !description || !region) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user eligibility
    const eligibility = await verifyUserEligibility(session.user.id);
    if (!eligibility.isEligible) {
      return NextResponse.json({ error: eligibility.reason }, { status: 403 });
    }

    // Get user's SQL level
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
      select: { sqlLevel: true },
    });

    if (!userProfile || userProfile.sqlLevel === 'FREE') {
      return NextResponse.json({ error: 'SQL level too low for posting ads' }, { status: 403 });
    }

    // Verify category exists in EMO
    const categoryExists = await prisma.category.findUnique({
      where: { id: category },
    });

    if (!categoryExists) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Handle image uploads
    const imageUrls = await Promise.all(images.map(image => handleImageUpload(image)));

    // AI content moderation
    const moderationResult = await moderateContent({
      title,
      description,
      images: imageUrls,
    });

    if (!moderationResult.isApproved) {
      return NextResponse.json(
        {
          error: 'Content violates guidelines',
          details: moderationResult.reasons,
        },
        { status: 400 }
      );
    }

    // Create ad record
    const ad = await prisma.advertisement.create({
      data: {
        title,
        description,
        category,
        adType,
        region,
        isPremium,
        status: 'PENDING_REVIEW',
        creatorId: session.user.id,
        sqlLevel: userProfile.sqlLevel,
        images: imageUrls,
        moderationFlags: moderationResult.flags || [],
      },
    });

    // Sync with Wallet if premium ad
    if (isPremium) {
      await syncWithWallet(session.user.id, {
        type: 'PREMIUM_AD_CREATED',
        adId: ad.id,
      });
    }

    return NextResponse.json({
      success: true,
      ad: {
        id: ad.id,
        title: ad.title,
        status: ad.status,
      },
    });
  } catch (error) {
    console.error('Ad creation error:', error);
    return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 });
  }
}

async function handleImageUpload(file: File): Promise<string> {
  // TODO: Implement image storage solution
  // This could be AWS S3, Google Cloud Storage, etc.
  return 'https://storage.example.com/ads/placeholder.jpg';
}

async function syncWithWallet(userId: string, data: any) {
  // TODO: Implement Wallet sync
  console.log('Syncing with Wallet:', { userId, data });
}
