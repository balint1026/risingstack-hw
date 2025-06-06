import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      orderBy: { money: 'desc' },
      select: { username: true, money: true },
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error in /api/leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}