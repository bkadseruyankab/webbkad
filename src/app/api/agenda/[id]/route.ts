import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.agenda.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Agenda not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[AGENDA_GET_ONE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agenda' },
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

    const existing = await db.agenda.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Agenda not found' },
        { status: 404 }
      );
    }

    const data = await db.agenda.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[AGENDA_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update agenda' },
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

    const existing = await db.agenda.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Agenda not found' },
        { status: 404 }
      );
    }

    await db.agenda.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AGENDA_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete agenda' },
      { status: 500 }
    );
  }
}
