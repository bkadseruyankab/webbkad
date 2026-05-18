import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token && (globalThis as Record<string, unknown>).__authTokens) {
      ((globalThis as Record<string, unknown>).__authTokens as Map<string, unknown>).delete(token);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AUTH_LOGOUT]', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
