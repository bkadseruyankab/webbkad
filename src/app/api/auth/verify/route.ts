import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }

    if (!(globalThis as Record<string, unknown>).__authTokens) {
      return NextResponse.json(
        { success: false, error: 'Sesi tidak valid' },
        { status: 401 }
      );
    }

    const session = ((globalThis as Record<string, unknown>).__authTokens as Map<string, Record<string, unknown>>).get(token);

    if (!session || (session.expiresAt as number) < Date.now()) {
      if (session) {
        ((globalThis as Record<string, unknown>).__authTokens as Map<string, Record<string, unknown>>).delete(token);
      }
      return NextResponse.json(
        { success: false, error: 'Sesi telah berakhir' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    });
  } catch (error) {
    console.error('[AUTH_VERIFY]', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
