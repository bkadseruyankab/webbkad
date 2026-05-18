import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = showAll ? {} : { active: true };

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const data = await db.news.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    let result = data;
    if (limit) {
      result = data.slice(0, parseInt(limit));
    }

    return NextResponse.json({ success: true, data: result, total: result.length });
  } catch (error) {
    console.error('[NEWS_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, date, category, image, readTime, order, active } = body;

    if (!title || !excerpt || !date || !category || !image) {
      return NextResponse.json(
        { success: false, error: 'title, excerpt, date, category, and image are required' },
        { status: 400 }
      );
    }

    const data = await db.news.create({
      data: {
        title,
        excerpt,
        content: content ?? '',
        date,
        category,
        image,
        readTime: readTime ?? '',
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[NEWS_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    );
  }
}
