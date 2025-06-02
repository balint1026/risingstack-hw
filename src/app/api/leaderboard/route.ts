import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

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
  } finally {
    await prisma.$disconnect();
  }
}