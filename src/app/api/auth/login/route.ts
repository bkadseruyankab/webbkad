import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user || !user.active) {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const token = generateToken();

    // Store token in a simple in-memory store
    if (!(globalThis as Record<string, unknown>).__authTokens) {
      (globalThis as Record<string, unknown>).__authTokens = new Map();
    }
    ((globalThis as Record<string, unknown>).__authTokens as Map<string, Record<string, unknown>>).set(token, {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error('[AUTH_LOGIN]', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
