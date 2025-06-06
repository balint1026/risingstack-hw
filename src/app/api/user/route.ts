import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json({ error: 'Username must be a non-empty string' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: username.trim(),
          money: 100,
        },
      });
    }

    return NextResponse.json({ username: user.username, money: user.money });
  } catch (error) {
    console.error('Error in /api/user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
