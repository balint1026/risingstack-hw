import { POST } from '@/app/api/user/route';
import { NextRequest } from 'next/server';

jest.mock('@/generated/prisma', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe('POST /api/user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user if username does not exist', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'newuser' }),
    } as unknown as NextRequest;

    const mockUser = { username: 'newuser', money: 100 };

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(mockUser);

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ username: 'newuser', money: 100 });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'newuser' },
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { username: 'newuser', money: 100 },
    });
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return existing user if username exists', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'existinguser' }),
    } as unknown as NextRequest;

    const mockUser = { username: 'existinguser', money: 200 };

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();
    prisma.user.findUnique.mockResolvedValue(mockUser);

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ username: 'existinguser', money: 200 });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'existinguser' },
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for empty username', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: '' }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Username must be a non-empty string' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for whitespace-only username', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: '   ' }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Username must be a non-empty string' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 400 for non-string username', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 123 }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Username must be a non-empty string' });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return 500 for database errors', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ username: 'erroruser' }),
    } as unknown as NextRequest;

    const prisma = jest.requireMock('@/generated/prisma').PrismaClient();
    prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Internal Server Error' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'erroruser' },
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });
});