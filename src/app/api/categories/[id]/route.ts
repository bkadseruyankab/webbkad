import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await db.category.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[CATEGORIES_GET_ONE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
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

    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const { name, slug, description, module, color, order, active, images } = body;
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) {
      // Check slug uniqueness if changing
      if (slug !== existing.slug) {
        const slugExists = await db.category.findUnique({
          where: { slug },
        });
        if (slugExists) {
          return NextResponse.json(
            {
              success: false,
              error: 'A category with this slug already exists',
            },
            { status: 409 }
          );
        }
      }
      updateData.slug = slug;
    }
    if (description !== undefined) updateData.description = description;
    if (module !== undefined) updateData.module = module;
    if (color !== undefined) updateData.color = color;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;
    if (images !== undefined) updateData.images = images;

    const data = await db.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[CATEGORIES_PUT]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
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

    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    await db.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CATEGORIES_DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
