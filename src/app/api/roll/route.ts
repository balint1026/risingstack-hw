import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, bet } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    if (typeof bet !== 'number' || bet <= 0 || !Number.isInteger(bet)) {
      return NextResponse.json({ error: 'Bet must be a positive integer' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.money < bet) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    const outcomes = ['Double', 'Keep', 'Bankrupt!'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];

    let newMoney = user.money;
    if (result === 'Double') {
      newMoney += bet;
    } else if (result === 'Bankrupt!') {
      newMoney -= bet; 
    } 

    const updatedUser = await prisma.user.update({
      where: { username },
      data: { money: newMoney },
    });

    return NextResponse.json({ result, money: updatedUser.money });
  } catch (error) {
    console.error('Error in /api/roll:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}