import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleFilter = searchParams.get('module');
    const activeFilter = searchParams.get('active');

    const where: Record<string, unknown> = {};

    if (moduleFilter) {
      where.module = moduleFilter;
    }

    if (activeFilter !== null) {
      where.active = activeFilter === 'true';
    }

    const data = await db.category.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[CATEGORIES_GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, module, color, order, active, images } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'name is required' },
        { status: 400 }
      );
    }

    // Auto-generate slug from name if not provided
    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    // Check for slug uniqueness
    const existing = await db.category.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }

    const data = await db.category.create({
      data: {
        name,
        slug: generatedSlug,
        description: description ?? '',
        module: module ?? 'general',
        color: color ?? '#0D6B3F',
        order: order ?? 0,
        active: active ?? true,
        images: images ?? '[]',
      },
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('[CATEGORIES_POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
