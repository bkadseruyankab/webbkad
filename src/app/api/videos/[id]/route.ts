import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.video.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[VIDEOS_GET_ONE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video' },
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

    const existing = await db.video.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    const data = await db.video.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[VIDEOS_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update video' },
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

    const existing = await db.video.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    await db.video.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[VIDEOS_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
