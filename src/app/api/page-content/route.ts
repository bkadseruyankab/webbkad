import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const data = await db.pageContent.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error('[PAGE_CONTENT_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, content, image } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { success: false, error: 'slug, title, and content are required' },
        { status: 400 }
      );
    }

    const existing = await db.pageContent.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 409 }
      );
    }

    const data = await db.pageContent.create({
      data: {
        slug,
        title,
        content,
        image: image ?? '',
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[PAGE_CONTENT_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create page content' },
      { status: 500 }
    );
  }
}
