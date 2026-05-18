import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const category = searchParams.get('category');

    const where: Record<string, unknown> = showAll ? {} : { active: true };

    if (category) {
      where.category = category;
    }

    const data = await db.publication.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error('[PUBLICATIONS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, fileUrl, coverImage, date, order, active } = body;

    if (!title || !description || !category || !date) {
      return NextResponse.json(
        { success: false, error: 'title, description, category, and date are required' },
        { status: 400 }
      );
    }

    const data = await db.publication.create({
      data: {
        title,
        description,
        category,
        fileUrl: fileUrl ?? '',
        coverImage: coverImage ?? '',
        date,
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[PUBLICATIONS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create publication' },
      { status: 500 }
    );
  }
}
