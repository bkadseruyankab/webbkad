import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.news.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[NEWS_GET_ONE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    const { title, excerpt, content, date, category, image, readTime, order, active } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (date !== undefined) updateData.date = date;
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (readTime !== undefined) updateData.readTime = readTime;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;

    const data = await db.news.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[NEWS_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    await db.news.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NEWS_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}
