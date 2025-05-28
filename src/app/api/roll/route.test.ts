import { POST } from '@/app/api/roll/route';
import { NextRequest } from 'next/server';

jest.mock('@/generated/prisma', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe('POST /api/roll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process a bet with Double outcome', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'testuser', bet: 50 }),
    } as unknown as NextRequest;

    const mockUser = { username: 'testuser', money: 100 };
    const mockUpdatedUser = { username: 'testuser', money: 150 };

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.user.update.mockResolvedValue(mockUpdatedUser);

    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ result: 'Double', money: 150 });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { username: 'testuser' },
      data: { money: 150 },
    });
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);

    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should process a bet with Keep outcome', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'testuser', bet: 50 }),
    } as unknown as NextRequest;

    const mockUser = { username: 'testuser', money: 100 };

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.user.update.mockResolvedValue(mockUser);

    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ result: 'Keep', money: 100 });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { username: 'testuser' },
      data: { money: 100 },
    });
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);

    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should process a bet with Bankrupt! outcome', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'testuser', bet: 50 }),
    } as unknown as NextRequest;

    const mockUser = { username: 'testuser', money: 100 };
    const mockUpdatedUser = { username: 'testuser', money: 50 };

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.user.update.mockResolvedValue(mockUpdatedUser);

    jest.spyOn(global.Math, 'random').mockReturnValue(0.9);

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ result: 'Bankrupt!', money: 50 });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { username: 'testuser' },
      data: { money: 50 },
    });
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);

    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should return 400 for invalid username', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: '', bet: 50 }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid username' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for non-string username', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 123, bet: 50 }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid username' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for invalid bet (non-number)', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'testuser', bet: 'invalid' }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Bet must be a positive integer' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for invalid bet (negative)', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'testuser', bet: -50 }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Bet must be a positive integer' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for invalid bet (non-integer)', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'testuser', bet: 50.5 }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Bet must be a positive integer' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for invalid bet (zero)', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'testuser', bet: 0 }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Bet must be a positive integer' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 404 for non-existent user', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'nonexistent', bet: 50 }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();
    prisma.user.findUnique.mockResolvedValue(null);

    const response = await POST(mockRequest);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'User not found' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'nonexistent' },
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for insufficient funds', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'testuser', bet: 150 }),
    } as unknown as NextRequest;

    const mockUser = { username: 'testuser', money: 100 };

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();
    prisma.user.findUnique.mockResolvedValue(mockUser);

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Insufficient funds' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 500 for database errors', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'testuser', bet: 50 }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();
    prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Internal Server Error' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });
});